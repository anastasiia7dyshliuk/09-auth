
import { NextRequest, NextResponse } from 'next/server';
import { parseSetCookie } from 'cookie';
import { checkSession } from './lib/api/serverApi';

const privateRoutes = ['/profile', '/notes'];
const publicRoutes = ['/sign-in', '/sign-up'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route),
  );
  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (!accessToken) {
    if (refreshToken) {
      const data = await checkSession();
      const setCookie = data.headers['set-cookie'];

      if (setCookie) {
        const cookieArray = Array.isArray(setCookie)
          ? setCookie
          : [setCookie];

        const response = isPublicRoute
          ? NextResponse.redirect(new URL('/', request.url))
          : NextResponse.next();

        for (const cookieStr of cookieArray) {
          const parsed = parseSetCookie(cookieStr);

          if (!parsed) continue;

          const options = {
            expires: parsed.expires,
            maxAge: parsed.maxAge,
            domain: parsed.domain,
            path: parsed.path,
            httpOnly: parsed.httpOnly,
            secure: parsed.secure,
            sameSite: parsed.sameSite,
            partitioned: parsed.partitioned,
            priority: parsed.priority,
          };

          if (
            (parsed.name === 'accessToken' ||
              parsed.name === 'refreshToken') &&
            parsed.value !== undefined
          ) {
            response.cookies.set(parsed.name, parsed.value, options);
          }
        }

        return response;
      }
    }

    if (isPublicRoute) {
      return NextResponse.next();
    }

    if (isPrivateRoute) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
  }

  if (isPublicRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};
