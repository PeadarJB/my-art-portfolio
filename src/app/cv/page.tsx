import { cvSections } from "@/content/site";

export default function CVPage() {
  return (
    <section className="page prose-page">
      <header className="page-header">
        <p className="eyebrow">CV</p>
        <h1 className="headline">Curriculum Vitae</h1>
      </header>

      <div className="cv-grid">
        {cvSections.map((section) => (
          <article key={section.title} className="cv-card">
            <h2>{section.title}</h2>
            <ul>
              {section.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
