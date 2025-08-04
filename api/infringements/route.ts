import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
 
export async function GET(request: Request) {
  try {
    const { rows } = await sql`SELECT id, rego, driver_id, driver_name, type, to_char(date, 'YYYY-MM-DD') as date, amount, status FROM infringements ORDER BY date DESC;`;
    return NextResponse.json({ data: rows }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function POST(request: Request) {
    try {
        const { rego, amount, type, date } = await request.json();
        const id = `inf_${Date.now()}`;
        const status = 'Pending Nomination';

        if (!rego || !amount || !type || !date) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        await sql`
            INSERT INTO infringements (id, rego, amount, type, date, status)
            VALUES (${id}, ${rego}, ${amount}, ${type}, ${date}, ${status});
        `;
        return NextResponse.json({ message: 'Infringement added' }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}