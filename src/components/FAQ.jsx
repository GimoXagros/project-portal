import { Plus } from 'lucide-react'
import SectionHeading from './SectionHeading'

export default function FAQ({ items }) {
  return <section className="faq-section section-pad" id="faq" aria-labelledby="faq-title">
    <SectionHeading index="05" eyebrow="FAQ" title="자주 묻는 질문" description="질문과 답변은 faq.json에서 코드 수정 없이 관리합니다." />
    <div className="faq-list">{items.map((item) => <details key={item.id}><summary><span>{item.question}</span><Plus size={20} aria-hidden="true" /></summary><p>{item.answer}</p></details>)}</div>
  </section>
}
