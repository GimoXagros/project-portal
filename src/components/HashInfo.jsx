import { Check, Copy } from 'lucide-react'
import { useState } from 'react'

const fields = [
  ['Original SHA-256', 'originalHash'],
  ['Patch SHA-256', 'patchHash'],
  ['Patched SHA-256', 'patchedHash'],
]

export default function HashInfo({ project }) {
  const [copied, setCopied] = useState('')
  const hashes = [
    ...fields.filter(([, key]) => project[key]).map(([label, key]) => ({ label, value: project[key], key })),
    ...(project.hashes || []).map((hash, index) => ({ ...hash, key: `custom-${index}` })),
  ]
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
    <dl className="hash-list">{hashes.map(({ label, value, key }) => <div key={key}><dt>{label}</dt><dd><code>{value}</code><button type="button" onClick={() => copy(label, value)} aria-label={`${label} 복사`}>{copied === label ? <Check size={17} /> : <Copy size={17} />}<span>{copied === label ? '복사됨' : '복사'}</span></button></dd></div>)}</dl>
  </section>
}
