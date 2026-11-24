/**
 * 동화 생성 API 클라이언트
 * Claude API 키는 절대 앱에 넣지 않아요. 3단계에서 ASP.NET Core 서버가 키를 들고
 * POST /api/stories 요청을 받아 Claude를 호출하고, 동화 JSON을 돌려주는 구조예요.
 *
 * 요청:  { "words": ["공룡","소방차"], "childName": "민준이" }
 * 응답:  { "title": "...", "pages": [ { bg, sky, art, text, line?, after?, blow? } ] }
 */
import { cleanStory } from './storyClean'
import type { Story } from '../data/types'

const API = import.meta.env.VITE_STORY_API_URL as string | undefined

export const storyApiReady = () => Boolean(API)

export async function generateStory(words: string[], childName: string, signal?: AbortSignal): Promise<Story> {
  if (!API) throw new Error('NO_API')
  const res = await fetch(`${API.replace(/\/$/, '')}/api/stories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ words, childName }),
    signal
  })
  if (res.status === 429) throw new Error('RATE_LIMIT')
  if (!res.ok) throw new Error('SERVER_' + res.status)
  return cleanStory(await res.json(), words)
}
