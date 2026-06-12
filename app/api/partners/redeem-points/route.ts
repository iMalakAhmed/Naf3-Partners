import { NextResponse } from "next/server";

const UPSTREAM_REDEEM_ENDPOINT =
  "https://nafaa-frfve0gyfyatgzh0.uaenorth-01.azurewebsites.net/api/partners/redeem-points";

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const authorization = request.headers.get("authorization") ?? "";
    const upstreamResponse = await fetch(UPSTREAM_REDEEM_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(authorization ? { Authorization: authorization } : {}),
      },
      body,
    });

    const responseBody = await upstreamResponse.text();
    return new NextResponse(responseBody, {
      status: upstreamResponse.status,
      headers: {
        "Content-Type":
          upstreamResponse.headers.get("Content-Type") ?? "application/json",
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Upstream redemption failed.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
