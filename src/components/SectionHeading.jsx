export default function SectionHeading({ index, eyebrow, title, description }) {
  const headingId = { '01': 'projects-title', '02': 'updates-title', '03': 'about-title', '04': 'faq-title' }[index]
  return <div className="section-heading">
    <div><p className="section-index">{index} / {eyebrow}</p><h2 id={headingId}>{title}</h2></div>
    {description && <p>{description}</p>}
  </div>
}
