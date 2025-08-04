export enum CarStatus {
  Available = 'Available',
  Rented = 'Rented',
  Maintenance = 'Maintenance',
}

export interface Car {
  id: number;
  make: string;
  model: string;
  year: number;
  rego: string;
  status: CarStatus;
}

export enum TransactionStatus {
  Unreconciled = 'Unreconciled',
  Reconciled = 'Reconciled',
  Failed = 'Failed',
}

export interface FinancialTransaction {
  id: string;
  driverId: number;
  driverName: string;
  amount: number;
  date: string;
  status: TransactionStatus;
  bank: 'NAB' | 'CBA';
}

export interface Driver {
    id: number;
    name: string;
    phone: string;
    activeCarRego: string | null;
}

export enum MessageTemplate {
    PaymentReminder = 'Payment Reminder',
    PaymentFailed = 'Payment Failed',
    GeneralUpdate = 'General Update',
}

export enum InfringementType {
    Toll = 'Toll',
    Infringement = 'Infringement Notice',
}

export enum InfringementStatus {
    Pending = 'Pending Nomination',
    Nominated = 'Nominated & Unpaid',
    Paid = 'Paid',
}

export interface Infringement {
    id: string;
    rego: string;
    driverId: number | null;
    driverName: string | null;
    type: InfringementType;
    date: string;
    amount: number;
    status: InfringementStatus;
}
