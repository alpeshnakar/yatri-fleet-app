import React, { useState, useEffect, useCallback } from 'react';
import { Driver, MessageTemplate } from '../types';
import { generateWhatsappMessage } from '../services/geminiService';
import Card from './ui/Card';
import Button from './ui/Button';
import Spinner from './ui/Spinner';
import { WhatsAppLogo } from '../constants';
import Select from './ui/Select';

interface CommunicationsCardProps {
    drivers: Driver[];
}

const CommunicationsCard: React.FC<CommunicationsCardProps> = ({ drivers }) => {
  const [selectedDriverId, setSelectedDriverId] = useState<string>('');
  const [template, setTemplate] = useState<MessageTemplate>(MessageTemplate.PaymentReminder);
  const [message, setMessage] = useState('');
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (drivers.length > 0 && !selectedDriverId) {
        setSelectedDriverId(drivers[0].id.toString());
    }
  }, [drivers, selectedDriverId]);

  const handleGenerateMessage = useCallback(async () => {
    if (!selectedDriverId) return;
    setGenerating(true);
    setMessage('');
    try {
      const driver = drivers.find(d => d.id.toString() === selectedDriverId);
      if (driver) {
        const generatedText = await generateWhatsappMessage(template, driver.name, 250); // Using a dummy amount
        setMessage(generatedText);
      }
    } catch (error) {
      console.error("Error generating message:", error);
      setMessage("Sorry, I couldn't generate a message right now.");
    } finally {
      setGenerating(false);
    }
  }, [selectedDriverId, template, drivers]);
  
  const handleSend = () => {
      if(!message || !selectedDriverId) return;
      // This is a mock send
      alert(`Message sent to driver ID ${selectedDriverId} via WhatsApp:\n\n${message}`);
      setMessage('');
  }
  
  const driverOptions = drivers.map(d => ({ value: d.id.toString(), label: d.name }));
  const templateOptions = Object.values(MessageTemplate).map(t => ({ value: t, label: t }));

  return (
    <Card>
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">Communications</h3>
        <WhatsAppLogo className="h-7 w-7 text-green-500" />
      </div>
      <p className="text-sm text-gray-400 mt-1">Send driver notifications</p>

      {drivers.length === 0 ? (
        <div className="flex justify-center items-center h-40"><p className="text-gray-400">No drivers available.</p></div>
      ) : (
        <div className="mt-6 space-y-4">
          <div>
            <label htmlFor="driver" className="block text-sm font-medium text-gray-300 mb-1">Driver</label>
            <Select
              id="driver"
              value={selectedDriverId}
              onChange={(e) => setSelectedDriverId(e.target.value)}
              options={driverOptions}
            />
          </div>
          <div>
            <label htmlFor="template" className="block text-sm font-medium text-gray-300 mb-1">Template</label>
             <Select
              id="template"
              value={template}
              onChange={(e) => setTemplate(e.target.value as MessageTemplate)}
              options={templateOptions}
            />
          </div>
          <div>
            <Button variant="secondary" onClick={handleGenerateMessage} disabled={generating} className="w-full">
              {generating ? <Spinner size='sm'/> : 'Generate Message with AI'}
            </Button>
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-300">Message</label>
            <textarea
              id="message"
              name="message"
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="mt-1 block w-full shadow-sm sm:text-sm bg-slate-700 border-slate-600 rounded-md text-white focus:ring-purple-500 focus:border-purple-500"
              placeholder="Generated message will appear here..."
            />
          </div>
          <div>
            <Button onClick={handleSend} disabled={!message} className="w-full">
              Send via WhatsApp
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default CommunicationsCard;