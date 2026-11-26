import { useRef, useState } from 'react'
import { Scene } from '../components/Scene'
import { iconSVG } from '../art/art'
import { generateStory, storyApiReady } from '../services/storyApi'
import { playSeq } from '../lib/speech'
import { fillName } from '../lib/text'
import { makeLocalStory, WORD_INFO } from '../data/storyMaker'
import type { Settings, Story } from '../data/types'

const WORDS = Object.entries(WORD_INFO).map(([w, i]) => [i.em, w] as [string, string])

export function Maker({ settings, savedIds, onRead, onSave, onBack }: {
  settings: Settings; savedIds: Set<string>
  onRead: (s: Story) => void; onSave: (s: Story) => void; onBack: () => void
}) {
  const [picked, setPicked] = useState<string[]>([])
  const [free, setFree] = useState('')
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)
  const [preview, setPreview] = useState<Story | null>(null)
  const ctl = useRef<AbortController | null>(null)

  const toggle = (w: string) => setPicked(p => p.includes(w) ? p.filter(x => x !== w) : [...p, w].slice(-3))
  const dice = () => {
    const pool = WORDS.map(w => w[1]).sort(() => Math.random() - 0.5).slice(0, 2)
    setPicked(pool); playSeq([{ text: pool.join(', ') + '!' }], settings.rate)
  }
  const make = async (words: string[]) => {
    setMsg('')
    // 서버(3단계)가 없으면 기기 안의 이야기 틀로 바로 만들어요
    if (!storyApiReady()) { setPreview(makeLocalStory(words)); return }
    ctl.current = new AbortController(); setBusy(true)
    try { setPreview(await generateStory(words, settings.name, ctl.current.signal)) }
    catch (e) {
      if (ctl.current.signal.aborted) return
      setPreview(null)
      setMsg((e as Error).message === 'RATE_LIMIT' ? '잠깐 쉬었다가 다시 눌러 주세요.' : '이야기를 만들지 못했어요. 다시 한 번 눌러 주세요.')
    } finally { setBusy(false) }
  }

  if (preview) {
    const f = (t: string) => fillName(t, settings.name)
    const saved = savedIds.has(preview.id)
    return (
      <section className="screen" id="preview">
        <div className="top"><button className="back" onClick={() => setPreview(null)}>✏️</button><h2>{preview.title}</h2><div className="spacer" /></div>
        <div className="pvnote">보호자 먼저 보기: 내용을 훑어보고 들려주세요.</div>
        <div className="pv">
          {preview.pages.map((pg, i) => (
            <div className="pvrow" key={i}>
              <Scene page={pg} className="pvart" />
              <div className="pvtxt"><b>{i + 1}.</b> {f(pg.text)}
                {pg.line && <span className="bubble"><span className="tag">🗣️ 같이 말해요</span>{f(pg.line)}</span>}
                {pg.blow && <span className="bl">🌬️ 후~ 불기</span>} {pg.after && f(pg.after)}
              </div>
            </div>
          ))}
        </div>
        <div className="pvbtns">
          <button onClick={() => make(preview.words ?? picked)}>🔄 다시 만들기</button>
          <button disabled={saved} onClick={() => onSave(preview)}>{saved ? '✅ 저장됨' : '💾 저장'}</button>
          <button className="go" onClick={() => onRead(preview)}>▶ 읽어 주기</button>
        </div>
        {busy && <Making words={preview.words ?? picked} onCancel={() => { ctl.current?.abort(); setBusy(false) }} />}
      </section>
    )
  }

  return (
    <section className="screen" id="maker">
      <div className="top"><button className="back" onClick={onBack}>📚</button><h2>✨ 새 동화 만들기</h2><div className="spacer" /></div>
      <div className="mk">
        <div className="picked">
          {picked.length ? picked.map(w => <button key={w} className="chip" onClick={() => toggle(w)}>{w}<b>✕</b></button>)
            : <span className="ph">아래에서 단어를 골라요 (3개까지)</span>}
        </div>
        <div className="wordgrid">
          {WORDS.map(([em, w]) => (
            <button key={w} className={'word' + (picked.includes(w) ? ' on' : '')} onClick={() => toggle(w)}>
              <span className="em">{em}</span>{w}
            </button>
          ))}
        </div>
        <div className="mkrow">
          <input value={free} maxLength={30} placeholder="직접 쓰기 (예: 소방차, 친구랑 화해하기)"
            onChange={e => setFree(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && free.trim()) { toggle(free.trim()); setFree('') } }} />
          <button onClick={() => { if (free.trim()) { toggle(free.trim()); setFree('') } }}>추가</button>
        </div>
        <div className="mkrow">
          <button className="bigbtn dice" onClick={dice}>🎲 아무거나</button>
          <button className="bigbtn make" disabled={!picked.length || busy} onClick={() => make(picked)}>✨ 동화 만들기</button>
        </div>
        <div className="msg">{msg}</div>
      </div>
      {busy && <Making words={picked} onCancel={() => { ctl.current?.abort(); setBusy(false) }} />}
    </section>
  )
}

function Making({ words, onCancel }: { words: string[]; onCancel: () => void }) {
  return (
    <div className="overlay" id="making">
      <div className="panel">
        <div className="mkdino" dangerouslySetInnerHTML={{ __html: iconSVG('dino') }} />
        <h3>뚜뚜가 이야기를 쓰고 있어요…</h3>
        <p className="small">단어: {words.join(', ')}</p>
        <button className="pbtn ghost" onClick={onCancel}>그만두기</button>
      </div>
    </div>
  )
}
