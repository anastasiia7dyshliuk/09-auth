import { NextRequest, NextResponse } from 'next/server';
import { parse } from 'cookie';
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

  // 1. Немає accessToken
  if (!accessToken) {
    // 1.1 Є refreshToken — пробуємо оновити сесію
    if (refreshToken) {
      const data = await checkSession();
      const setCookie = data.headers['set-cookie'];

      if (setCookie) {
        const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];

        // Сесію оновлено: готуємо відповідь і записуємо нові токени в куки
        const response = isPublicRoute
          ? NextResponse.redirect(new URL('/profile', request.url))
          : NextResponse.next();

        for (const cookieStr of cookieArray) {
          const parsed = parse(cookieStr);
          const options = {
            expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
            path: parsed.Path,
            maxAge: Number(parsed['Max-Age']),
          };

          if (parsed.accessToken) {
            response.cookies.set('accessToken', parsed.accessToken, options);
          }
          if (parsed.refreshToken) {
            response.cookies.set('refreshToken', parsed.refreshToken, options);
          }
        }

        return response;
      }
    }

    // 1.2 Токенів немає або оновлення не вдалося
    if (isPublicRoute) {
      return NextResponse.next();
    }
    if (isPrivateRoute) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
  }

  // 2. accessToken є
  if (isPublicRoute) {
    return NextResponse.redirect(new URL('/profile', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};
