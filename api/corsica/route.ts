import { NextRequest, NextResponse } from 'next/server'

export default async function POST(
  request: NextRequest
) {
  const data = request.formData()
  console.log(data)
  NextResponse.json(
    { ok: 'ok' },
    { status: 200 }
  )
}
