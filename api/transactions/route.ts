import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
 
export async function GET(request: Request) {
  try {
    const { rows } = await sql`SELECT id, driver_id, driver_name, amount, to_char(date, 'YYYY-MM-DD') as date, status, bank FROM transactions ORDER BY date DESC;`;
    return NextResponse.json({ data: rows }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}