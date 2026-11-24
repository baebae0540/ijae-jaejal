import { Scene } from '../components/Scene'
import type { Story } from '../data/types'

export function Library({ stories, onOpen, onMaker, onHome }:
  { stories: Story[]; onOpen: (s: Story) => void; onMaker: () => void; onHome: () => void }) {
  return (
    <section className="screen" id="library">
      <div className="top"><button className="back" onClick={onHome}>🏠</button><h2>어떤 이야기 들을까?</h2><div className="spacer" /></div>
      <div className="shelf">
        <button className="storycard new" onClick={onMaker}><div className="cover">✨🎲</div><div>새 동화 만들기</div></button>
        {stories.map(st => (
          <button key={st.id} className="storycard" style={{ background: st.color }} onClick={() => onOpen(st)}>
            {st.made && <span className="tagmine">⭐ 내가 만든</span>}
            <Scene page={st.pages[st.cover] ?? st.pages[0]} className="cover" />
            <div>{st.title}</div>
          </button>
        ))}
      </div>
    </section>
  )
}
