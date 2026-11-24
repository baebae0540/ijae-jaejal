/** 장면에 놓이는 그림: [이름, 크기, 위로 띄우기, 가운데 x좌표] */
export type ArtItem = [name: string, scale?: number, lift?: number, x?: number]

export type BlowEffect = 'fly' | 'up' | 'shake' | 'out'

export interface Page {
  bg: string
  sky?: string[]
  art: ArtItem[]
  text: string
  /** 아이와 같이 말하는 반복 구절 */
  line?: string
  after?: string
  blow?: { effect: BlowEffect; target: number[] }
}

export interface Story {
  id: string
  title: string
  cover: number
  color: string
  pages: Page[]
  made?: boolean
  words?: string[]
}

export interface Settings {
  name: string
  rate: number
  limitMin: number
  mic: boolean
}
