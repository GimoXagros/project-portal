export default function SectionHeading({ index, eyebrow, title, description }) {
  const headingId = { '01': 'featured-title', '02': 'projects-title', '03': 'updates-title', '04': 'about-title', '05': 'faq-title' }[index]
  return <div className="section-heading">
    <div><p className="section-index">{index} / {eyebrow}</p><h2 id={headingId}>{title}</h2></div>
    {description && <p>{description}</p>}
  </div>
}
