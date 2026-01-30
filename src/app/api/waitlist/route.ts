import { NextResponse } from "next/server";

const LOOPS_API_KEY = process.env.LOOPS_API_KEY;

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "An email is required." },
        { status: 400 },
      );
    }

    if (!LOOPS_API_KEY) {
      return NextResponse.json(
        { error: "No LOOPS_API_KEY found." },
        { status: 500 },
      );
    }

    const response = await fetch(
      "https://app.loops.so/api/v1/contacts/create",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${LOOPS_API_KEY}`,
        },
        body: JSON.stringify({ email }),
      },
    );

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const message =
        typeof data?.message === "string"
          ? data.message
          : typeof data?.error === "string"
            ? data.error
            : "Failed to subscribe.";

      if (message.toLowerCase().includes("already exists")) {
        return NextResponse.json(
          { error: "This email already exists in our waitlist." },
          { status: 400 },
        );
      }

      return NextResponse.json(
        { error: message },
        { status: response.status || 500 },
      );
    }

    return NextResponse.json(
      {
        message:
          "Successfully subscribed to waitlist! You will receive a confirmation email soon.",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Waitlist signup error:", error);

    return NextResponse.json(
      { error: "Failed to signup to waitlist." },
      { status: 500 },
    );
  }
}
