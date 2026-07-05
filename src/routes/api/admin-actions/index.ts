import { createAPIFileRoute } from "@tanstack/react-start/api";
import { count, desc, eq } from "drizzle-orm";
import { db, adminActions, adminUsers, type AdminAction } from "../../../../db/index";
import { requireSuperAdmin } from "@/server/auth";
import { DEFAULT_LIST_LIMIT } from "@/server/pagination";
import { describeAdminAction } from "@/server/audit-log";

function withMessage(row: AdminAction, displayName: string | null) {
  const adminName = displayName || row.adminEmail;
  return {
    ...row,
    adminName,
    message: describeAdminAction({
      action: row.action,
      resourceType: row.resourceType,
      resourceLabel: row.resourceLabel,
      adminName,
    }),
  };
}

async function fetchPage(limit: number, offset: number) {
  return db
    .select({ action: adminActions, displayName: adminUsers.displayName })
    .from(adminActions)
    .leftJoin(adminUsers, eq(adminUsers.email, adminActions.adminEmail))
    .orderBy(desc(adminActions.createdAt))
    .limit(limit)
    .offset(offset);
}

// Read-only — this log is permanent, so there is intentionally no PATCH/DELETE
// handler here or anywhere else in the app for admin_actions rows.
export const APIRoute = createAPIFileRoute("/api/admin-actions")({
  GET: async ({ request }) => {
    await requireSuperAdmin(request);
    const url = new URL(request.url);
    const limit = Number(url.searchParams.get("limit") || "0");
    const page = Math.max(1, Number(url.searchParams.get("page") || "1"));

    if (limit > 0) {
      const [{ total }] = await db.select({ total: count() }).from(adminActions);
      const rows = await fetchPage(limit, (page - 1) * limit);
      return Response.json({
        data: rows.map((r) => withMessage(r.action, r.displayName)),
        total,
        page,
        limit,
      });
    }

    const rows = await fetchPage(DEFAULT_LIST_LIMIT, 0);
    return Response.json(rows.map((r) => withMessage(r.action, r.displayName)));
  },
});
