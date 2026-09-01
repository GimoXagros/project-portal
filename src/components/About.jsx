import { Archive, Code2, ShieldCheck } from 'lucide-react'
import SectionHeading from './SectionHeading'

const principles = [
  { icon: Archive, title: '개인 프로젝트 아카이브', text: '한국어화, 에뮬레이션, 포팅과 게임 관련 도구 작업을 한 구조 안에서 정리합니다.' },
  { icon: Code2, title: '정적이고 투명한 배포', text: '콘텐츠 JSON을 기준으로 빌드하며 실시간 GitHub API 장애나 호출 제한에 의존하지 않습니다.' },
  { icon: ShieldCheck, title: '원본 데이터 미포함', text: '원본 게임 데이터나 시스템 파일 없이 합법적으로 배포할 수 있는 자료만 연결하는 것을 원칙으로 합니다.' },
]

export default function About({ site }) {
  return <section className="about-section section-pad" id="about" aria-labelledby="about-title">
    <SectionHeading index="04" eyebrow="ABOUT" title="작업실과 아카이브 사이" description="과장된 쇼케이스보다 프로젝트의 맥락, 지원 범위와 안전한 배포 정보를 분명하게 전달합니다." />
    <div className="principle-grid">{principles.map(({ icon: Icon, title, text }, index) => <article key={title}><span>{String(index + 1).padStart(2, '0')}</span><Icon size={25} /><h3>{title}</h3><p>{text}</p></article>)}</div>
    <div className="legal-panel"><div><span>LEGAL & DISTRIBUTION POLICY</span><h3>배포 원칙</h3></div><ul>{site.legal.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}</ul></div>
  </section>
}
