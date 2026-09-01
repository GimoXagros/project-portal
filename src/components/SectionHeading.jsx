export default function SectionHeading({ index, eyebrow, title, description }) {
  return <div className="section-heading">
    <div><p className="section-index">{index} / {eyebrow}</p><h2>{title}</h2></div>
    {description && <p>{description}</p>}
  </div>
}
