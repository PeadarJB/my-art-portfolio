import Link from "next/link";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function NotFoundPage() {
  return (
    <div className="page-shell">
      <SiteHeader />
      <div className="subbar has-rule-below">
        <h1 className="subbar-label">404</h1>
        <span className="subbar-muted">Page Not Found</span>
      </div>

      <main id="main-content" className="notfound-main">
        <div className="notfound-block">
          <p className="lead">The page you are looking for does not exist.</p>
          <Link className="accent-link" href="/">
            Return to the homepage →
          </Link>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
