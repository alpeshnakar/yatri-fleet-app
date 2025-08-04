import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
 
export async function GET(request: Request) {
  try {
    const { rows: drivers } = await sql`SELECT id, name, phone, active_car_rego FROM drivers ORDER BY name;`;
    return NextResponse.json({ data: drivers }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}