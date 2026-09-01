import { Check, Copy } from 'lucide-react'
import { useState } from 'react'

const fields = [
  ['Original SHA-256', 'originalHash'],
  ['Patch SHA-256', 'patchHash'],
  ['Patched SHA-256', 'patchedHash'],
]

export default function HashInfo({ project }) {
  const [copied, setCopied] = useState('')
  const hashes = fields.filter(([, key]) => project[key])
  if (!hashes.length) return null

  const copy = async (label, value) => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(label)
      window.setTimeout(() => setCopied(''), 1500)
    } catch {
      setCopied('')
    }
  }

  return <section className="detail-section" aria-labelledby="hash-title">
    <div className="detail-section-title"><span>INTEGRITY</span><h2 id="hash-title">파일 무결성</h2></div>
    {project.demo && <p className="demo-inline-notice">아래 값은 복사 기능과 줄바꿈을 확인하기 위한 SAMPLE 해시입니다.</p>}
    <dl className="hash-list">{hashes.map(([label, key]) => <div key={key}><dt>{label}</dt><dd><code>{project[key]}</code><button type="button" onClick={() => copy(label, project[key])} aria-label={`${label} 복사`}>{copied === label ? <Check size={17} /> : <Copy size={17} />}<span>{copied === label ? '복사됨' : '복사'}</span></button></dd></div>)}</dl>
  </section>
}
