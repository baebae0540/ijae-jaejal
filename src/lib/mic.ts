/** 마이크 소리 크기만 재요 (녹음·저장 없음). 후~ 불기 감지용 */
let level = 0
let started = false

export const micLevel = () => level

export async function startMic(): Promise<boolean> {
  if (started) return true
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    const ctx = new Ctx()
    const an = ctx.createAnalyser(); an.fftSize = 1024
    ctx.createMediaStreamSource(stream).connect(an)
    const buf = new Uint8Array(an.fftSize)
    const loop = () => {
      an.getByteTimeDomainData(buf)
      let sum = 0
      for (const v of buf) { const x = (v - 128) / 128; sum += x * x }
      level = Math.sqrt(sum / buf.length)
      requestAnimationFrame(loop)
    }
    loop()
    started = true
    return true
  } catch {
    return false
  }
}
