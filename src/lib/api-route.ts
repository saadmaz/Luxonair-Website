type Ctx = { request: Request; params: Record<string, string> };
type Handler = (ctx: Ctx) => Promise<Response> | Response;

export function createAPIFileRoute(_path: string) {
  return (handlers: Record<string, Handler>) => handlers;
}
