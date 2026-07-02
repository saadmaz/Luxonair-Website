// Applied to every list endpoint's "no ?limit= supplied" branch so an admin
// client (or anyone hitting the endpoint directly) can't force an unbounded
// SELECT * as tables grow. Explicit ?limit=&page= pagination is unaffected.
export const DEFAULT_LIST_LIMIT = 200;
