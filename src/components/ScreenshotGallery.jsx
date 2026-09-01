import { Maximize2, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { assetUrl } from '../utils/projectMeta'

function Preview({ screenshot }) {
  return screenshot.src ? <img src={assetUrl(screenshot.src)} alt={screenshot.alt} /> : <div className={`screenshot-placeholder tone-${screenshot.tone || 'slate'}`} role="img" aria-label={screenshot.alt}><span>LAYOUT PREVIEW</span><strong>{screenshot.label || 'DEMO SCREEN'}</strong><small>NO COPYRIGHTED GAME IMAGE</small></div>
}

export default function ScreenshotGallery({ screenshots = [] }) {
  const [active, setActive] = useState(null)
  useEffect(() => {
    if (!active) return undefined
    const close = (event) => { if (event.key === 'Escape') setActive(null) }
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [active])
  if (!screenshots.length) return null
  return <section className="detail-section" aria-labelledby="gallery-title">
    <div className="detail-section-title"><span>GALLERY</span><h2 id="gallery-title">스크린샷</h2></div>
    <div className="screenshot-grid">{screenshots.map((screenshot, index) => <button type="button" onClick={() => setActive(screenshot)} key={`${screenshot.label}-${index}`} aria-label={`${screenshot.alt} 확대`}><Preview screenshot={screenshot} /><Maximize2 className="expand-icon" size={19} /></button>)}</div>
    {active && <div className="lightbox" role="dialog" aria-modal="true" aria-label="스크린샷 확대 보기" onClick={() => setActive(null)}><button className="lightbox-close" type="button" onClick={() => setActive(null)} aria-label="확대 보기 닫기"><X size={22} /></button><div className="lightbox-content" onClick={(event) => event.stopPropagation()}><Preview screenshot={active} /><p>{active.alt}</p></div></div>}
  </section>
}
