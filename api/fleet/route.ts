import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
 
export async function GET(request: Request) {
  try {
    const { rows: cars } = await sql`SELECT * FROM cars ORDER BY rego;`;
    return NextResponse.json({ data: cars }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}