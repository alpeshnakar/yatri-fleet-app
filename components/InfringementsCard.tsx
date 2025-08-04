import React, { useState } from 'react';
import { Infringement, InfringementStatus, InfringementType } from '../types';
import Card from './ui/Card';
import Button from './ui/Button';
import Modal from './ui/Modal';
import Input from './ui/Input';
import Select from './ui/Select';
import { InfringementIcon } from '../constants';

const StatusBadge: React.FC<{ status: InfringementStatus }> = ({ status }) => {
    const baseClasses = 'px-3 py-1 text-xs font-medium rounded-full inline-flex items-center gap-x-1.5';
    const statusInfo = {
        [InfringementStatus.Pending]: { classes: 'bg-yellow-500/20 text-yellow-400' },
        [InfringementStatus.Nominated]: { classes: 'bg-blue-500/20 text-blue-400' },
        [InfringementStatus.Paid]: { classes: 'bg-green-500/20 text-green-400' },
    };
    return <span className={`${baseClasses} ${statusInfo[status].classes}`}>{status}</span>;
};

interface InfringementsCardProps {
    infringements: Infringement[];
    onAddInfringement: (data: Omit<Infringement, 'id' | 'status' | 'driverId' | 'driverName'>) => void;
    onNominate: (id: string) => void;
    onDriverClick: (driverId: number) => void;
}

const InfringementsCard: React.FC<InfringementsCardProps> = ({ infringements, onAddInfringement, onNominate, onDriverClick }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newNotice, setNewNotice] = useState({
        rego: '',
        amount: '',
        type: InfringementType.Toll,
        date: new Date().toISOString().split('T')[0],
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewNotice(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAddInfringement({
            ...newNotice,
            amount: parseFloat(newNotice.amount) || 0,
        });
        setIsModalOpen(false);
        setNewNotice({ rego: '', amount: '', type: InfringementType.Toll, date: new Date().toISOString().split('T')[0] });
    };
    
    return (
        <>
            <Card>
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-xl font-semibold text-white">Infringements & Tolls</h3>
                        <p className="text-sm text-gray-400 mt-1">Manage incoming notices</p>
                    </div>
                    <Button size="sm" onClick={() => setIsModalOpen(true)}>Add New Notice</Button>
                </div>

                <div className="mt-6 flow-root">
                    <ul role="list" className="-my-4 divide-y divide-slate-700">
                        {infringements.map((item) => (
                            <li key={item.id} className="flex items-center py-4 space-x-4">
                                <div className="flex-shrink-0">
                                    <InfringementIcon className={`h-8 w-8 ${item.status === InfringementStatus.Pending ? 'text-yellow-400' : 'text-gray-500'}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-white truncate">{item.type} - {item.rego}</p>
                                    <p className="text-sm text-gray-400 truncate">
                                        ${item.amount.toFixed(2)} on {item.date}
                                        {item.driverName && item.driverId && (
                                           <>
                                             {' | Nominated to '} 
                                             <span onClick={() => onDriverClick(item.driverId!)} className="font-semibold text-purple-400 cursor-pointer hover:underline">
                                                 {item.driverName}
                                             </span>
                                           </>
                                        )}
                                    </p>
                                    <div className="mt-1">
                                       <StatusBadge status={item.status} />
                                    </div>
                                </div>
                                <div>
                                    {item.status === InfringementStatus.Pending && (
                                        <Button size="sm" variant="secondary" onClick={() => onNominate(item.id)}>Nominate</Button>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </Card>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <form onSubmit={handleSubmit}>
                    <h3 className="text-lg font-semibold text-white">Add New Notice</h3>
                    <div className="mt-4 space-y-4">
                        <div>
                            <label htmlFor="rego" className="block text-sm font-medium text-gray-300 mb-1">Vehicle Rego</label>
                            <Input type="text" name="rego" id="rego" value={newNotice.rego} onChange={handleInputChange} placeholder="YAT-123" required />
                        </div>
                        <div>
                            <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-1">Amount</label>
                            <Input type="number" name="amount" id="amount" value={newNotice.amount} onChange={handleInputChange} placeholder="55.00" required step="0.01" />
                        </div>
                        <div>
                            <label htmlFor="date" className="block text-sm font-medium text-gray-300 mb-1">Date of Notice</label>
                            <Input type="date" name="date" id="date" value={newNotice.date} onChange={handleInputChange} required />
                        </div>
                        <div>
                            <label htmlFor="type" className="block text-sm font-medium text-gray-300 mb-1">Type</label>
                            <Select 
                                name="type" 
                                id="type" 
                                value={newNotice.type} 
                                onChange={handleInputChange}
                                options={Object.values(InfringementType).map(t => ({ value: t, label: t }))}
                            />
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end space-x-3">
                        <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button type="submit">Add Notice</Button>
                    </div>
                </form>
            </Modal>
        </>
    );
};

export default InfringementsCard;