import { NextResponse } from "next/server"

const allowedOrigins = process.env.NODE_ENV === 'production'
    ? ['http://localhost:5000', 'http://localhost:4000','http://10.80.0.148:4200']
    : ['http://localhost:3000','http://localhost:4200','http://192.168.1.11:4200','http://10.80.0.148:4200']

export function middleware(request: Request) {

    const origin = request.headers.get('origin')
    console.log(origin)

    if (origin && !allowedOrigins.includes(origin)) {
        return new NextResponse(null, {
            status: 400,
            statusText: "Bad Request - Invalid Origin",
            headers: {
                'Content-Type': 'text/plain'
            }
        })
    }

   


    return NextResponse.next()
}

export const config = {
    matcher: '/api/:path*',
}