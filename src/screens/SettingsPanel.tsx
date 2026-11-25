import { useEffect, useState } from 'react'
import { listVoices, onVoicesChanged, playSeq, setVoice, voiceStatus, type VoiceOption } from '../lib/speech'
import { BLOW_LEVEL, micLevel, startMic } from '../lib/mic'
import type { Settings, Story } from '../data/types'

export function SettingsPanel({ settings, onChange, usedSec, onResetUsed, saved, onDelete, onClose }: {
  settings: Settings; onChange: (s: Settings) => void
  usedSec: number; onResetUsed: () => void
  saved: Story[]; onDelete: (id: string) => void; onClose: () => void
}) {
  const [micMsg, setMicMsg] = useState('기본은 버튼을 꾹 누르는 방식이에요. 마이크를 켜면 실제로 입으로 불어서 진행돼요. 소리 크기만 재고 녹음·저장은 하지 않아요.')
  const set = (p: Partial<Settings>) => onChange({ ...settings, ...p })
  const [voices, setVoices] = useState<VoiceOption[]>([])
  const [status, setStatus] = useState(voiceStatus())
  useEffect(() => {
    const load = () => { listVoices().then(setVoices); setStatus(voiceStatus()) }
    load()
    return onVoicesChanged(load)
  }, [])
  /** 목소리·높낮이를 바꾸고 바로 들려주기 */
  const tryVoice = async (p: Partial<Settings>) => {
    const n = { ...settings, ...p }
    onChange(n)
    await setVoice(n.voice, n.pitch)
    setStatus(voiceStatus())
    playSeq([{ text: '안녕! 나는 뚜뚜야. 이 목소리로 읽어 줄게요.' }], n.rate)
  }
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
          <label htmlFor="voiceIn">읽는 목소리</label>
          <select id="voiceIn" value={settings.voice ?? ''} onChange={e => tryVoice({ voice: e.target.value })}>
            <option value="">자동으로 고르기</option>
            {voices.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
          </select>
          <div className="seg">
            {[[0.9, '낮게'], [1.05, '보통'], [1.2, '높게']].map(([v, l]) => (
              <button key={v} className={(settings.pitch ?? 1.05) === v ? 'on' : ''}
                onClick={() => tryVoice({ pitch: v as number })}>{l}</button>
            ))}
          </div>
          <div className="small">{status}<br />
            더 자연스러운 목소리를 받으려면: 아이폰 설정 → 손쉬운 사용 → 읽기 및 말하기 → 음성 → 한국어에서 '향상된 음성'을 내려받아 주세요.
            안드로이드는 설정 → 텍스트 음성 변환에서 바꿀 수 있어요.</div>
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
          {settings.mic && <MicMeter />}
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
        <button className="pbtn" onClick={onClose}>닫기</button>
      </div>
    </div>
  )
}

/** 마이크 테스트: 후~ 불면 막대가 차고, 선을 넘으면 초록색이 돼요 */
function MicMeter() {
  const [lv, setLv] = useState(0)
  useEffect(() => {
    let raf = 0
    const tick = () => { setLv(micLevel()); raf = requestAnimationFrame(tick) }
    tick()
    return () => cancelAnimationFrame(raf)
  }, [])
  const max = BLOW_LEVEL * 3, on = lv > BLOW_LEVEL
  return (
    <div style={{ margin: '8px 0' }}>
      <div style={{ position: 'relative', height: 14, borderRadius: 7, background: '#0001', overflow: 'hidden' }}>
        <div style={{ width: Math.min(100, lv / max * 100) + '%', height: '100%', background: on ? '#4CAF50' : '#F2A65A', transition: 'width 60ms' }} />
        <div style={{ position: 'absolute', top: 0, bottom: 0, left: 100 / 3 + '%', width: 2, background: '#3B2F2A' }} />
      </div>
      <div className="small">{on ? '좋아요! 불고 있는 걸로 알아들었어요.' : '마이크에 대고 후~ 불어서 막대가 선을 넘는지 확인해 보세요.'}</div>
    </div>
  )
}
