import { strict } from 'assert';
import { NextRequest, NextResponse } from 'next/server';

const baseUrl = 'https://localhost:7225/api/User';



export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('[API] Request Body:', body);
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

    const response = await fetch(`${baseUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    console.log('[API] Backend response status:', response.status);

    const text = await response.text(); // Read raw body first for debugging
    console.log('[API] Backend raw response:', text);

    if (!response.ok) {
      return NextResponse.json({ success: false, message: text || 'Login failed.' }, { status: response.status });
    }

    const data = JSON.parse(text); // Safely parse manually
    console.log('[API] Parsed backend response:', data);
   
    const res = NextResponse.json({ success: true, username: data.username });


    // res.cookies.set('token', data.token, {
    //   httpOnly: true,
    //   secure: false,
    //   sameSite: 'none',
    //   // maxAge: 60 * 60 * 24,
    //   path: '/',
    // });
// document.cookie = `token=${encodeURIComponent(data.token)}; path=/; secure; samesite=lax`;



    return res;

  } catch (error: any) {
    console.error('[API] Error during login route:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error during login.' },
      { status: 500 }
    );
  }
}
