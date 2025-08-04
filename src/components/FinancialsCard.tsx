import React from 'react';
import { FinancialTransaction, TransactionStatus } from '../types';
import Card from './ui/Card';
import Button from './ui/Button';
import { NABLogo, CBALogo } from '../constants';

const StatusBadge: React.FC<{ status: TransactionStatus }> = ({ status }) => {
    const baseClasses = 'px-3 py-1 text-xs font-medium rounded-full inline-flex items-center gap-x-1.5';
    const statusInfo = {
        [TransactionStatus.Unreconciled]: {
            classes: 'bg-orange-400/20 text-orange-400',
            icon: <svg className="h-1.5 w-1.5 fill-orange-400" viewBox="0 0 6 6" aria-hidden="true"><circle cx={3} cy={3} r={3} /></svg>,
            text: 'Unreconciled'
        },
        [TransactionStatus.Reconciled]: {
            classes: 'bg-green-500/20 text-green-400',
            icon: <svg className="h-1.5 w-1.5 fill-green-400" viewBox="0 0 6 6" aria-hidden="true"><circle cx={3} cy={3} r={3} /></svg>,
            text: 'Reconciled'
        },
        [TransactionStatus.Failed]: {
            classes: 'bg-red-500/20 text-red-400',
            icon: <svg className="h-1.5 w-1.5 fill-red-400" viewBox="0 0 6 6" aria-hidden="true"><circle cx={3} cy={3} r={3} /></svg>,
            text: 'Failed'
        }
    }
    const currentStatus = statusInfo[status];

    return (
        <span className={`${baseClasses} ${currentStatus.classes}`}>
            {currentStatus.icon}
            {currentStatus.text}
        </span>
    );
};

interface FinancialsCardProps {
    transactions: FinancialTransaction[];
    onReconcile: (id: string) => void;
    onDriverClick: (driverId: number) => void;
}

const FinancialsCard: React.FC<FinancialsCardProps> = ({ transactions, onReconcile, onDriverClick }) => {
  return (
    <Card>
      <div className="flex justify-between items-start">
        <div>
            <h3 className="text-xl font-semibold text-white">Financial Reconciliation</h3>
            <p className="text-sm text-gray-400 mt-1">Open Banking Feed (NAB & CBA)</p>
        </div>
        <div className="flex items-center space-x-2">
            <NABLogo className="h-8 w-8" />
            <CBALogo className="h-8 w-8" />
        </div>
      </div>
      <div className="mt-6 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-slate-700">
                <thead className="bg-slate-800">
                    <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-300 sm:pl-0">Driver</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-300">Amount</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-300">Status</th>
                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0"><span className="sr-only">Action</span></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 bg-slate-900/50">
                {transactions.map((t) => (
                    <tr key={t.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-0">
                           <div className="flex items-center">
                               {t.bank === 'NAB' ? <NABLogo className="h-5 w-5 mr-3 flex-shrink-0"/> : <CBALogo className="h-5 w-5 mr-3 flex-shrink-0"/>}
                               <div>
                                   <div className="font-medium text-white cursor-pointer hover:text-purple-400 transition-colors" onClick={() => onDriverClick(t.driverId)}>{t.driverName}</div>
                                   <div className="text-gray-400">{t.date}</div>
                               </div>
                           </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">${t.amount.toFixed(2)}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300"><StatusBadge status={t.status} /></td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                            {t.status === TransactionStatus.Unreconciled && (
                                <Button size="sm" onClick={() => onReconcile(t.id)}>Reconcile</Button>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default FinancialsCard;