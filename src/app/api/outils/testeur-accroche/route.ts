import { handleToolRequest } from "@/lib/server/tool-handler";

// Route handler serveur de l'outil. Seule la méthode POST est acceptée (405 sinon).
export const runtime = "nodejs";

export async function POST(req: Request) {
  return handleToolRequest("accroche", req);
}
