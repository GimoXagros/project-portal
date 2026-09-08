import { Archive, Code2, ShieldCheck } from 'lucide-react'
import SectionHeading from './SectionHeading'

const principles = [
  { icon: Archive, title: '개인 프로젝트 아카이브', text: '한국어화, 에뮬레이션, 포팅과 게임 관련 도구 작업을 한 구조 안에서 정리합니다.' },
  { icon: Code2, title: '정적이고 투명한 배포', text: '공개된 배포 파일과 변경 기록을 연결해 작업의 흐름을 확인할 수 있도록 합니다.' },
  { icon: ShieldCheck, title: '확인 가능한 출처', text: '각 프로젝트의 원본 제작자와 추가 작업자를 구분하고, 릴리스 기록과 라이선스를 함께 안내합니다.' },
]

export default function About({ site }) {
  return <section className="about-section section-pad" id="about" aria-labelledby="about-title">
    <SectionHeading index="03" eyebrow="ABOUT" title="작업실과 아카이브 사이" description="과장된 쇼케이스보다 프로젝트의 맥락, 지원 범위와 안전한 배포 정보를 분명하게 전달합니다." />
    <div className="principle-grid">{principles.map(({ icon: Icon, title, text }, index) => <article key={title}><span>{String(index + 1).padStart(2, '0')}</span><Icon size={25} /><h3>{title}</h3><p>{text}</p></article>)}</div>
    <div className="legal-panel"><div><span>LEGAL & DISTRIBUTION POLICY</span><h3>배포 원칙</h3></div><ul>{site.legal.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}</ul></div>
  </section>
}
