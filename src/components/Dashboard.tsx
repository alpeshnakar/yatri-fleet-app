import React, { useState, useEffect, useCallback } from 'react';
import FleetStatusCard from './FleetStatusCard';
import FinancialsCard from './FinancialsCard';
import CommunicationsCard from './CommunicationsCard';
import InfringementsCard from './InfringementsCard';
import DriverDetailModal from './DriverDetailModal';
import AdminCard from './AdminCard';
import { FinancialTransaction, Infringement, Driver, TransactionStatus, InfringementStatus, Car } from '../types';
import Spinner from './ui/Spinner';

const Dashboard: React.FC = () => {
    const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);
    const [infringements, setInfringements] = useState<Infringement[]>([]);
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [fleet, setFleet] = useState<Car[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
    const [seeding, setSeeding] = useState(false);
    const [seedMessage, setSeedMessage] = useState('');
    
    const fetchData = useCallback(async (showLoader = true) => {
        if(showLoader) setLoading(true); 
        try {
            const [transactionsRes, infringementsRes, driversRes, fleetRes] = await Promise.all([
                fetch('/api/transactions'),
                fetch('/api/infringements'),
                fetch('/api/drivers'),
                fetch('/api/fleet')
            ]);

            const transactionsData = await transactionsRes.json();
            const infringementsData = await infringementsRes.json();
            const driversData = await driversRes.json();
            const fleetData = await fleetRes.json();

            setTransactions(transactionsData.data || []);
            setInfringements(infringementsData.data || []);
            setDrivers(driversData.data || []);
            setFleet(fleetData.data || []);
        } catch (error) {
            console.error("Failed to load dashboard data", error);
        } finally {
            if(showLoader) setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);
    
    const handleDriverClick = (driverId: number) => {
        const driver = drivers.find(d => d.id === driverId);
        if (driver) {
            setSelectedDriver(driver);
        }
    };
    
    const handleCloseModal = () => {
        setSelectedDriver(null);
    };

    const handleReconcile = async (id: string) => {
        try {
            const response = await fetch(`/api/transactions/${id}/reconcile`, { method: 'PUT' });
            if (response.ok) {
                const updatedTransaction = await response.json();
                setTransactions(prev =>
                    prev.map(t =>
                        t.id === id ? { ...t, status: updatedTransaction.data.status } : t
                    )
                );
            }
        } catch (error) {
            console.error("Failed to reconcile transaction", error);
        }
    };
    
    const handleAddInfringement = async (data: Omit<Infringement, 'id' | 'status' | 'driverId' | 'driverName'>) => {
        try {
            const response = await fetch('/api/infringements', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (response.ok) {
                await fetchData(false); // Refetch data without full page loader
            }
        } catch(error) {
            console.error("Failed to add infringement", error);
        }
    };

    const handleNominate = async (infringementId: string) => {
        try {
            const response = await fetch(`/api/infringements/${infringementId}/nominate`, { method: 'PUT' });
            if (response.ok) {
                await fetchData(false); // Refetch data without full page loader
            } else {
                const errorData = await response.json();
                alert(errorData.error || 'Failed to nominate infringement');
            }
        } catch (error) {
            console.error("Failed to nominate infringement", error);
        }
    };

    const handleSeedDatabase = async () => {
        setSeeding(true);
        setSeedMessage('');
        try {
            const response = await fetch('/api/seed');
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error?.message || 'Failed to seed database.');
            }
            setSeedMessage('Database seeded successfully! Refreshing data...');
            await fetchData(false);
        } catch (error: any) {
            console.error("Failed to seed database", error);
            setSeedMessage(`Error: ${error.message}. This feature only works on a deployed Vercel environment.`);
        } finally {
            setSeeding(false);
        }
    };


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
                    <FleetStatusCard fleet={fleet} loading={loading} />
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
                    <AdminCard onSeed={handleSeedDatabase} seeding={seeding} message={seedMessage} />
                </div>
            </div>
             {selectedDriver && (
                <DriverDetailModal
                    driver={selectedDriver}
                    assignedCar={fleet.find(c => c.rego === selectedDriver.activeCarRego)}
                    transactions={transactions.filter(t => t.driverId === selectedDriver.id)}
                    infringements={infringements.filter(i => i.driverId === selectedDriver.id)}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
}

export default Dashboard;