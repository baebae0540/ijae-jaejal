/** localStorage 래퍼: 저장이 막힌 환경에서도 앱은 그대로 동작해요. */
const P = 'ttu_'
export const store = {
  get<T>(k: string, d: T): T {
    try { const v = localStorage.getItem(P + k); return v === null ? d : JSON.parse(v) as T } catch { return d }
  },
  set(k: string, v: unknown) {
    try { localStorage.setItem(P + k, JSON.stringify(v)) } catch { /* 무시 */ }
  }
}
export const today = () => new Date().toISOString().slice(0, 10)
