import React from 'react';
import { Car, CarStatus } from '../types';
import Card from './ui/Card';
import Spinner from './ui/Spinner';

const StatusPill: React.FC<{ status: CarStatus }> = ({ status }) => {
  const baseClasses = 'px-3 py-1 text-xs font-medium rounded-full inline-block';
  const statusClasses = {
    [CarStatus.Available]: 'bg-green-500/20 text-green-400',
    [CarStatus.Rented]: 'bg-blue-500/20 text-blue-400',
    [CarStatus.Maintenance]: 'bg-yellow-500/20 text-yellow-400',
  };
  return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
};

interface FleetStatusCardProps {
    fleet: Car[];
    loading: boolean;
}

const FleetStatusCard: React.FC<FleetStatusCardProps> = ({ fleet, loading }) => {

  const summary = {
      total: fleet.length,
      available: fleet.filter(c => c.status === CarStatus.Available).length,
      rented: fleet.filter(c => c.status === CarStatus.Rented).length,
      maintenance: fleet.filter(c => c.status === CarStatus.Maintenance).length
  }

  return (
    <Card>
      <h3 className="text-xl font-semibold text-white mb-4">Fleet Status</h3>
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Spinner />
        </div>
      ) : (
        <>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-center">
            <div className="bg-slate-700/50 p-4 rounded-lg">
                <p className="text-sm text-gray-400">Total Cars</p>
                <p className="text-2xl font-bold text-white">{summary.total}</p>
            </div>
            <div className="bg-slate-700/50 p-4 rounded-lg">
                <p className="text-sm text-gray-400">Available</p>
                <p className="text-2xl font-bold text-green-400">{summary.available}</p>
            </div>
            <div className="bg-slate-700/50 p-4 rounded-lg">
                <p className="text-sm text-gray-400">Rented</p>
                <p className="text-2xl font-bold text-blue-400">{summary.rented}</p>
            </div>
            <div className="bg-slate-700/50 p-4 rounded-lg">
                <p className="text-sm text-gray-400">Maintenance</p>
                <p className="text-2xl font-bold text-yellow-400">{summary.maintenance}</p>
            </div>
        </div>
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-700">
                <thead className="bg-slate-800">
                <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-300 sm:pl-6">Rego</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-300">Vehicle</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-300">Status</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                {fleet.map((car) => (
                    <tr key={car.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white sm:pl-6">{car.rego}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400">{`${car.make} ${car.model} (${car.year})`}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300"><StatusPill status={car.status}/></td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
        </>
      )}
    </Card>
  );
};

export default FleetStatusCard;