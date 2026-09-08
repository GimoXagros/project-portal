import { Plus } from 'lucide-react'
import SectionHeading from './SectionHeading'

export default function FAQ({ items }) {
  return <section className="faq-section section-pad" id="faq" aria-labelledby="faq-title">
    <SectionHeading index="04" eyebrow="FAQ" title="자주 묻는 질문" description="빌드 선택과 파일 확인 등 사용 중 궁금한 내용을 확인하세요." />
    <div className="faq-list">{items.map((item) => <details key={item.id}><summary><span>{item.question}</span><Plus size={20} aria-hidden="true" /></summary><p>{item.answer}</p></details>)}</div>
  </section>
}
