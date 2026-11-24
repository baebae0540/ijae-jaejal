import { useCallback, useRef } from 'react'

/** 꾹 누르기 (보호자 전용 버튼에 사용) */
export function useLongPress(ms: number, onLong: () => void) {
  const t = useRef<number | undefined>(undefined)
  const start = useCallback(() => { t.current = window.setTimeout(onLong, ms) }, [ms, onLong])
  const cancel = useCallback(() => { clearTimeout(t.current) }, [])
  return { onPointerDown: start, onPointerUp: cancel, onPointerLeave: cancel, onPointerCancel: cancel }
}
