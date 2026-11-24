import { useMemo, useState } from 'react'
import { iconSVG } from '../art/art'
import { useLongPress } from '../lib/hooks'

export function Home({ onCar, onBook, onSettings }: { onCar: () => void; onBook: () => void; onSettings: () => void }) {
  const [holding, setHolding] = useState(false)
  const lp = useLongPress(1500, () => { setHolding(false); onSettings() })
  const logo = useMemo(() => iconSVG('dino'), [])
  return (
    <section className="screen" id="home">
      <button className={'gear' + (holding ? ' holding' : '')} aria-label="보호자 설정"
        onPointerDown={() => { setHolding(true); lp.onPointerDown() }}
        onPointerUp={() => { setHolding(false); lp.onPointerUp() }}
        onPointerLeave={() => { setHolding(false); lp.onPointerLeave() }}>
        <span className="ring" />⚙️
      </button>
      {holding && <div className="hint" style={{ display: 'block' }}>보호자 설정: 꾹 누르세요</div>}
      <div className="logo" dangerouslySetInnerHTML={{ __html: logo }} />
      <h1>이야기 재잘재잘</h1>
      <div className="modes">
        <button className="mode car" onClick={onCar}>
          <span className="big"><svg viewBox="0 0 100 70"><rect x="8" y="30" width="84" height="24" rx="10" fill="#F39A4B"/><path d="M22 32 L33 12 H66 L79 32Z" fill="#F39A4B"/><path d="M29 31 L36 17 H48 V31Z M52 31 V17 H63 L72 31Z" fill="#CFEFFF"/><rect x="84" y="37" width="8" height="6" rx="2" fill="#FFE38A"/><circle cx="28" cy="55" r="10" fill="#3B2F2A"/><circle cx="28" cy="55" r="4" fill="#D8D8D8"/><circle cx="72" cy="55" r="10" fill="#3B2F2A"/><circle cx="72" cy="55" r="4" fill="#D8D8D8"/></svg></span>
          차에서 듣기
        </button>
        <button className="mode book" onClick={onBook}>
          <span className="big"><svg viewBox="0 0 100 70"><path d="M50 14 Q30 4 8 10 V62 Q30 56 50 66Z" fill="#fff" stroke="#4FA36B" strokeWidth="3" strokeLinejoin="round"/><path d="M50 14 Q70 4 92 10 V62 Q70 56 50 66Z" fill="#fff" stroke="#4FA36B" strokeWidth="3" strokeLinejoin="round"/><path d="M16 22 Q30 18 42 24 M16 32 Q30 28 42 34 M16 42 Q30 38 42 44" stroke="#C9DCC9" strokeWidth="3" fill="none" strokeLinecap="round"/><circle cx="72" cy="34" r="12" fill="#7BC47F"/><circle cx="76" cy="31" r="2.4" fill="#3B2F2A"/><path d="M66 50 Q72 46 80 50" stroke="#F5A44A" strokeWidth="3" fill="none" strokeLinecap="round"/></svg></span>
          그림 보며 듣기
        </button>
      </div>
    </section>
  )
}
