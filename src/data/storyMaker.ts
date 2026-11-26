/**
 * 서버 없이 만드는 동화 (오프라인 이야기 틀)
 * 아이가 고른 단어를 종류별 이야기 틀에 끼워 넣어 7~10쪽짜리 동화를 만들어요.
 * - 단어마다 장면 1~2쪽, 같이 말하는 구절과 후~ 불기를 넣어요.
 * - 같은 단어로 다시 만들면 문장·배경이 조금씩 달라져요.
 * - 아이 이름은 {name}으로 두고 읽을 때 채워요. 이름 뒤에는 받침에 따라 바뀌는 조사를 붙이지 않아요.
 */
import type { ArtItem, Page, Story } from './types'

type Kind = 'animal' | 'food' | 'ride' | 'sky' | 'thing'
interface Word { em: string; kind: Kind; art?: string; sound?: string }

/** 고를 수 있는 단어. art가 있으면 앱 그림, 없으면 이모지로 그려요 */
export const WORD_INFO: Record<string, Word> = {
  공룡: { em: '🦖', kind: 'animal', art: 'brachio', sound: '쿵쿵' },
  강아지: { em: '🐶', kind: 'animal', sound: '멍멍' },
  고래: { em: '🐳', kind: 'animal', sound: '푸우' },
  토끼: { em: '🐰', kind: 'animal', sound: '깡충깡충' },
  곰: { em: '🐻', kind: 'animal', sound: '어흥' },
  거북이: { em: '🐢', kind: 'animal', sound: '엉금엉금' },
  사자: { em: '🦁', kind: 'animal', sound: '어흥' },
  펭귄: { em: '🐧', kind: 'animal', sound: '뒤뚱뒤뚱' },
  소방차: { em: '🚒', kind: 'ride', sound: '삐뽀삐뽀' },
  로켓: { em: '🚀', kind: 'ride', sound: '슈웅' },
  기차: { em: '🚂', kind: 'ride', sound: '칙칙폭폭' },
  트랙터: { em: '🚜', kind: 'ride', sound: '털털털' },
  바나나: { em: '🍌', kind: 'food' },
  아이스크림: { em: '🍦', kind: 'food' },
  사과: { em: '🍎', kind: 'food' },
  쿠키: { em: '🍪', kind: 'food' },
  무지개: { em: '🌈', kind: 'sky', art: 'rainbow' },
  달: { em: '🌙', kind: 'sky', art: 'moon' },
  풍선: { em: '🎈', kind: 'thing' },
  성: { em: '🏰', kind: 'thing' }
}

/* ---------- 조사: 받침 있으면 앞, 없으면 뒤 ---------- */
function batchim(w: string) {
  const c = w.trim().slice(-1).charCodeAt(0) - 0xac00
  if (c < 0 || c > 11171) return -1           // 한글이 아니면 모름
  return c % 28                                // 0 = 받침 없음, 8 = ㄹ
}
const pick = (w: string, yes: string, no: string) => (batchim(w) > 0 ? yes : no)
export const 이 = (w: string) => w + pick(w, '이', '가')
export const 을 = (w: string) => w + pick(w, '을', '를')
export const 은 = (w: string) => w + pick(w, '은', '는')
export const 와 = (w: string) => w + pick(w, '과', '와')
export const 아 = (w: string) => w + pick(w, '아', '야')
export const 이다 = (w: string) => w + pick(w, '이다', '다')
export const 으로 = (w: string) => { const b = batchim(w); return w + (b > 0 && b !== 8 ? '으로' : '로') }

const any = <T,>(xs: T[]) => xs[Math.floor(Math.random() * xs.length)]
const em = (w: Word) => 'em:' + w.em
const self: ArtItem[] = [['dino', 1.1, 0, 110], ['child', 1, 0, 230]]   // 왼쪽에 뚜뚜와 아이

/** 단어 하나로 만드는 장면 (1~2쪽) */
function episode(word: string, w: Word, bg: string): Page[] {
  const look = w.art ?? em(w)
  switch (w.kind) {
    case 'animal': {
      const s = w.sound ?? '안녕'
      return [
        {
          bg, art: [...self, [look, 1.1, 0, 560], ['tree', 2.2, 0, 560]],
          text: any([`어? 커다란 나무 뒤에서 ${s}, ${s} 소리가 나요. 누가 숨어 있을까요?`, `${s}, ${s}! 나무 뒤에 누가 있나 봐요.`]) +
            ' 다 같이 후~ 불어서 나뭇잎을 날려 볼까?',
          blow: { effect: 'fly', target: [3] },
          after: `후우~! 짠! ${이(word)} 숨어 있었어요!`
        },
        {
          bg, sky: ['sun'], art: [...self, [look, 1.2, 0, 560]],
          text: `${이(word)} 방긋 웃으며 반갑게 인사했어요.`,
          line: `${아(word)}, 안녕! 같이 놀자!`,
          after: `${은(word)} 뚜뚜랑 {name}의 새 친구가 되었어요.`
        }
      ]
    }
    case 'food':
      return [{
        bg, art: [...self, ['basketFull', .9, 0, 470], [look, .8, 0, 620]],
        text: any([`길가에 맛있는 ${이(word)} 놓여 있었어요. 음~ 냄새가 정말 좋아요.`, `배가 꼬르륵! 바구니 옆에 ${이(word)} 있었어요.`]),
        line: `${word} 하나 주세요!`,
        after: `뚜뚜랑 {name}도 ${을(word)} 나눠 먹었어요. 냠냠, 맛있다!`
      }]
    case 'ride': {
      const s = w.sound ?? '부릉부릉'
      const fly = word === '로켓'
      return [
        {
          bg, art: [...self, [look, 1.4, 0, 560]],
          text: `${s}, ${s}! 저기 ${이(word)} 왔어요.`,
          line: `${s}! ${아(word)}, 우리도 태워 줘!`
        },
        {
          bg, sky: ['cloud'], art: [[look, 1.4, 0, 400]],
          text: `뚜뚜랑 {name}도 ${word}에 올라탔어요. 출발하려면 힘이 필요해요. 다 같이 후~ 불어 볼까?`,
          blow: { effect: fly ? 'up' : 'fly', target: [0] },
          after: fly ? `후우~! ${이(word)} 하늘 높이 슈웅 날아갔어요!` : `후우~! ${s}, ${이(word)} 신나게 달려갔어요!`
        }
      ]
    }
    case 'sky': {
      const moon = w.art === 'moon'
      const bg2 = moon ? 'night' : 'meadow'
      return [
        {
          bg: bg2, art: [...self, ['em:☁️', 2.2, 150, 600]],
          text: `${은(word)} 어디 있을까? 구름이 ${을(word)} 가렸나 봐요. 후~ 불어서 구름을 치워 볼까?`,
          blow: { effect: 'fly', target: [2] },
          after: `후우~! 구름이 날아갔어요.`
        },
        {
          bg: bg2, sky: w.art ? [w.art] : [], art: w.art ? self : [...self, [look, 1, 150, 600]],
          text: `와, ${이(word)} 나타났어요! ${moon ? '환하게' : '알록달록 예쁘게'} 반짝반짝 빛나요.`,
          line: `${아(word)}, 반가워!`
        }
      ]
    }
    case 'thing':
    default:
      if (word === '풍선') return [{
        bg, art: [...self, ['tree', 2, 0, 600], [look, 1, 170, 560]],
        text: '빨간 풍선이 나뭇가지에 걸렸어요. 후~ 불어서 풍선을 하늘로 날려 볼까?',
        blow: { effect: 'up', target: [3] },
        after: '후우~! 풍선이 둥실둥실 하늘로 날아갔어요. 안녕, 풍선아!'
      }]
      return [{
        bg, art: [...self, [look, 1.2, 0, 580]],
        text: `저기 ${이(word)} 보여요! 뚜뚜가 깜짝 놀라 말했어요.`,
        line: `와, ${이다(word)}! 정말 멋지다!`
      }]
  }
}

/** 고른 단어(1~3개)로 동화 한 편 만들기 */
export function makeLocalStory(words: string[]): Story {
  const ws = words.slice(0, 3)
  const info = (w: string): Word => WORD_INFO[w] ?? { em: '⭐', kind: 'thing' }
  const bg = any(['meadow', 'forest'])
  const pages: Page[] = [
    {
      bg, sky: ['sun', 'cloud'], art: [['dino', 1.4], ['child', 1.2]],
      text: any([
        '햇살이 반짝이는 아침, 아기 공룡 뚜뚜가 {name}에게 놀러 왔어요. 오늘은 둘이서 산책을 가기로 했지요.',
        '쿵, 쿵! 아기 공룡 뚜뚜가 {name}네 집 문을 두드렸어요. 우리 같이 모험을 떠나자!'
      ]),
      line: '오늘은 누구를 만날까?'
    }
  ]
  ws.forEach(w => pages.push(...episode(w, info(w), bg)))

  // 후~ 불기가 하나도 없으면, 집에 와서 촛불을 끄는 장면을 넣어요
  const hasBlow = pages.some(p => p.blow)
  pages.push({
    bg: 'house', sky: ['sunset'], art: [['dino', 1.2], ['hut', 1.6], ['child', 1.05]],
    text: `해가 뉘엿뉘엿 지자, 뚜뚜랑 {name}도 집으로 돌아왔어요. ${ws.length > 1 ? `오늘 만난 ${ws.slice(0, -1).join(', ')}, 그리고 ${ws[ws.length - 1]}, 모두 정말 재미있었어요.` : `오늘은 ${와(ws[0])} 함께해서 정말 재미있었어요.`}`,
    line: '오늘은 최고의 하루야!'
  })
  if (!hasBlow) pages.push({
    bg: 'night', sky: ['moon'], art: [['dino', 1.2], ['candle', .9], ['child', 1.05]],
    text: '이제 잘 시간이에요. 촛불을 같이 후~ 끄고 잘까?',
    blow: { effect: 'out', target: [1] },
    after: '후우~! 촛불이 꺼졌어요.'
  })
  pages.push({
    bg: 'night', sky: ['moon', 'stars'], art: [['dinoSleep', 1.6], ['zzz', 1, 90]],
    text: '뚜뚜는 행복한 꿈을 꾸며 새근새근 잠이 들었답니다. 끝!'
  })

  const PASTEL = ['#FFE1E6', '#FFF1C9', '#DDF2E2', '#DDEBFF', '#F1E2FF', '#FFE7D1']
  return {
    id: 'm' + Date.now(),
    title: `뚜뚜와 ${ws.length === 1 ? ws[0] : ws.slice(0, -1).join(', ') + ' 그리고 ' + ws[ws.length - 1]}`.slice(0, 30),
    cover: 0, color: any(PASTEL), pages, made: true, words: ws
  }
}
