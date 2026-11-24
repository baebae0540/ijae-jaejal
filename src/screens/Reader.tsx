import { useCallback, useEffect, useRef, useState } from 'react'
import { Scene } from '../components/Scene'
import { BlowButton } from '../components/BlowButton'
import { playSeq, sentences, sleep, stopSpeech, type SpeechItem } from '../lib/speech'
import { fillName } from '../lib/text'
import type { Settings, Story } from '../data/types'

type Phase = 'reading' | 'blow' | 'after' | 'done'
const WIND = '<svg viewBox="0 0 40 24"><path d="M2 8 H24 Q32 8 32 2 M2 14 H30 Q38 14 38 20 M8 20 H18" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/></svg>'

export function Reader({ story, settings, onBack }: { story: Story; settings: Settings; onBack: () => void }) {
  const [p, setP] = useState(0)
  const [nonce, setNonce] = useState(0)        // 🔁 다시 듣기
  const [phase, setPhase] = useState<Phase>('reading')
  const [now, setNow] = useState<string | null>(null)
  const sceneRef = useRef<HTMLDivElement>(null)
  const windRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)

  const pg = story.pages[p]
  const fill = (t: string) => fillName(t, settings.name)
  const textS = sentences(fill(pg.text))
  const afterS = pg.after ? sentences(fill(pg.after)) : []
  const last = p === story.pages.length - 1

  // 페이지가 열리면 읽기 시작
  useEffect(() => {
    let alive = true
    setPhase('reading'); setNow(null)
    const items: SpeechItem[] = textS.map((s, i) => ({ text: s, ref: 't' + i }))
    items.push({ pause: 350 })
    if (pg.line) {
      items.push({ pause: 500, ref: 'line' })
      items.push({ text: fill(pg.line), rate: settings.rate * 0.85, ref: 'line' })   // 같이 말하는 구절은 더 천천히
      items.push({ pause: 600 })
      afterS.forEach((s, i) => items.push({ text: s, ref: 'a' + i }))
    }
    playSeq(items, settings.rate, it => { if (it.ref) setNow(it.ref) }).then(ok => {
      if (!ok || !alive) return
      setNow(null)
      setPhase(pg.blow ? 'blow' : 'done')
    })
    return () => { alive = false; stopSpeech() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [p, nonce, story])

  useEffect(() => {
    textRef.current?.querySelector('.now')?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [now])

  const puff = useCallback(() => {
    const box = windRef.current; if (!box) return
    const w = document.createElement('span')
    w.className = 'wind'; w.innerHTML = WIND
    w.style.left = 40 + Math.random() * 20 + '%'; w.style.bottom = '10%'
    w.style.setProperty('--dx', Math.random() * 160 - 80 + 'px')
    box.appendChild(w); setTimeout(() => w.remove(), 1100)
  }, [])

  const blowDone = useCallback(async () => {
    if (!pg.blow) return
    setPhase('after')
    const { effect, target } = pg.blow
    target.forEach(i => {
      sceneRef.current?.querySelector(`.actor[data-i="${i}"]`)?.classList.add(effect === 'out' ? 'off' : 'fx-' + effect)
    })
    for (let k = 0; k < 6; k++) puff()
    await sleep(700)
    const ok = await playSeq(afterS.map((s, i) => ({ text: s, ref: 'a' + i })), settings.rate, it => { if (it.ref) setNow(it.ref) })
    if (ok) { setNow(null); setPhase('done') }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [p, nonce, story, settings.rate])

  const go = (np: number) => { stopSpeech(); setP(np); setNonce(n => n + 1) }
  const cls = (ref: string, dim = false) => 's' + (now === ref ? ' now' : dim ? ' dim' : '')
  const afterDim = !!pg.blow && (phase === 'reading' || phase === 'blow')

  return (
    <section className="screen" id="reader">
      <div className="top">
        <button className="back" onClick={() => { stopSpeech(); onBack() }}>📚</button>
        <h2>{story.title}</h2><div className="spacer" />
      </div>
      <Scene key={p + '-' + nonce} ref={sceneRef} page={pg} className="scene">
        <div ref={windRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />
        {phase === 'blow' && <BlowButton mic={settings.mic} onPuff={puff} onDone={blowDone} />}
      </Scene>
      <div className="textcard" ref={textRef}>
        {textS.map((s, i) => <span key={'t' + i} className={cls('t' + i)}>{s} </span>)}
        {pg.line && (
          <span className={'bubble' + (now === 'line' ? ' now' : '')}>
            <span className="tag">🗣️ 같이 말해요</span>{fill(pg.line)}
          </span>
        )}
        {afterS.map((s, i) => <span key={'a' + i} className={cls('a' + i, afterDim)}>{s} </span>)}
      </div>
      <div className="controls">
        <button className="ctrl" disabled={p === 0} onClick={() => go(p - 1)}>◀</button>
        <button className="ctrl" onClick={() => go(p)}>🔁</button>
        <div className="dots">{story.pages.map((_, i) => <span key={i} className={'dot' + (i === p ? ' on' : '')} />)}</div>
        <button className={'ctrl next' + (phase === 'done' ? ' ready' : '')} onClick={() => last ? (stopSpeech(), onBack()) : go(p + 1)}>
          {last ? '🏁' : '▶'}
        </button>
      </div>
    </section>
  )
}
