import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
 
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    await sql`UPDATE transactions SET status = 'Reconciled' WHERE id = ${id};`;
    const { rows } = await sql`SELECT * FROM transactions WHERE id = ${id};`;
    return NextResponse.json({ data: rows[0] }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}