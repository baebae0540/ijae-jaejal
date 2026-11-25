/** 마이크 소리 크기만 재요 (녹음·저장 없음). 후~ 불기 감지용 */
let level = 0
let ctx: AudioContext | null = null
let stream: MediaStream | null = null
let starting: Promise<boolean> | null = null

/** 이 값보다 크면 "불고 있다"로 봐요 */
export const BLOW_LEVEL = 0.04

export const micLevel = () => level

/** 아이폰은 AudioContext가 '일시정지' 상태로 시작해서, 터치할 때 다시 깨워야 소리가 들어와요. */
function resume() {
  if (ctx && ctx.state !== 'running') ctx.resume().catch(() => {})
}
if (typeof document !== 'undefined') {
  document.addEventListener('pointerdown', resume, { capture: true })
  // 앱을 나갔다 오면 아이폰이 마이크를 끊어 버려서 다시 연결해요
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState !== 'visible' || !stream) return
    if (stream.getAudioTracks().every(t => t.readyState === 'ended')) { stopMic(); startMic() }
    else resume()
  })
}

function stopMic() {
  stream?.getTracks().forEach(t => t.stop())
  ctx?.close().catch(() => {})
  stream = null; ctx = null; level = 0
}

export function startMic(): Promise<boolean> {
  if (stream && stream.getAudioTracks().some(t => t.readyState === 'live')) { resume(); return Promise.resolve(true) }
  starting ??= open().finally(() => { starting = null })
  return starting
}

async function open(): Promise<boolean> {
  try {
    const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    // 터치 직후(사용자 동작 안)에 만들어야 아이폰에서 바로 'running'이 돼요
    const c = new Ctx()
    c.resume().catch(() => {})
    // 잡음 제거·자동 음량을 끄지 않으면 "후~" 바람 소리를 잡음으로 보고 지워 버려요
    const s = await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false }
    })
    ctx = c; stream = s
    const an = c.createAnalyser(); an.fftSize = 1024
    c.createMediaStreamSource(s).connect(an)
    const buf = new Uint8Array(an.fftSize)
    const loop = () => {
      if (ctx !== c) return
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
  }
}
