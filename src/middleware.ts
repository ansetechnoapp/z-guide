import { NextRequest, NextResponse } from 'next/server';

const DEFAULT_SLUG = 'zodback-platform';
const HOST_PROJECT_SLUGS: Record<string, string> = {
  'z-guide.zodev.live': 'zodback-platform',
  'biob-guide.zodev.live': 'projecttest1',
};
const KNOWN_PROJECT_SLUGS = new Set(Object.values(HOST_PROJECT_SLUGS));

export function middleware(request: NextRequest) {
  const hostname = (request.headers.get('host') || '').split(':')[0];
  const configuredSlug = process.env.DOCS_PROJECT_SLUG?.trim();
  const expectedSlug = HOST_PROJECT_SLUGS[hostname];
  const production = process.env.NODE_ENV === 'production';

  if (production && !configuredSlug) {
    throw new Error('DOCS_PROJECT_SLUG is required in production');
  }
  if (production && configuredSlug && !KNOWN_PROJECT_SLUGS.has(configuredSlug)) {
    throw new Error(`Unsupported DOCS_PROJECT_SLUG: ${configuredSlug}`);
  }
  if (production && expectedSlug && configuredSlug !== expectedSlug) {
    throw new Error(`DOCS_PROJECT_SLUG does not match ${hostname}`);
  }

  let projectSlug = configuredSlug || expectedSlug || DEFAULT_SLUG;

  // Dev override: ?project=slug
  if (!production) {
    const override = request.nextUrl.searchParams.get('project');
    if (override) projectSlug = override;
  }

  const headers = new Headers(request.headers);
  headers.set('x-project-slug', projectSlug);
  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
