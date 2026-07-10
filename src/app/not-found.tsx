import Link from "next/link";

export default function NotFoundPage() {
  return (
    <section className="page prose-page">
      <header className="page-header">
        <p className="eyebrow">404</p>
        <h1 className="headline">Page Not Found</h1>
      </header>
      <p>
        The page you are looking for does not exist. Return to the{" "}
        <Link className="inline-link" href="/">
          homepage
        </Link>
        .
      </p>
    </section>
  );
}
