/**
 * 내레이션 엔진 (Web Speech API)
 * - 문장 단위로 끊어 읽고, 문장 사이에 쉬는 시간을 넣어 느긋한 말 본보기를 들려줘요.
 * - playSeq를 새로 부르면 이전 재생은 자동으로 멈춰요 (runId 토큰).
 * 2단계(Capacitor)에서는 이 파일만 네이티브 TTS 플러그인이나 녹음 파일 재생으로 바꾸면 돼요.
 */
export type SpeechItem =
  | { text: string; rate?: number; ref?: string; p?: number }
  | { pause: number; ref?: string; p?: number }

const hasTTS = typeof window !== 'undefined' && 'speechSynthesis' in window
let voice: SpeechSynthesisVoice | null = null
let runId = 0

export function pickVoice(): string {
  if (!hasTTS) return '이 기기는 음성 읽기를 지원하지 않아요.'
  const vs = speechSynthesis.getVoices().filter(v => /^ko/i.test(v.lang))
  voice = vs.find(v => /yuna|sora|female|여/i.test(v.name)) ?? vs[0] ?? null
  return voice ? `읽는 목소리: ${voice.name}` : '한국어 음성을 찾지 못했어요. 기기 설정에서 한국어 음성을 내려받아 주세요.'
}
if (hasTTS) { pickVoice(); speechSynthesis.onvoiceschanged = () => { pickVoice() } }

/** iOS는 첫 재생이 사용자 터치 안에서 시작돼야 해서, 첫 터치 때 빈 발화로 잠금을 풀어요. */
let unlocked = false
if (typeof document !== 'undefined') {
  document.addEventListener('pointerdown', () => {
    if (unlocked || !hasTTS) return
    unlocked = true
    try { const u = new SpeechSynthesisUtterance(' '); u.volume = 0; speechSynthesis.speak(u) } catch { /* 무시 */ }
  }, { capture: true })
}

export const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms))

export function stopSpeech() {
  runId++
  if (hasTTS) speechSynthesis.cancel()
}

function speak(text: string, rate: number) {
  return new Promise<void>(res => {
    let done = false
    const fin = () => { if (!done) { done = true; clearTimeout(t); res() } }
    // onend가 안 오는 브라우저 대비 안전 타이머
    const t = setTimeout(fin, 1200 + text.length * (hasTTS ? 420 : 140) / rate)
    if (!hasTTS) return
    try {
      const u = new SpeechSynthesisUtterance(text)
      u.lang = 'ko-KR'; if (voice) u.voice = voice
      u.rate = rate; u.pitch = 1.05
      u.onend = fin; u.onerror = fin
      speechSynthesis.speak(u)
    } catch { fin() }
  })
}

/** 순서대로 읽기. 끝까지 읽으면 true, 중간에 멈추면 false */
export async function playSeq(items: SpeechItem[], rate: number, onItem?: (it: SpeechItem, i: number) => void) {
  const id = ++runId
  if (hasTTS) speechSynthesis.cancel()
  await sleep(60)
  for (let i = 0; i < items.length; i++) {
    if (id !== runId) return false
    const it = items[i]
    onItem?.(it, i)
    if ('pause' in it) await sleep(it.pause)
    else await speak(it.text, it.rate ?? rate)
  }
  return id === runId
}

/** 문장 단위로 자르기 (마침표·느낌표·물음표·말줄임표·물결 기준) */
export const sentences = (t: string) =>
  (t.match(/[^.!?…~]+[.!?…~]*/g) ?? []).map(s => s.trim()).filter(Boolean)
