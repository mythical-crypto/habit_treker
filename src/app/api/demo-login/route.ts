import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const origin = process.env.BETTER_AUTH_URL ?? "http://127.0.0.1:3000";

  const authResponse = await fetch(`${origin}/api/auth/sign-in/email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: origin,
    },
    body: JSON.stringify({ email, password }),
  });

  if (!authResponse.ok) {
    return NextResponse.redirect(new URL("/login?error=1", origin), 303);
  }

  const response = NextResponse.redirect(new URL("/", origin), 303);
  const setCookie = authResponse.headers.get("set-cookie");
  if (setCookie) {
    response.headers.set("set-cookie", setCookie);
  }

  return response;
}
