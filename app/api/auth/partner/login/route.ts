import { NextResponse } from "next/server";

const UPSTREAM_LOGIN_ENDPOINT =
  "https://nafaa-frfve0gyfyatgzh0.uaenorth-01.azurewebsites.net/api/auth/partner/login";

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const upstreamResponse = await fetch(UPSTREAM_LOGIN_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
      error instanceof Error ? error.message : "Upstream login failed.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
