import SectionHeading from './SectionHeading'

export default function Timeline({ items }) {
  if (!items.length) return null
  return <section className="timeline-section section-pad" id="updates" aria-labelledby="updates-title">
    <SectionHeading index="03" eyebrow="CHANGELOG" title="최근 업데이트" description="사이트 전체 변경 이력과 프로젝트별 변경 이력을 분리해 확장할 수 있는 데이터 구조입니다." />
    <ol className="timeline">{items.map((item, index) => <li className={index === 0 ? 'latest' : ''} key={item.id}><div className="timeline-date"><span>{item.date}</span>{index === 0 && <small>LATEST</small>}</div><div className="timeline-content"><div><h3>{item.projectTitle}</h3><span>{item.version}</span>{item.demo && <b>DEMO</b>}</div><ul>{item.changes.map((change, changeIndex) => <li key={`${change}-${changeIndex}`}>{change}</li>)}</ul></div></li>)}</ol>
  </section>
}
