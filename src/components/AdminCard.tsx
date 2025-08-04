import React from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import Spinner from './ui/Spinner';

interface AdminCardProps {
    onSeed: () => void;
    seeding: boolean;
    message: string;
}

const AdminCard: React.FC<AdminCardProps> = ({ onSeed, seeding, message }) => {
    return (
        <Card>
            <h3 className="text-xl font-semibold text-white">System Administration</h3>
            <p className="text-sm text-gray-400 mt-1">One-time setup actions.</p>
            <div className="mt-6">
                <p className="text-sm text-gray-300 mb-3">
                    If this is a new deployment, click the button below to populate the database with initial data. This is only required once.
                </p>
                <Button onClick={onSeed} disabled={seeding} className="w-full">
                    {seeding ? <Spinner size="sm" /> : 'Seed Database'}
                </Button>
                {message && (
                    <p className={`mt-3 text-sm text-center ${message.startsWith('Error:') ? 'text-red-400' : 'text-green-400'}`}>
                        {message}
                    </p>
                )}
            </div>
        </Card>
    );
};

export default AdminCard;
