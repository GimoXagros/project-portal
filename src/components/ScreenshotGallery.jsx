import { Maximize2, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { assetUrl } from '../utils/projectMeta'

function Preview({ screenshot }) {
  return screenshot.src ? <img src={assetUrl(screenshot.src)} alt={screenshot.alt} loading="lazy" decoding="async" /> : <div className={`screenshot-placeholder tone-${screenshot.tone || 'slate'}`} role="img" aria-label={screenshot.alt}><span>LAYOUT PREVIEW</span><strong>{screenshot.label || 'DEMO SCREEN'}</strong><small>NO COPYRIGHTED GAME IMAGE</small></div>
}

export default function ScreenshotGallery({ screenshots = [] }) {
  const [active, setActive] = useState(null)
  const closeButton = useRef(null)
  useEffect(() => {
    if (!active) return undefined
    const previous = document.activeElement
    closeButton.current?.focus()
    const close = (event) => {
      if (event.key === 'Escape') setActive(null)
      // This dialog has one interactive control; keep keyboard focus inside it.
      if (event.key === 'Tab') { event.preventDefault(); closeButton.current?.focus() }
    }
    window.addEventListener('keydown', close)
    return () => { window.removeEventListener('keydown', close); if (previous?.isConnected) previous.focus({ preventScroll: true }) }
  }, [active])
  if (!screenshots.length) return null
  return <section className="detail-section" aria-labelledby="gallery-title">
    <div className="detail-section-title"><span>GALLERY</span><h2 id="gallery-title">스크린샷</h2></div>
    <div className="screenshot-grid">{screenshots.map((screenshot, index) => <button type="button" onClick={() => setActive(screenshot)} key={`${screenshot.label}-${index}`} aria-label={`${screenshot.alt} 확대`}><Preview screenshot={screenshot} /><Maximize2 className="expand-icon" size={19} /></button>)}</div>
    {active && <div className="lightbox" role="dialog" aria-modal="true" aria-label="스크린샷 확대 보기" onClick={() => setActive(null)}><button ref={closeButton} className="lightbox-close" type="button" onClick={() => setActive(null)} aria-label="확대 보기 닫기"><X size={22} /></button><div className="lightbox-content" onClick={(event) => event.stopPropagation()}><Preview screenshot={active} /><p>{active.alt}</p></div></div>}
  </section>
}
