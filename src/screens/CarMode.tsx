import { useEffect, useRef, useState } from 'react'
import { Scene } from '../components/Scene'
import { playSeq, sentences, stopSpeech, type SpeechItem } from '../lib/speech'
import { fillName } from '../lib/text'
import type { Settings, Story } from '../data/types'

/** 한 편을 화면 없이 들을 수 있게 문장 목록으로 펼쳐요 */
function carItems(st: Story, s: Settings): SpeechItem[] {
  const f = (t: string) => fillName(t, s.name)
  const out: SpeechItem[] = [{ text: `이번 이야기는, ${st.title}!`, p: 0 }, { pause: 1000, p: 0 }]
  st.pages.forEach((pg, p) => {
    sentences(f(pg.text)).forEach(t => out.push({ text: t, p }))
    if (pg.line) { out.push({ pause: 500, p }); out.push({ text: f(pg.line), rate: s.rate * 0.85, p }); out.push({ pause: 500, p }) }
    if (pg.blow) out.push({ pause: 2200, p })         // 차 안에서도 후~ 불 시간
    if (pg.after) sentences(f(pg.after)).forEach(t => out.push({ text: t, p }))
    out.push({ pause: 900, p })
  })
  out.push({ pause: 1800, p: st.pages.length - 1 })
  return out
}

export function CarMode({ stories, settings, onHome }: { stories: Story[]; settings: Settings; onHome: () => void }) {
  const [playing, setPlaying] = useState(false)
  const [view, setView] = useState({ s: 0, p: 0, line: '▶ 를 누르면 이야기가 이어서 나와요' })
  const pos = useRef({ s: 0, i: 0 })

  // 화면 켜두기는 speech.ts의 playSeq가 알아서 해요.
  const run = async () => {
    setPlaying(true)
    for (;;) {
      const si = pos.current.s % stories.length, items = carItems(stories[si], settings), from = pos.current.i
      const ok = await playSeq(items.slice(from), settings.rate, (it, k) => {
        pos.current.i = from + k
        setView(v => ({ s: si, p: it.p ?? v.p, line: 'text' in it ? it.text : v.line }))
      })
      if (!ok) return
      pos.current = { s: (si + 1) % stories.length, i: 0 }
    }
  }
  const pause = () => { setPlaying(false); stopSpeech() }
  const jump = (d: number) => {
    const s = d < 0 && pos.current.i > 3 ? pos.current.s : (pos.current.s + d + stories.length) % stories.length
    pos.current = { s, i: 0 }; stopSpeech(); run()
  }

  useEffect(() => { run(); return () => stopSpeech() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const st = stories[view.s % stories.length]
  return (
    <section className="screen" id="car">
      <div className="top"><button className="back" onClick={() => { pause(); onHome() }}>🏠</button><h2>{st.title}</h2><div className="spacer" /></div>
      <div className="carbody">
        <Scene key={view.s + ':' + view.p} page={st.pages[view.p] ?? st.pages[0]} className="carart" />
        <div className="carline">{view.line}</div>
      </div>
      <div className="carbtns">
        <button className="cbtn" onClick={() => jump(-1)}>⏮</button>
        <button className="cbtn play" onClick={() => playing ? pause() : run()}>{playing ? '⏸' : '▶'}</button>
        <button className="cbtn" onClick={() => jump(1)}>⏭</button>
      </div>
      <div className="carnote">PWA에서는 화면이 꺼지면 소리가 멈출 수 있어요. 앱(2단계)에서는 계속 재생되게 바꿀 예정이에요.</div>
    </section>
  )
}
