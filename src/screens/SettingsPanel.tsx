import { useState } from 'react'
import { pickVoice, playSeq } from '../lib/speech'
import { startMic } from '../lib/mic'
import type { Settings, Story } from '../data/types'

export function SettingsPanel({ settings, onChange, usedSec, onResetUsed, saved, onDelete, onClose }: {
  settings: Settings; onChange: (s: Settings) => void
  usedSec: number; onResetUsed: () => void
  saved: Story[]; onDelete: (id: string) => void; onClose: () => void
}) {
  const [micMsg, setMicMsg] = useState('기본은 버튼을 꾹 누르는 방식이에요. 마이크를 켜면 실제로 입으로 불어서 진행돼요. 소리 크기만 재고 녹음·저장은 하지 않아요.')
  const set = (p: Partial<Settings>) => onChange({ ...settings, ...p })
  return (
    <div className="overlay" id="settings">
      <div className="panel">
        <h3>⚙️ 보호자 설정</h3>
        <div className="row">
          <label htmlFor="nameIn">아이 이름 (공룡 이야기에 나와요)</label>
          <input id="nameIn" maxLength={10} placeholder="예: 민준이" value={settings.name} onChange={e => set({ name: e.target.value })} />
          <div className="small">받침이 있으면 '민준이'처럼 적어 주세요.</div>
        </div>
        <div className="row">
          <label>읽는 속도</label>
          <div className="seg">
            {[[0.6, '아주 천천히'], [0.75, '천천히'], [0.9, '보통']].map(([v, l]) => (
              <button key={v} className={settings.rate === v ? 'on' : ''}
                onClick={() => { set({ rate: v as number }); playSeq([{ text: '이 빠르기로 읽어 줄게요.' }], v as number) }}>{l}</button>
            ))}
          </div>
          <div className="small">느긋하게 말하는 본보기를 들려주려면 '천천히' 이하를 권해요.</div>
        </div>
        <div className="row">
          <label htmlFor="limitIn">하루 사용 시간</label>
          <select id="limitIn" value={settings.limitMin} onChange={e => set({ limitMin: Number(e.target.value) })}>
            <option value={0}>제한 없음</option>
            {[10, 15, 20, 30, 45].map(m => <option key={m} value={m}>{m}분</option>)}
          </select>
          <div className="small">오늘 들은 시간: {Math.floor(usedSec / 60)}분</div>
          <button className="pbtn ghost" onClick={onResetUsed}>오늘 사용 시간 초기화</button>
        </div>
        <div className="row">
          <label>후~ 불기</label>
          <button className="pbtn ghost" disabled={settings.mic} onClick={async () => {
            if (await startMic()) { set({ mic: true }); setMicMsg('이제 입으로 후~ 불면 진행돼요.') }
            else setMicMsg('마이크를 쓸 수 없어요. 권한을 확인해 주세요. 꾹 누르기로 진행돼요.')
          }}>{settings.mic ? '🎤 마이크 켜짐' : '🎤 마이크로 불기 켜기'}</button>
          <div className="small">{micMsg}</div>
        </div>
        <div className="row">
          <label>내가 만든 이야기</label>
          <div className="small">
            {saved.length ? saved.map(st => (
              <div className="savedrow" key={st.id}><span>{st.title}</span><button onClick={() => onDelete(st.id)}>삭제</button></div>
            )) : '아직 저장한 이야기가 없어요.'}
          </div>
        </div>
        <div className="row small">{pickVoice()}</div>
        <button className="pbtn" onClick={onClose}>닫기</button>
      </div>
    </div>
  )
}
