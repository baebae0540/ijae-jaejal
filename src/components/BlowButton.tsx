import { useEffect, useRef, useState } from 'react'
import { blowLevel, micLevel, startMic } from '../lib/mic'

const NEED = 1.2 // 초 동안 불면 완료

/** 꾹 누르거나(기본) 마이크로 후~ 불면 게이지가 차요. 실패는 없고 천천히 줄어들기만 해요. */
export function BlowButton({ mic, onPuff, onDone }: { mic: boolean; onPuff: () => void; onDone: () => void }) {
  const [prog, setProg] = useState(0)
  const [holding, setHolding] = useState(false)
  const st = useRef({ prog: 0, holding: false, puffT: 0, done: false })

  useEffect(() => { if (mic) startMic() }, [mic])

  useEffect(() => {
    let raf = 0, last = performance.now()
    const tick = (t: number) => {
      const s = st.current, dt = (t - last) / 1000; last = t
      const blowing = s.holding || (mic && micLevel() > blowLevel())
      if (blowing) { s.prog += dt; s.puffT += dt; if (s.puffT > 0.12) { s.puffT = 0; onPuff() } }
      else s.prog = Math.max(0, s.prog - dt * 0.25)
      setProg(s.prog)
      if (s.prog >= NEED && !s.done) { s.done = true; onDone(); return }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [mic, onPuff, onDone])

  const set = (v: boolean) => { st.current.holding = v; setHolding(v) }
  return (
    <div className="blow">
      <button
        className={'blowbtn' + (holding ? ' holding' : '')}
        onPointerDown={e => { e.preventDefault(); (e.target as HTMLElement).setPointerCapture?.(e.pointerId); set(true) }}
        onPointerUp={() => set(false)} onPointerCancel={() => set(false)} onPointerLeave={() => set(false)}
      >
        <div className="fill" style={{ height: Math.min(100, prog / NEED * 100) + '%' }} />
        <span>
          <svg viewBox="0 0 100 64"><path d="M14 46 Q4 46 6 36 Q8 28 18 30 Q20 16 34 18 Q42 8 54 16 Q68 12 70 28 Q80 30 78 40 Q76 46 68 46Z" fill="#EAF6FF" stroke="#8CC7E0" strokeWidth="2.4"/><path d="M26 30 q3 2.4 6 0 M44 30 q3 2.4 6 0" stroke="#3B2F2A" strokeWidth="2" fill="none" strokeLinecap="round"/><circle cx="60" cy="36" r="4" fill="#F59AAE"/><path d="M74 30 H94 M76 38 H98 M74 46 H90" stroke="#8CC7E0" strokeWidth="3" strokeLinecap="round"/></svg>
          후~
        </span>
      </button>
      <div className="blowlabel">{mic ? '입으로 후~ 불어 봐! (꾹 눌러도 돼요)' : '꾹 누르고 후~ 불어 봐!'}</div>
    </div>
  )
}
