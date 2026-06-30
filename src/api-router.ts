import { APIRoute as loginHandlers } from './routes/api/auth/login';
import { APIRoute as logoutHandlers } from './routes/api/auth/logout';
import { APIRoute as logoutAllHandlers } from './routes/api/auth/logout-all';
import { APIRoute as meHandlers } from './routes/api/auth/me';
import { APIRoute as activityHandlers } from './routes/api/activity/index';
import { APIRoute as enquiriesHandlers } from './routes/api/enquiries/index';
import { APIRoute as enquiriesIdHandlers } from './routes/api/enquiries/$id';
import { APIRoute as contactsHandlers } from './routes/api/contacts/index';
import { APIRoute as contactsIdHandlers } from './routes/api/contacts/$id';
import { APIRoute as subscribersHandlers } from './routes/api/subscribers/index';
import { APIRoute as subscribersIdHandlers } from './routes/api/subscribers/$id';
import { APIRoute as usersHandlers } from './routes/api/users/index';
import { APIRoute as usersIdHandlers } from './routes/api/users/$id';
import { APIRoute as blogHandlers } from './routes/api/blog/index';
import { APIRoute as blogIdHandlers } from './routes/api/blog/$id';
import { APIRoute as destinationsHandlers } from './routes/api/destinations/index';
import { APIRoute as destinationsIdHandlers } from './routes/api/destinations/$id';
import { APIRoute as dealsHandlers } from './routes/api/deals/index';
import { APIRoute as dealsIdHandlers } from './routes/api/deals/$id';
import { APIRoute as testimonialsHandlers } from './routes/api/testimonials/index';
import { APIRoute as testimonialsIdHandlers } from './routes/api/testimonials/$id';
import { APIRoute as holidaysHandlers } from './routes/api/holidays/index';
import { APIRoute as holidaysIdHandlers } from './routes/api/holidays/$id';
import { APIRoute as faqsHandlers } from './routes/api/faqs/index';
import { APIRoute as faqItemsHandlers } from './routes/api/faq-items/index';
import { APIRoute as faqItemsIdHandlers } from './routes/api/faq-items/$id';
import { APIRoute as faqGroupsIdHandlers } from './routes/api/faq-groups/$id';

type Ctx = { request: Request; params: Record<string, string> };
type Handler = (ctx: Ctx) => Promise<Response> | Response;
type Handlers = Record<string, Handler>;

function makeRoute(tanstackPath: string, handlers: Handlers) {
  const paramNames: string[] = [];
  const regexStr = tanstackPath.replace(/\$([^/]+)/g, (_, name: string) => {
    paramNames.push(name);
    return '([^/]+)';
  });
  return { pattern: new RegExp(`^${regexStr}$`), paramNames, handlers };
}

const routes = [
  makeRoute('/api/auth/login', loginHandlers as Handlers),
  makeRoute('/api/auth/logout', logoutHandlers as Handlers),
  makeRoute('/api/auth/logout-all', logoutAllHandlers as Handlers),
  makeRoute('/api/auth/me', meHandlers as Handlers),
  makeRoute('/api/activity', activityHandlers as Handlers),
  makeRoute('/api/enquiries', enquiriesHandlers as Handlers),
  makeRoute('/api/enquiries/$id', enquiriesIdHandlers as Handlers),
  makeRoute('/api/contacts', contactsHandlers as Handlers),
  makeRoute('/api/contacts/$id', contactsIdHandlers as Handlers),
  makeRoute('/api/subscribers', subscribersHandlers as Handlers),
  makeRoute('/api/subscribers/$id', subscribersIdHandlers as Handlers),
  makeRoute('/api/users', usersHandlers as Handlers),
  makeRoute('/api/users/$id', usersIdHandlers as Handlers),
  makeRoute('/api/blog', blogHandlers as Handlers),
  makeRoute('/api/blog/$id', blogIdHandlers as Handlers),
  makeRoute('/api/destinations', destinationsHandlers as Handlers),
  makeRoute('/api/destinations/$id', destinationsIdHandlers as Handlers),
  makeRoute('/api/deals', dealsHandlers as Handlers),
  makeRoute('/api/deals/$id', dealsIdHandlers as Handlers),
  makeRoute('/api/testimonials', testimonialsHandlers as Handlers),
  makeRoute('/api/testimonials/$id', testimonialsIdHandlers as Handlers),
  makeRoute('/api/holidays', holidaysHandlers as Handlers),
  makeRoute('/api/holidays/$id', holidaysIdHandlers as Handlers),
  makeRoute('/api/faqs', faqsHandlers as Handlers),
  makeRoute('/api/faq-items', faqItemsHandlers as Handlers),
  makeRoute('/api/faq-items/$id', faqItemsIdHandlers as Handlers),
  makeRoute('/api/faq-groups/$id', faqGroupsIdHandlers as Handlers),
];

export async function handleApiRequest(request: Request): Promise<Response | null> {
  const url = new URL(request.url);
  if (!url.pathname.startsWith('/api/')) return null;

  for (const { pattern, paramNames, handlers } of routes) {
    const match = url.pathname.match(pattern);
    if (!match) continue;

    const params: Record<string, string> = {};
    paramNames.forEach((name, i) => {
      params[name] = decodeURIComponent(match[i + 1]);
    });

    const handler = handlers[request.method] as Handler | undefined;
    if (!handler) {
      return Response.json({ error: 'Method Not Allowed' }, { status: 405 });
    }

    try {
      return await handler({ request, params });
    } catch (error) {
      console.error(`API error ${request.method} ${url.pathname}:`, error);
      return Response.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }

  return null;
}
