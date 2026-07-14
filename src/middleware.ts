import { NextRequest, NextResponse } from 'next/server';

const GUIDE_DOMAIN = process.env.NEXT_PUBLIC_GUIDE_DOMAIN || 'guide.zodev.live';
const DEFAULT_SLUG = 'zodback-platform';

export function middleware(request: NextRequest) {
  const hostname = (request.headers.get('host') || '').split(':')[0];
  let projectSlug = DEFAULT_SLUG;

  if (hostname === 'z-guide.zodev.live') {
    // Legacy domain → platform docs
    projectSlug = DEFAULT_SLUG;
  } else if (hostname.endsWith(`.${GUIDE_DOMAIN}`)) {
    const sub = hostname.slice(0, -(GUIDE_DOMAIN.length + 1));
    if (sub && sub !== 'www') projectSlug = sub;
  }

  // Dev override: ?project=slug
  if (process.env.NODE_ENV !== 'production') {
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
