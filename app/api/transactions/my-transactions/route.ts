import { NextResponse } from "next/server";

const UPSTREAM_TRANSACTIONS_ENDPOINT =
  "https://nafaa-frfve0gyfyatgzh0.uaenorth-01.azurewebsites.net/api/Transactions/my-transactions";

export async function GET(request: Request) {
  try {
    const authorization = request.headers.get("authorization") ?? "";
    const upstreamResponse = await fetch(UPSTREAM_TRANSACTIONS_ENDPOINT, {
      headers: {
        ...(authorization ? { Authorization: authorization } : {}),
      },
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
      error instanceof Error ? error.message : "Upstream transactions failed.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
