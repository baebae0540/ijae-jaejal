/**
 * 내레이션 엔진
 * - 웹(PWA): Web Speech API / 앱(Capacitor): 기기 TTS 플러그인 + 화면 켜두기
 * - 문장 단위로 끊어 읽고, 문장 사이에 쉬는 시간을 넣어 느긋한 말 본보기를 들려줘요.
 * - playSeq를 새로 부르면 이전 재생은 자동으로 멈춰요 (runId 토큰).
 * - 목소리는 voiceURI(문자열)로 저장해요. 기기마다 목록 순서가 달라서 번호로 저장하면 안 돼요.
 */
import { Capacitor } from '@capacitor/core'
import { TextToSpeech } from '@capacitor-community/text-to-speech'
import { KeepAwake } from '@capacitor-community/keep-awake'

export type SpeechItem =
  | { text: string; rate?: number; ref?: string; p?: number }
  | { pause: number; ref?: string; p?: number }

export interface VoiceOption { id: string; name: string }

const isNative = Capacitor.isNativePlatform()
const hasWebTTS = !isNative && typeof window !== 'undefined' && 'speechSynthesis' in window
const canSpeak = isNative || hasWebTTS

let wanted = ''          // 설정에서 고른 voiceURI ('' = 자동)
let pitch = 1.05
let webVoice: SpeechSynthesisVoice | null = null
let nativeIdx: number | undefined
let nativeName = ''
let runId = 0

const isKo = (lang: string) => /^ko/i.test(lang)
const autoPick = <T extends { name: string }>(vs: T[]) => vs.find(v => /yuna|sora|female|여/i.test(v.name)) ?? vs[0]

/** 이 기기에서 고를 수 있는 한국어 목소리 목록 */
export async function listVoices(): Promise<VoiceOption[]> {
  if (isNative) {
    try {
      const { voices } = await TextToSpeech.getSupportedVoices()
      return voices.filter(v => isKo(v.lang)).map(v => ({ id: v.voiceURI, name: v.name }))
    } catch { return [] }
  }
  if (!hasWebTTS) return []
  return speechSynthesis.getVoices().filter(v => isKo(v.lang)).map(v => ({ id: v.voiceURI, name: v.name }))
}

async function resolveVoice() {
  if (isNative) {
    try {
      const { voices } = await TextToSpeech.getSupportedVoices()
      const ko = voices.map((v, i) => ({ ...v, i })).filter(v => isKo(v.lang))
      const v = ko.find(v => v.voiceURI === wanted) ?? autoPick(ko)
      nativeIdx = v?.i; nativeName = v?.name ?? ''
    } catch { nativeIdx = undefined; nativeName = '' }
    return
  }
  if (!hasWebTTS) return
  const ko = speechSynthesis.getVoices().filter(v => isKo(v.lang))
  webVoice = ko.find(v => v.voiceURI === wanted) ?? autoPick(ko) ?? null
}

/** 설정에서 고른 목소리·높낮이 반영 */
export async function setVoice(voiceId: string | undefined, voicePitch: number | undefined) {
  wanted = voiceId ?? ''
  pitch = voicePitch ?? 1.05
  await resolveVoice()
}

/** 지금 쓰는 목소리 안내 문구 */
export function voiceStatus(): string {
  if (!canSpeak) return '이 기기는 음성 읽기를 지원하지 않아요.'
  const name = isNative ? nativeName : webVoice?.name
  return name ? `읽는 목소리: ${name}` : '한국어 음성을 찾지 못했어요. 기기 설정에서 한국어 음성을 내려받아 주세요.'
}

/** 목소리 목록이 늦게 채워지는 브라우저(크롬 등) 대비 */
export function onVoicesChanged(cb: () => void) {
  if (!hasWebTTS) return () => {}
  const h = () => { resolveVoice(); cb() }
  speechSynthesis.addEventListener('voiceschanged', h)
  return () => speechSynthesis.removeEventListener('voiceschanged', h)
}
if (canSpeak) resolveVoice()

/** iOS Safari는 첫 재생이 사용자 터치 안에서 시작돼야 해서, 첫 터치 때 빈 발화로 잠금을 풀어요. */
let unlocked = false
if (hasWebTTS && typeof document !== 'undefined') {
  document.addEventListener('pointerdown', () => {
    if (unlocked) return
    unlocked = true
    try { const u = new SpeechSynthesisUtterance(' '); u.volume = 0; speechSynthesis.speak(u) } catch { /* 무시 */ }
  }, { capture: true })
}

/**
 * 읽는 동안 화면이 꺼지지 않게 해요 (꺼지면 읽기가 멈춰요).
 * - 앱: keep-awake 플러그인 / 웹(PWA): Screen Wake Lock API (iOS 18.4+ 홈 화면 앱, 안드로이드 크롬)
 * - 다 읽은 뒤에도 잠깐(RELEASE_DELAY) 유지해서 페이지 넘김·후~ 불기 사이에 화면이 꺼지지 않게 해요.
 */
const RELEASE_DELAY = 60_000
let awake = false
let releaseTimer: ReturnType<typeof setTimeout> | undefined
let webLock: WakeLockSentinel | null = null

async function webLockOn() {
  if (webLock || typeof navigator === 'undefined' || !('wakeLock' in navigator)) return
  try {
    const lock = await navigator.wakeLock.request('screen')
    if (!awake) { lock.release().catch(() => {}); return }   // 기다리는 사이에 꺼졌으면 바로 풀기
    webLock = lock
    lock.addEventListener('release', () => { if (webLock === lock) webLock = null })
  } catch { /* 지원 안 함·권한 없음 */ }
}
// 다른 앱에 갔다 오면 브라우저가 잠금을 풀어서, 돌아왔을 때 다시 잡아요.
if (!isNative && typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (awake && document.visibilityState === 'visible') webLockOn()
  })
}

function setAwake(on: boolean) {
  if (awake === on) return
  awake = on
  if (isNative) { (on ? KeepAwake.keepAwake() : KeepAwake.allowSleep()).catch(() => {}); return }
  if (on) webLockOn()
  else { webLock?.release().catch(() => {}); webLock = null }
}

function keepAwake(on: boolean, delay = 0) {
  clearTimeout(releaseTimer)
  if (on || !delay) setAwake(on)
  else releaseTimer = setTimeout(() => setAwake(false), delay)
}

export const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms))

function cancelAll() {
  if (isNative) TextToSpeech.stop().catch(() => {})
  else if (hasWebTTS) speechSynthesis.cancel()
}

export function stopSpeech() {
  runId++
  cancelAll()
  keepAwake(false, RELEASE_DELAY)
}

function speak(text: string, rate: number) {
  return new Promise<void>(res => {
    let done = false
    const fin = () => { if (!done) { done = true; clearTimeout(t); res() } }
    // 끝 신호가 안 오는 경우 대비 안전 타이머
    const t = setTimeout(fin, 1200 + text.length * (canSpeak ? 420 : 140) / rate)
    if (isNative) {
      // category 'playback': 아이폰 무음 스위치가 켜져 있어도 소리가 나요
      TextToSpeech.speak({ text, lang: 'ko-KR', rate, pitch, voice: nativeIdx, category: 'playback' }).then(fin, fin)
      return
    }
    if (!hasWebTTS) return
    try {
      const u = new SpeechSynthesisUtterance(text)
      u.lang = 'ko-KR'; if (webVoice) u.voice = webVoice
      u.rate = rate; u.pitch = pitch
      u.onend = fin; u.onerror = fin
      speechSynthesis.speak(u)
    } catch { fin() }
  })
}

/** 순서대로 읽기. 끝까지 읽으면 true, 중간에 멈추면 false */
export async function playSeq(items: SpeechItem[], rate: number, onItem?: (it: SpeechItem, i: number) => void) {
  const id = ++runId
  cancelAll()
  keepAwake(true)
  await sleep(60)
  for (let i = 0; i < items.length; i++) {
    if (id !== runId) return false
    const it = items[i]
    onItem?.(it, i)
    if ('pause' in it) await sleep(it.pause)
    else await speak(it.text, it.rate ?? rate)
  }
  if (id === runId) keepAwake(false, RELEASE_DELAY)
  return id === runId
}

/** 문장 단위로 자르기 (마침표·느낌표·물음표·말줄임표·물결 기준) */
export const sentences = (t: string) =>
  (t.match(/[^.!?…~]+[.!?…~]*/g) ?? []).map(s => s.trim()).filter(Boolean)
