import { useCallback, useEffect, useMemo, useState } from 'react'
import { STORIES } from './data/stories'
import type { Settings, Story } from './data/types'
import { store, today } from './lib/storage'
import { playSeq, setVoice, stopSpeech } from './lib/speech'
import { prepareMic, setBlowLevel } from './lib/mic'
import { useLongPress } from './lib/hooks'
import { iconSVG } from './art/art'
import { Home } from './screens/Home'
import { Library } from './screens/Library'
import { Reader } from './screens/Reader'
import { CarMode } from './screens/CarMode'
import { Maker } from './screens/Maker'
import { SettingsPanel } from './screens/SettingsPanel'

type Screen = 'home' | 'library' | 'reader' | 'car' | 'maker'

export default function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [reading, setReading] = useState<{ story: Story; from: Screen } | null>(null)
  const [settings, setSettings] = useState<Settings>(() =>
    store.get('settings', { name: '', rate: 0.75, limitMin: 0, mic: false }))
  const [saved, setSaved] = useState<Story[]>(() => store.get('saved', []))
  const [usedSec, setUsedSec] = useState(() => store.get('usedDate', '') === today() ? store.get('used', 0) : 0)
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => store.set('settings', settings), [settings])
  useEffect(() => store.set('saved', saved), [saved])
  useEffect(() => { setBlowLevel(settings.blowLevel) }, [settings.blowLevel])
  useEffect(() => { setVoice(settings.voice, settings.pitch) }, [settings.voice, settings.pitch])
  // 마이크는 후~ 불기 화면에서만 켜요. 여기서는 터치 때 오디오 준비만 하게 알려 둬요.
  useEffect(() => prepareMic(settings.mic), [settings.mic])

  const library = useMemo(() => [...STORIES, ...saved], [saved])
  const timeUp = settings.limitMin > 0 && usedSec >= settings.limitMin * 60

  // 사용 시간: 이야기 화면이 보일 때만 셉니다
  useEffect(() => {
    const id = setInterval(() => {
      if ((screen === 'reader' || screen === 'car') && document.visibilityState === 'visible') {
        setUsedSec(u => { const n = u + 1; store.set('used', n); store.set('usedDate', today()); return n })
      }
    }, 1000)
    return () => clearInterval(id)
  }, [screen])
  useEffect(() => {
    if (!timeUp || screen === 'home') return
    stopSpeech(); setScreen('home')
    playSeq([{ text: '오늘 이야기 시간 끝! 뚜뚜도 이제 쉬러 가요. 내일 또 만나요!' }], settings.rate)
  }, [timeUp]) // eslint-disable-line react-hooks/exhaustive-deps

  const guard = (fn: () => void) => () => { if (!timeUp) fn() }
  const openSettings = useCallback(() => setShowSettings(true), [])
  const tuPress = useLongPress(1500, openSettings)

  return (
    <>
      {screen === 'home' && <Home onCar={guard(() => setScreen('car'))} onBook={guard(() => setScreen('library'))} onSettings={openSettings} />}
      {screen === 'library' && <Library stories={library} onHome={() => setScreen('home')} onMaker={() => setScreen('maker')}
        onOpen={st => { setReading({ story: st, from: 'library' }); setScreen('reader') }} />}
      {screen === 'car' && <CarMode stories={library} settings={settings} onHome={() => setScreen('home')} />}
      {/* Maker는 숨겨만 둬서, 읽고 돌아와도 미리보기가 남아 있게 해요 */}
      <div style={{ display: screen === 'maker' ? 'contents' : 'none' }}>
        <Maker settings={settings} savedIds={new Set(saved.map(s => s.id))}
          onBack={() => setScreen('library')}
          onRead={st => { setReading({ story: st, from: 'maker' }); setScreen('reader') }}
          onSave={st => setSaved(s => [st, ...s].slice(0, 30))} />
      </div>
      {screen === 'reader' && reading && <Reader story={reading.story} settings={settings} onBack={() => setScreen(reading.from)} />}

      {timeUp && !showSettings && (
        <div className="overlay" id="timeup">
          <div className="panel">
            <div className="big" style={{ width: 120, margin: '0 auto' }} {...tuPress} dangerouslySetInnerHTML={{ __html: iconSVG('dinoSleep') }} />
            <h3>오늘 이야기 시간 끝!</h3>
            <p style={{ fontSize: 20 }}>뚜뚜도 이제 쉬러 가요.<br />내일 또 만나요!</p>
            <p className="small">보호자: 공룡을 꾹 누르면 설정이 열려요</p>
          </div>
        </div>
      )}
      {showSettings && (
        <SettingsPanel settings={settings} onChange={setSettings}
          usedSec={usedSec} onResetUsed={() => { setUsedSec(0); store.set('used', 0) }}
          saved={saved} onDelete={id => setSaved(s => s.filter(x => x.id !== id))}
          onClose={() => { stopSpeech(); setShowSettings(false) }} />
      )}
    </>
  )
}
