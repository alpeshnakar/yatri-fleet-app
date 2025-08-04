import React, { useState, useEffect, useCallback } from 'react';
import FleetStatusCard from './FleetStatusCard';
import FinancialsCard from './FinancialsCard';
import CommunicationsCard from './CommunicationsCard';
import InfringementsCard from './InfringementsCard';
import DriverDetailModal from './DriverDetailModal';
import { FinancialTransaction, Infringement, Driver, TransactionStatus, InfringementStatus } from '../types';
import { getFinancialTransactions, getInfringements, getDrivers, getDriverByRego } from '../services/mockData';
import Spinner from './ui/Spinner';

const Dashboard: React.FC = () => {
    const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);
    const [infringements, setInfringements] = useState<Infringement[]>([]);
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);

    useEffect(() => {
        const loadAllData = async () => {
            setLoading(true);
            const [transactionsData, infringementsData, driversData] = await Promise.all([
                getFinancialTransactions(),
                getInfringements(),
                getDrivers()
            ]);
            setTransactions(transactionsData);
            setInfringements(infringementsData);
            setDrivers(driversData);
            setLoading(false);
        };
        loadAllData();
    }, []);
    
    const handleDriverClick = (driverId: number) => {
        const driver = drivers.find(d => d.id === driverId);
        if (driver) {
            setSelectedDriver(driver);
        }
    };
    
    const handleCloseModal = () => {
        setSelectedDriver(null);
    };

    const handleReconcile = (id: string) => {
        setTransactions(prev =>
            prev.map(t =>
                t.id === id ? { ...t, status: TransactionStatus.Reconciled } : t
            )
        );
    };
    
    const handleAddInfringement = useCallback((data: Omit<Infringement, 'id' | 'status' | 'driverId' | 'driverName'>) => {
        const newInfringement: Infringement = {
            ...data,
            id: `inf_${Date.now()}`,
            status: InfringementStatus.Pending,
            driverId: null,
            driverName: null,
        };
        setInfringements(prev => [newInfringement, ...prev]);
    }, []);

    const handleNominate = useCallback((infringementId: string) => {
        const infringement = infringements.find(i => i.id === infringementId);
        if (!infringement) return;

        const driver = getDriverByRego(infringement.rego, drivers);
        if (!driver) {
            alert(`No active driver found for vehicle rego: ${infringement.rego}`);
            return;
        }

        setInfringements(prev => prev.map(i => 
            i.id === infringementId 
            ? { ...i, status: InfringementStatus.Nominated, driverId: driver.id, driverName: driver.name } 
            : i
        ));

        const newTransaction: FinancialTransaction = {
            id: `txn_inf_${infringement.id}`,
            driverId: driver.id,
            driverName: driver.name,
            amount: infringement.amount + 5.00,
            date: new Date().toISOString().split('T')[0],
            status: TransactionStatus.Unreconciled,
            bank: 'CBA',
        };
        setTransactions(prev => [newTransaction, ...prev]);

    }, [infringements, drivers]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div className="px-4 py-6 sm:px-0">
             <h1 className="text-3xl font-bold text-white mb-6">Fleet Dashboard</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 space-y-8">
                    <FleetStatusCard />
                    <FinancialsCard 
                        transactions={transactions} 
                        onReconcile={handleReconcile}
                        onDriverClick={handleDriverClick}
                    />
                </div>
                <div className="lg:col-span-1 space-y-8">
                    <InfringementsCard 
                        infringements={infringements} 
                        onAddInfringement={handleAddInfringement}
                        onNominate={handleNominate}
                        onDriverClick={handleDriverClick}
                    />
                    <CommunicationsCard drivers={drivers} />
                </div>
            </div>
             {selectedDriver && (
                <DriverDetailModal
                    driver={selectedDriver}
                    transactions={transactions.filter(t => t.driverId === selectedDriver.id)}
                    infringements={infringements.filter(i => i.driverId === selectedDriver.id)}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
}

export default Dashboard;