/**
 * AI가 만든 동화 JSON을 앱에서 안전하게 쓸 수 있게 정리해요.
 * 목록에 없는 그림 이름, 잘못된 번호, 너무 긴 글은 걸러내요.
 * (서버에서도 같은 검사를 한 번 더 하는 게 좋아요)
 */
import { ACT, BG, SKY } from '../art/art'
import type { ArtItem, BlowEffect, Page, Story } from '../data/types'

const EFF: BlowEffect[] = ['fly', 'up', 'shake', 'out']
const PASTEL = ['#FFE1E6', '#FFF1C9', '#DDF2E2', '#DDEBFF', '#F1E2FF', '#FFE7D1']
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v))

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function cleanStory(raw: any, words: string[]): Story {
  if (!raw || !Array.isArray(raw.pages)) throw new Error('형식이 맞지 않아요')
  const pages: Page[] = raw.pages.slice(0, 12).map((p: any): Page => {
    let art: ArtItem[] = (Array.isArray(p.art) ? p.art : [])
      .filter((a: any) => Array.isArray(a) && a[0] in ACT)
      .slice(0, 5)
      .map((a: any) => [a[0], clamp(Number(a[1]) || 1, 0.6, 2.8)] as ArtItem)
    if (!art.length) art = [['dino', 1.4]]
    const o: Page = {
      bg: p.bg in BG ? p.bg : 'meadow',
      sky: (Array.isArray(p.sky) ? p.sky : []).filter((n: string) => n in SKY).slice(0, 2),
      art,
      text: String(p.text ?? '').slice(0, 240)
    }
    if (p.line) o.line = String(p.line).slice(0, 60)
    if (p.after) o.after = String(p.after).slice(0, 220)
    if (p.blow && EFF.includes(p.blow.effect)) {
      const t = (Array.isArray(p.blow.target) ? p.blow.target : [])
        .filter((i: unknown) => Number.isInteger(i) && (i as number) >= 0 && (i as number) < art.length)
      if (t.length) {
        let eff: BlowEffect = p.blow.effect
        if (eff === 'out' && !t.every((i: number) => art[i][0] === 'candle')) eff = 'fly'
        o.blow = { effect: eff, target: t }
        if (!o.after) o.after = '후우~! 와, 해냈어요!'
      }
    }
    return o
  }).filter((p: Page) => p.text)
  if (pages.length < 3) throw new Error('이야기가 너무 짧아요')
  return {
    id: 'g' + Date.now(),
    title: String(raw.title || words.join(' ') + ' 이야기').slice(0, 30),
    cover: 0,
    color: PASTEL[Math.floor(Math.random() * PASTEL.length)],
    pages, made: true, words
  }
}
