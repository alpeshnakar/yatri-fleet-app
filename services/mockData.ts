import { Car, CarStatus, FinancialTransaction, TransactionStatus, Driver, Infringement, InfringementStatus, InfringementType } from '../types';

export const initialFleet: Car[] = [
  { id: 1, make: 'Toyota', model: 'Camry', year: 2021, rego: 'YAT-001', status: CarStatus.Rented },
  { id: 2, make: 'Hyundai', model: 'i30', year: 2022, rego: 'YAT-002', status: CarStatus.Rented },
  { id: 3, make: 'Kia', model: 'Carnival', year: 2023, rego: 'YAT-003', status: CarStatus.Available },
  { id: 4, make: 'MG', model: 'HS', year: 2022, rego: 'YAT-004', status: CarStatus.Maintenance },
  { id: 5, make: 'Toyota', model: 'RAV4', year: 2023, rego: 'YAT-005', status: CarStatus.Available },
  { id: 6, make: 'Tesla', model: 'Model 3', year: 2022, rego: 'YAT-006', status: CarStatus.Rented },
];

export const initialDrivers: Driver[] = [
    { id: 101, name: 'John Smith', phone: '+61412345678', activeCarRego: 'YAT-001'},
    { id: 102, name: 'Aisha Khan', phone: '+61487654321', activeCarRego: 'YAT-002'},
    { id: 103, name: 'Chen Wei', phone: '+61411223344', activeCarRego: null },
    { id: 104, name: 'David Miller', phone: '+61455667788', activeCarRego: 'YAT-006'},
];

export const initialTransactions: FinancialTransaction[] = [
  { id: 'txn_1', driverId: 101, driverName: 'John Smith', amount: 250.00, date: '2024-07-28', status: TransactionStatus.Reconciled, bank: 'CBA' },
  { id: 'txn_2', driverId: 102, driverName: 'Aisha Khan', amount: 275.00, date: '2024-07-29', status: TransactionStatus.Unreconciled, bank: 'NAB' },
  { id: 'txn_3', driverId: 104, driverName: 'David Miller', amount: 350.00, date: '2024-07-29', status: TransactionStatus.Failed, bank: 'CBA' },
  { id: 'txn_4', driverId: 101, driverName: 'John Smith', amount: 250.00, date: '2024-07-29', status: TransactionStatus.Unreconciled, bank: 'CBA' },
  { id: 'txn_5', driverId: 102, driverName: 'Aisha Khan', amount: 275.00, date: '2024-07-30', status: TransactionStatus.Unreconciled, bank: 'NAB' },
];

export const initialInfringements: Infringement[] = [
    { id: 'inf_1', rego: 'YAT-001', driverId: null, driverName: null, type: InfringementType.Toll, date: '2024-07-25', amount: 5.50, status: InfringementStatus.Pending },
    { id: 'inf_2', rego: 'YAT-002', driverId: 102, driverName: 'Aisha Khan', type: InfringementType.Infringement, date: '2024-07-22', amount: 185.00, status: InfringementStatus.Nominated },
    { id: 'inf_3', rego: 'YAT-006', driverId: 104, driverName: 'David Miller', type: InfringementType.Toll, date: '2024-07-20', amount: 12.75, status: InfringementStatus.Paid },
];

// Simulate API delay
const delay = <T,>(data: T, ms = 500): Promise<T> => new Promise(resolve => setTimeout(() => resolve(data), ms));

export const getFleetData = (): Promise<Car[]> => delay(initialFleet, 800);
export const getFinancialTransactions = (): Promise<FinancialTransaction[]> => delay(initialTransactions, 1200);
export const getDrivers = (): Promise<Driver[]> => delay(initialDrivers, 400);
export const getInfringements = (): Promise<Infringement[]> => delay(initialInfringements, 600);


export const getDriverByRego = (rego: string, drivers: Driver[]): Driver | undefined => {
    return drivers.find(d => d.activeCarRego === rego);
}
