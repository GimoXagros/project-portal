import { ArrowUp, Github } from 'lucide-react'
import { assetUrl } from '../utils/projectMeta'

export default function Footer({ site, onNavigate }) {
  return <footer className="footer">
    <div className="footer-brand"><img className="archive-icon" src={assetUrl('assets/branding/ICO_rev.1.png')} width="36" height="36" alt="" /><div><strong>{site.name}</strong><p>{site.subtitle}</p></div></div>
    <div className="footer-meta"><p>© {new Date().getFullYear()} {site.authorName}. Non-commercial personal archive.</p></div>
    <div className="footer-actions">{site.githubUrl && <a href={site.githubUrl} target="_blank" rel="noreferrer" aria-label="GitHub 방문"><Github size={18} /></a>}<button type="button" onClick={() => onNavigate('#top')} aria-label="페이지 맨 위로"><ArrowUp size={18} /></button></div>
  </footer>
}
