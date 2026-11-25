/**
 * 마이크 소리 크기만 재요 (녹음·저장 없음). 후~ 불기 감지용
 * - 후~ 불기 화면(또는 설정의 마이크 테스트)이 떠 있는 동안에만 마이크를 켜고, 사라지면 바로 꺼요.
 *   아이폰은 마이크가 켜져 있으면 오디오를 통화 모드로 바꿔서 읽어 주는 소리가 작아지기 때문이에요.
 * - startMic / stopMic는 짝으로 불러요 (쓰는 곳이 여럿이면 마지막 하나가 끝날 때 꺼져요).
 */
let level = 0
let ctx: AudioContext | null = null
let stream: MediaStream | null = null
let source: MediaStreamAudioSourceNode | null = null
let users = 0
let opening: Promise<boolean> | null = null

/** 이 값보다 크면 "불고 있다"로 봐요 (설정의 마이크 감도로 바뀜) */
export const DEFAULT_BLOW_LEVEL = 0.02
let blow = DEFAULT_BLOW_LEVEL
export const blowLevel = () => blow
export const setBlowLevel = (v: number | undefined) => { blow = v ?? DEFAULT_BLOW_LEVEL }

export const micLevel = () => level

/**
 * 아이폰은 AudioContext를 사용자 터치 안에서 만들거나 깨워야 소리가 들어와요.
 * 후~ 불기 화면은 읽기가 끝나면 저절로 뜨므로(터치 없음), 미리 아무 터치 때 만들어 깨워 둬요.
 * AudioContext만 있고 마이크가 꺼져 있으면 아이폰 오디오는 보통 모드 그대로예요.
 */
let wanted = false
export function prepareMic(on: boolean) { wanted = on }
function ensureCtx() {
  if (!ctx) {
    const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    ctx = new Ctx()
  }
  if (ctx.state !== 'running') ctx.resume().catch(() => {})
  return ctx
}
if (typeof document !== 'undefined') {
  document.addEventListener('pointerdown', () => { if (wanted || users > 0) ensureCtx() }, { capture: true })
  // 앱을 나갔다 오면 아이폰이 마이크를 끊어 버려서, 쓰는 중이었다면 다시 연결해요
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState !== 'visible' || users === 0) return
    if (!stream || stream.getAudioTracks().every(t => t.readyState === 'ended')) { closeStream(); open() }
  })
}

function closeStream() {
  source?.disconnect()
  stream?.getTracks().forEach(t => t.stop())   // 이걸 해야 상단 주황색 점이 꺼져요
  source = null; stream = null; level = 0
}

/** 마이크 켜기 (권한이 없으면 false) */
export function startMic(): Promise<boolean> {
  users++
  return open()
}

/** 마이크 끄기 */
export function stopMic() {
  users = Math.max(0, users - 1)
  if (users === 0) closeStream()
}

function open(): Promise<boolean> {
  if (stream && stream.getAudioTracks().some(t => t.readyState === 'live')) { ensureCtx(); return Promise.resolve(true) }
  opening ??= (async () => {
    try {
      const c = ensureCtx()
      // 잡음 제거·자동 음량을 끄지 않으면 "후~" 바람 소리를 잡음으로 보고 지워 버려요
      const s = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false }
      })
      if (users === 0) { s.getTracks().forEach(t => t.stop()); return false }   // 여는 사이에 화면이 닫힘
      stream = s
      source = c.createMediaStreamSource(s)
      const an = c.createAnalyser(); an.fftSize = 1024
      source.connect(an)
      const buf = new Uint8Array(an.fftSize)
      const loop = () => {
        if (stream !== s) return
        an.getByteTimeDomainData(buf)
        let sum = 0
        for (const v of buf) { const x = (v - 128) / 128; sum += x * x }
        // 순간 값이 들쭉날쭉해서 살짝 부드럽게
        level = level * 0.6 + Math.sqrt(sum / buf.length) * 0.4
        requestAnimationFrame(loop)
      }
      loop()
      return true
    } catch {
      return false
    } finally {
      opening = null
    }
  })()
  return opening
}
