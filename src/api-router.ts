import { APIRoute as loginHandlers } from './routes/api/auth/login';
import { APIRoute as logoutHandlers } from './routes/api/auth/logout';
import { APIRoute as logoutAllHandlers } from './routes/api/auth/logout-all';
import { APIRoute as meHandlers } from './routes/api/auth/me';
import { APIRoute as activityHandlers } from './routes/api/activity/index';
import { APIRoute as enquiryPackagesHandlers } from './routes/api/enquiry-packages/index';
import { APIRoute as enquiryPackagesIdHandlers } from './routes/api/enquiry-packages/$id';
import { APIRoute as enquiryPackagesReplyHandlers } from './routes/api/enquiry-packages/$id.reply';
import { APIRoute as enquiryPackagesNotesHandlers } from './routes/api/enquiry-packages/$id.notes';
import { APIRoute as enquiryFlightsHandlers } from './routes/api/enquiry-flights/index';
import { APIRoute as enquiryFlightsIdHandlers } from './routes/api/enquiry-flights/$id';
import { APIRoute as enquiryFlightsReplyHandlers } from './routes/api/enquiry-flights/$id.reply';
import { APIRoute as enquiryFlightsNotesHandlers } from './routes/api/enquiry-flights/$id.notes';
import { APIRoute as contactsHandlers } from './routes/api/contacts/index';
import { APIRoute as contactsIdHandlers } from './routes/api/contacts/$id';
import { APIRoute as contactsNotesHandlers } from './routes/api/contacts/$id.notes';
import { APIRoute as subscribersHandlers } from './routes/api/subscribers/index';
import { APIRoute as subscribersIdHandlers } from './routes/api/subscribers/$id';
import { APIRoute as usersHandlers } from './routes/api/users/index';
import { APIRoute as usersIdHandlers } from './routes/api/users/$id';
import { APIRoute as blogHandlers } from './routes/api/blog/index';
import { APIRoute as blogIdHandlers } from './routes/api/blog/$id';
import { APIRoute as destinationsHandlers } from './routes/api/destinations/index';
import { APIRoute as destinationsIdHandlers } from './routes/api/destinations/$id';
import { APIRoute as destinationHighlightsHandlers } from './routes/api/destination-highlights/index';
import { APIRoute as destinationHighlightsIdHandlers } from './routes/api/destination-highlights/$id';
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
import { APIRoute as flightOffersHandlers } from './routes/api/flight-offers/index';
import { APIRoute as flightOffersIdHandlers } from './routes/api/flight-offers/$id';
import { APIRoute as flightOfferBookingsHandlers } from './routes/api/flight-offer-bookings/index';
import { APIRoute as flightOfferBookingsIdHandlers } from './routes/api/flight-offer-bookings/$id';
import { APIRoute as uploadHandlers } from './routes/api/upload';
import { APIRoute as uploadsFilenameHandlers } from './routes/api/uploads/$filename';
import { getSession } from './server/auth';
import { db, adminActions } from '../db/index';

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
  makeRoute('/api/enquiry-packages', enquiryPackagesHandlers as Handlers),
  makeRoute('/api/enquiry-packages/$id', enquiryPackagesIdHandlers as Handlers),
  makeRoute('/api/enquiry-packages/$id/reply', enquiryPackagesReplyHandlers as Handlers),
  makeRoute('/api/enquiry-packages/$id/notes', enquiryPackagesNotesHandlers as Handlers),
  makeRoute('/api/enquiry-flights', enquiryFlightsHandlers as Handlers),
  makeRoute('/api/enquiry-flights/$id', enquiryFlightsIdHandlers as Handlers),
  makeRoute('/api/enquiry-flights/$id/reply', enquiryFlightsReplyHandlers as Handlers),
  makeRoute('/api/enquiry-flights/$id/notes', enquiryFlightsNotesHandlers as Handlers),
  makeRoute('/api/contacts', contactsHandlers as Handlers),
  makeRoute('/api/contacts/$id', contactsIdHandlers as Handlers),
  makeRoute('/api/contacts/$id/notes', contactsNotesHandlers as Handlers),
  makeRoute('/api/subscribers', subscribersHandlers as Handlers),
  makeRoute('/api/subscribers/$id', subscribersIdHandlers as Handlers),
  makeRoute('/api/users', usersHandlers as Handlers),
  makeRoute('/api/users/$id', usersIdHandlers as Handlers),
  makeRoute('/api/blog', blogHandlers as Handlers),
  makeRoute('/api/blog/$id', blogIdHandlers as Handlers),
  makeRoute('/api/destinations', destinationsHandlers as Handlers),
  makeRoute('/api/destinations/$id', destinationsIdHandlers as Handlers),
  makeRoute('/api/destination-highlights', destinationHighlightsHandlers as Handlers),
  makeRoute('/api/destination-highlights/$id', destinationHighlightsIdHandlers as Handlers),
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
  makeRoute('/api/flight-offers', flightOffersHandlers as Handlers),
  makeRoute('/api/flight-offers/$id', flightOffersIdHandlers as Handlers),
  makeRoute('/api/flight-offer-bookings', flightOfferBookingsHandlers as Handlers),
  makeRoute('/api/flight-offer-bookings/$id', flightOfferBookingsIdHandlers as Handlers),
  makeRoute('/api/upload', uploadHandlers as Handlers),
  makeRoute('/api/uploads/$filename', uploadsFilenameHandlers as Handlers),
];

// Fire-and-forget audit log for every mutating admin request. Only logs when an
// authenticated session is present — the public lead-capture POSTs (enquiries,
// contacts, subscribers, flight-offer-bookings) aren't "admin actions".
function logAdminAction(request: Request, path: string, status: number) {
  getSession(request)
    .then((session) => {
      if (!session) return;
      return db.insert(adminActions).values({ adminEmail: session.email, method: request.method, path, status });
    })
    .catch((err) => console.error('[audit] failed to log admin action:', err));
}

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
      const response = await handler({ request, params });
      if (request.method !== 'GET') logAdminAction(request, url.pathname, response.status);
      return response;
    } catch (error) {
      if (error instanceof Response) {
        if (request.method !== 'GET') logAdminAction(request, url.pathname, error.status);
        return error;
      }
      console.error(`API error ${request.method} ${url.pathname}:`, error);
      return Response.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }

  return null;
}
