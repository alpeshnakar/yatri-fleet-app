// To execute this script, navigate to /api/seed in your browser after deployment.
//import { sql } from '@vercel/postgres';
//import { NextResponse } from 'next/server';
import { neon } from "@neondatabase/serverless";
export async function getData() {
    const sql = neon(process.env.DATABASE_URL);
    const data = await sql`SELECT * FROM posts;`;
    return data;
}


const initialFleet = [
  { id: 1, make: 'Toyota', model: 'Camry', year: 2021, rego: 'YAT-001', status: 'Rented' },
  { id: 2, make: 'Hyundai', model: 'i30', year: 2022, rego: 'YAT-002', status: 'Rented' },
  { id: 3, make: 'Kia', model: 'Carnival', year: 2023, rego: 'YAT-003', status: 'Available' },
  { id: 4, make: 'MG', model: 'HS', year: 2022, rego: 'YAT-004', status: 'Maintenance' },
  { id: 5, make: 'Toyota', model: 'RAV4', year: 2023, rego: 'YAT-005', status: 'Available' },
  { id: 6, make: 'Tesla', model: 'Model 3', year: 2022, rego: 'YAT-006', status: 'Rented' },
];

const initialDrivers = [
    { id: 101, name: 'John Smith', phone: '+61412345678', activeCarRego: 'YAT-001'},
    { id: 102, name: 'Aisha Khan', phone: '+61487654321', activeCarRego: 'YAT-002'},
    { id: 103, name: 'Chen Wei', phone: '+61411223344', activeCarRego: null },
    { id: 104, name: 'David Miller', phone: '+61455667788', activeCarRego: 'YAT-006'},
];

const initialTransactions = [
  { id: 'txn_1', driverId: 101, driverName: 'John Smith', amount: 250.00, date: '2024-07-28', status: 'Reconciled', bank: 'CBA' },
  { id: 'txn_2', driverId: 102, driverName: 'Aisha Khan', amount: 275.00, date: '2024-07-29', status: 'Unreconciled', bank: 'NAB' },
  { id: 'txn_3', driverId: 104, driverName: 'David Miller', amount: 350.00, date: '2024-07-29', status: 'Failed', bank: 'CBA' },
  { id: 'txn_4', driverId: 101, driverName: 'John Smith', amount: 250.00, date: '2024-07-29', status: 'Unreconciled', bank: 'CBA' },
  { id: 'txn_5', driverId: 102, driverName: 'Aisha Khan', amount: 275.00, date: '2024-07-30', status: 'Unreconciled', bank: 'NAB' },
];

const initialInfringements = [
    { id: 'inf_1', rego: 'YAT-001', driverId: null, driverName: null, type: 'Toll', date: '2024-07-25', amount: 5.50, status: 'Pending Nomination' },
    { id: 'inf_2', rego: 'YAT-002', driverId: 102, driverName: 'Aisha Khan', type: 'Infringement Notice', date: '2024-07-22', amount: 185.00, status: 'Nominated & Unpaid' },
    { id: 'inf_3', rego: 'YAT-006', driverId: 104, driverName: 'David Miller', type: 'Toll', date: '2024-07-20', amount: 12.75, status: 'Paid' },
];

async function seedCars() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await sql`
    CREATE TABLE IF NOT EXISTS cars (
      id SERIAL PRIMARY KEY,
      make VARCHAR(255) NOT NULL,
      model VARCHAR(255) NOT NULL,
      year INT NOT NULL,
      rego VARCHAR(10) NOT NULL UNIQUE,
      status VARCHAR(50) NOT NULL
    );
  `;
  const insertedCars = await Promise.all(
    initialFleet.map(car => sql`
      INSERT INTO cars (id, make, model, year, rego, status)
      VALUES (${car.id}, ${car.make}, ${car.model}, ${car.year}, ${car.rego}, ${car.status})
      ON CONFLICT (id) DO NOTHING;
    `)
  );
  return insertedCars;
}

async function seedDrivers() {
    await sql`
    CREATE TABLE IF NOT EXISTS drivers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        active_car_rego VARCHAR(10)
    );
    `;
    const insertedDrivers = await Promise.all(
        initialDrivers.map(driver => sql`
            INSERT INTO drivers (id, name, phone, active_car_rego)
            VALUES (${driver.id}, ${driver.name}, ${driver.phone}, ${driver.activeCarRego})
            ON CONFLICT (id) DO NOTHING;
        `)
    );
    return insertedDrivers;
}

async function seedTransactions() {
    await sql`
    CREATE TABLE IF NOT EXISTS transactions (
        id VARCHAR(255) PRIMARY KEY,
        driver_id INT NOT NULL,
        driver_name VARCHAR(255) NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        date DATE NOT NULL,
        status VARCHAR(50) NOT NULL,
        bank VARCHAR(10) NOT NULL
    );
    `;
    const insertedTransactions = await Promise.all(
        initialTransactions.map(t => sql`
            INSERT INTO transactions (id, driver_id, driver_name, amount, date, status, bank)
            VALUES (${t.id}, ${t.driverId}, ${t.driverName}, ${t.amount}, ${t.date}, ${t.status}, ${t.bank})
            ON CONFLICT (id) DO NOTHING;
        `)
    );
    return insertedTransactions;
}


async function seedInfringements() {
    await sql`
    CREATE TABLE IF NOT EXISTS infringements (
        id VARCHAR(255) PRIMARY KEY,
        rego VARCHAR(10) NOT NULL,
        driver_id INT,
        driver_name VARCHAR(255),
        type VARCHAR(50) NOT NULL,
        date DATE NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        status VARCHAR(50) NOT NULL
    );
    `;
    const insertedInfringements = await Promise.all(
        initialInfringements.map(i => sql`
            INSERT INTO infringements (id, rego, driver_id, driver_name, type, date, amount, status)
            VALUES (${i.id}, ${i.rego}, ${i.driverId}, ${i.driverName}, ${i.type}, ${i.date}, ${i.amount}, ${i.status})
            ON CONFLICT (id) DO NOTHING;
        `)
    );
    return insertedInfringements;
}


export async function GET(request: Request) {
  try {
    await sql`BEGIN`;
    await seedCars();
    await seedDrivers();
    await seedTransactions();
    await seedInfringements();
    await sql`COMMIT`;

    return NextResponse.json({ message: 'Database seeded successfully!' }, { status: 200 });
  } catch (error) {
    await sql`ROLLBACK`;
    return NextResponse.json({ error }, { status: 500 });
  }
}