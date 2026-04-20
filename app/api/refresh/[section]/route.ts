import { NextResponse } from "next/server";

export async function POST(
  _request: Request,
  context: { params: Promise<{ section: string }> }
) {
  const { section } = await context.params;

  return NextResponse.json({
    ok: true,
    section,
    refreshedAt: new Date().toISOString(),
    message: `Manual refresh recorded for ${section}. Hook your live ingestion job here.`
  });
}
