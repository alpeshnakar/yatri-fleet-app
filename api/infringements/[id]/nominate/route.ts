import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const infringementId = params.id;

    // Begin transaction
    await sql`BEGIN`;

    // 1. Get the infringement details
    const infringementRes = await sql`SELECT * FROM infringements WHERE id = ${infringementId};`;
    if (infringementRes.rowCount === 0) {
      await sql`ROLLBACK`;
      return NextResponse.json({ error: 'Infringement not found' }, { status: 404 });
    }
    const infringement = infringementRes.rows[0];

    // 2. Find the driver associated with the car's rego at the time
    const driverRes = await sql`SELECT * FROM drivers WHERE active_car_rego = ${infringement.rego};`;
    if (driverRes.rowCount === 0) {
      await sql`ROLLBACK`;
      return NextResponse.json({ error: `No active driver found for vehicle rego: ${infringement.rego}` }, { status: 404 });
    }
    const driver = driverRes.rows[0];

    // 3. Update the infringement status and assign the driver
    const newStatus = 'Nominated & Unpaid';
    await sql`
      UPDATE infringements 
      SET status = ${newStatus}, driver_id = ${driver.id}, driver_name = ${driver.name}
      WHERE id = ${infringementId};
    `;

    // 4. Create a new financial transaction for the infringement + admin fee
    const transactionId = `txn_inf_${infringementId}`;
    const transactionAmount = parseFloat(infringement.amount) + 5.00;
    const transactionDate = new Date().toISOString().split('T')[0];
    const transactionStatus = 'Unreconciled';
    const transactionBank = 'CBA'; // Or determine dynamically

    await sql`
      INSERT INTO transactions (id, driver_id, driver_name, amount, date, status, bank)
      VALUES (${transactionId}, ${driver.id}, ${driver.name}, ${transactionAmount}, ${transactionDate}, ${transactionStatus}, ${transactionBank});
    `;
    
    // Commit transaction
    await sql`COMMIT`;

    return NextResponse.json({ message: 'Nomination successful' }, { status: 200 });

  } catch (error: any) {
    await sql`ROLLBACK`;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}