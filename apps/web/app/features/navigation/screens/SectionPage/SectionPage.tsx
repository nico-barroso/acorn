import { sectionPageStyles } from './SectionPage.styles'

type SectionPageProps = {
  title: string
  description: string
}

export function SectionPage({ title, description }: SectionPageProps) {
  return (
    <main style={sectionPageStyles.page}>
      <section style={sectionPageStyles.card}>
        <h1 style={sectionPageStyles.title}>{title}</h1>
        <p style={sectionPageStyles.text}>{description}</p>
      </section>
    </main>
  )
}
