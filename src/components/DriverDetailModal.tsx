import React from 'react';
import { Driver, FinancialTransaction, Infringement, Car } from '../types';
import { initialFleet } from '../services/mockData';
import Modal from './ui/Modal';
import Button from './ui/Button';

interface DriverDetailModalProps {
    driver: Driver | null;
    transactions: FinancialTransaction[];
    infringements: Infringement[];
    onClose: () => void;
}

const DriverDetailModal: React.FC<DriverDetailModalProps> = ({ driver, transactions, infringements, onClose }) => {
    if (!driver) return null;

    const assignedCar = initialFleet.find(c => c.rego === driver.activeCarRego);

    const renderSection = (title: string, items: any[], columns: { header: string, key: string, render?: (item: any) => React.ReactNode }[]) => (
        <div>
            <h4 className="text-md font-semibold text-gray-300 mb-2">{title}</h4>
            {items.length > 0 ? (
                <div className="overflow-x-auto rounded-lg border border-slate-700">
                    <table className="min-w-full divide-y divide-slate-700">
                        <thead className="bg-slate-700/50">
                            <tr>
                                {columns.map(col => <th key={col.key} className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">{col.header}</th>)}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {items.map((item, index) => (
                                <tr key={index}>
                                    {columns.map(col => (
                                        <td key={col.key} className="px-3 py-2 whitespace-nowrap text-sm text-gray-300">
                                            {col.render ? col.render(item) : item[col.key]}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-sm text-gray-500">No records found.</p>
            )}
        </div>
    );

    return (
        <Modal isOpen={!!driver} onClose={onClose}>
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-2xl font-bold text-white">{driver.name}</h3>
                    <p className="text-sm text-gray-400">{driver.phone}</p>
                </div>
                <Button size="sm" variant="secondary" onClick={onClose}>Close</Button>
            </div>
            
            <div className="mt-4 border-t border-slate-700 pt-4">
                <h4 className="text-md font-semibold text-gray-300 mb-2">Assigned Vehicle</h4>
                {assignedCar ? (
                     <p className="text-sm text-gray-300">{assignedCar.make} {assignedCar.model} ({assignedCar.year}) - <span className="font-mono bg-slate-700 px-2 py-1 rounded">{assignedCar.rego}</span></p>
                ) : (
                    <p className="text-sm text-gray-500">No vehicle assigned.</p>
                )}
            </div>

            <div className="mt-6 space-y-6">
                {renderSection("Financial History", transactions, [
                    { header: 'Date', key: 'date' },
                    { header: 'Amount', key: 'amount', render: (item) => `$${item.amount.toFixed(2)}` },
                    { header: 'Status', key: 'status' },
                    { header: 'Bank', key: 'bank' }
                ])}
                {renderSection("Infringement History", infringements, [
                    { header: 'Date', key: 'date' },
                    { header: 'Type', key: 'type' },
                    { header: 'Amount', key: 'amount', render: (item) => `$${item.amount.toFixed(2)}` },
                    { header: 'Status', key: 'status' },
                ])}
            </div>
        </Modal>
    );
};

export default DriverDetailModal;