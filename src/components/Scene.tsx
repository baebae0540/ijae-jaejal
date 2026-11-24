import { forwardRef, useMemo } from 'react'
import { sceneSVG } from '../art/art'
import type { Page } from '../data/types'

/** 장면 그림. SVG 문자열을 그대로 넣어요 (앱 안에서 만든 그림만 들어가요) */
export const Scene = forwardRef<HTMLDivElement, { page: Page; className?: string; children?: React.ReactNode }>(
  function Scene({ page, className, children }, ref) {
    const html = useMemo(() => sceneSVG(page), [page])
    return (
      <div ref={ref} className={className}>
        <div style={{ position: 'absolute', inset: 0 }} dangerouslySetInnerHTML={{ __html: html }} />
        {children}
      </div>
    )
  }
)
