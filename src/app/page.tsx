import Link from "next/link";
import { getAll } from "@/lib/api";
import { getDocsBrandName, getProjectSlug, resolveProject } from "@/lib/project";
import { SearchBar } from "@/components/search-bar";

function Icon({ name }: { name: "rocket" | "nodes" | "book" | "code" | "cloud" | "globe" | "moon" | "brackets" }) {
  const paths = {
    rocket: <><path d="M14 6c2.5-2.5 6-2.5 6-2.5s0 3.5-2.5 6L12 15l-3-3 5-6Z" /><path d="m9 12-3 1-2 4 4-2 1-3ZM12 15l-1 3 4-2 1-3M14 9h.01" /></>,
    nodes: <><rect x="3" y="4" width="5" height="5" /><rect x="16" y="15" width="5" height="5" /><path d="M8 6.5h5a3 3 0 0 1 3 3V15M8 18h5a3 3 0 0 0 3-3" /><path d="M11 9.5h5" /></>,
    book: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v15H6.5A2.5 2.5 0 0 0 4 20.5v-15ZM20 5.5A2.5 2.5 0 0 0 17.5 3H13v15h4.5a2.5 2.5 0 0 1 2.5 2.5v-15Z" /></>,
    code: <><path d="m8 7-4 5 4 5M16 7l4 5-4 5M14 4l-4 16" /></>,
    cloud: <><path d="M7 18h10a4 4 0 0 0 .6-7.95A6 6 0 0 0 6.2 8.5 4.5 4.5 0 0 0 7 18Z" /><path d="M12 13v5m0-5-2 2m2-2 2 2" /></>,
    globe: <><circle cx="12" cy="12" r="8" /><path d="M4 12h16M12 4a12 12 0 0 1 0 16M12 4a12 12 0 0 0 0 16" /></>,
    moon: <path d="M20 15.5A8 8 0 0 1 8.5 4 8 8 0 1 0 20 15.5Z" />,
    brackets: <><path d="M9 5H7a2 2 0 0 0-2 2v3a2 2 0 0 1-2 2 2 2 0 0 1 2 2v3a2 2 0 0 0 2 2h2M15 5h2a2 2 0 0 1 2 2v3a2 2 0 0 0 2 2 2 2 0 0 0-2 2v3a2 2 0 0 1-2 2h-2" /></>,
  };
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

export default async function HomePage() {
  const slug = await getProjectSlug();
  const project = await resolveProject(slug);
  const { spaces, pages } = await getAll(project.id);
  const hrefFor = (spaceSlug: string, preferredPageSlugs: string[] = []) => {
    const space = spaces.find((entry) => entry.slug === spaceSlug);
    if (!space) return "#";

    for (const pageSlug of preferredPageSlugs) {
      const page = pages.find((entry) => entry.spaceId === space.id && entry.slug === pageSlug);
      if (page) return `/${space.slug}/${page.slug}`;
    }

    return `/${space.slug}`;
  };
  const cards = [
    {
      icon: "rocket",
      title: "Bien démarrer",
      description: "Installation, configuration initiale et premier projet en 5 minutes.",
      href: hrefFor("zodback-modules", ["overview-and-concepts"]),
    },
    {
      icon: "nodes",
      title: "Concepts fondamentaux",
      description: "Comprendre l'architecture, les modèles de données et le cycle de vie.",
      href: hrefFor("zodback-modules", ["authentication-api-tokens", "cors-allowed-origins"]),
    },
    {
      icon: "book",
      title: "Guides pratiques",
      description: "Tutoriels détaillés pas à pas pour les cas d'usage courants.",
      href: hrefFor("guide-deployer-site-externe", ["guide-deploy-introduction", "guide-deploy-configuration"]),
    },
    {
      icon: "code",
      title: "Référence API",
      description: "Documentation exhaustive des endpoints REST et GraphQL, avec exemples de requêtes et réponses structurées.",
      href: hrefFor("api-blog", ["api-blog-introduction", "api-blog-authentication"]),
    },
    {
      icon: "cloud",
      title: "Déploiement",
      description: "Stratégies CI/CD, environnements et gestion de production.",
      href: hrefFor("guide-deployer-site-externe", ["guide-deploy-vercel", "guide-deploy-tests-verification"]),
    },
  ] as const;
  const startHref = cards[0].href;

  return (
    <div className="site-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <Link href="/" className="brand">{getDocsBrandName(project.name)} Docs</Link>
          <nav className="desktop-nav" aria-label="Navigation principale">
            <Link href="/">Documentation</Link><Link href="#api">API</Link><Link href="#guides">Guides</Link><Link href="#examples">Examples</Link><Link href="#community">Community</Link>
          </nav>
          <div className="top-actions"><SearchBar /><button aria-label="Changer de langue"><Icon name="globe" /></button><button aria-label="Changer de thème"><Icon name="moon" /></button><button aria-label="Voir le code"><Icon name="brackets" /></button><span className="version">v2.4</span></div>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-glow" />
          <h1>Construisez, intégrez et déployez avec<br className="desktop-break" /> ZodBack</h1>
          <p>La plateforme d'infrastructure backend la plus rapide. Explorez notre<br className="desktop-break" /> documentation complète pour maîtriser l'API, les SDKs et l'architecture cloud<br className="desktop-break" /> en quelques minutes.</p>
          <SearchBar large />
          <div className="hero-actions"><Link className="button primary" href={startHref}>Commencer <span>→</span></Link><Link className="button secondary" href="#api"><Icon name="brackets" /> Explorer l'API</Link></div>
        </section>

        <section className="quick-grid" id="guides">
          {cards.map((card, index) => <Link key={card.title} href={card.href} className={`quick-card ${index === 3 ? "api-card" : ""}`}>
            <span className={`card-icon ${index === 4 ? "green" : ""}`}><Icon name={card.icon} /></span><h2>{card.title}</h2><p>{card.description}</p>{index === 3 && <span className="tags"><i>REST</i><i>GraphQL</i><i>Webhooks</i></span>}
          </Link>)}
        </section>

        <section className="integration" id="examples">
          <div className="integration-copy"><h2>Intégration rapide</h2><p>Connectez-vous à ZodBack en quelques lignes de code. Nos SDKs officiels sont conçus pour offrir une expérience développeur fluide avec un typage fort.</p><ul><li>✓ <span>Typage statique avec TypeScript</span></li><li>✓ <span>Gestion automatique des retries</span></li><li>✓ <span>Support natif de l'asynchrone</span></li></ul></div>
          <div className="code-card"><div className="code-tabs"><span className="active">TypeScript</span><span>Python</span><span>cURL</span><button aria-label="Copier le code">▣</button></div><pre><code><span className="purple">import</span> &#123; ZodBack &#125; <span className="purple">from</span> <span className="green-text">'@zodback/sdk'</span>;<br /><br /><span className="purple">const</span> client = <span className="purple">new</span> ZodBack(&#123;<br />  apiKey: process.env.<span className="red">ZODBACK_API_KEY</span>,<br />  environment: <span className="green-text">'production'</span><br />&#125;);<br /><br /><span className="comment">// Initialiser une nouvelle instance</span><br /><span className="purple">await</span> client.instances.create(&#123;<br />  name: <span className="green-text">'my-backend-node'</span>,<br />  region: <span className="green-text">'eu-west-3'</span>,<br />  scaling: <span className="purple">true</span><br />&#125;);</code></pre></div>
        </section>
      </main>
    </div>
  );
}
