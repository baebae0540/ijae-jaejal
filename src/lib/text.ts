/** 이야기 속 {name} 자리에 아이 이름 넣기 */
export const fillName = (t: string, name: string) => t.replace(/\{name\}/g, name.trim() || '꼬마 친구')
