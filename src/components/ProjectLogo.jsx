import { useState } from 'react'
import { assetUrl, projectBrandStyle } from '../utils/projectMeta'

export default function ProjectLogo({ project, context = 'card', className = '' }) {
  const [failedLogo, setFailedLogo] = useState('')
  const branding = project?.branding
  const failed = failedLogo === branding?.logo

  return <div className={`project-logo-stage logo-${context} ${className}`.trim()} style={projectBrandStyle(project)}>
    {branding?.logo && !failed ? <img
      src={assetUrl(branding.logo)}
      alt={branding.logoAlt}
      width={branding.width}
      height={branding.height}
      loading={context === 'detail' ? 'eager' : 'lazy'}
      decoding="async"
      onError={() => setFailedLogo(branding.logo)}
    /> : <div className="project-logo-fallback" role="img" aria-label={`${project.title} 로고 대체 표시`}><strong>{project.title}</strong><small>PROJECT FILE</small></div>}
  </div>
}
