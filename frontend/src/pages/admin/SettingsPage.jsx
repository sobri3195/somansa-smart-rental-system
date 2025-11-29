import React from 'react';

const SettingsPage = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <div className="space-y-6">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">General Settings</h2>
          <p className="text-gray-500">Company information, currency, timezone, etc.</p>
        </div>
        
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">WhatsApp Integration</h2>
          <p className="text-gray-500">Configure WhatsApp API for notifications</p>
        </div>
        
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Invoice Settings</h2>
          <p className="text-gray-500">Invoice numbering, tax rates, payment terms</p>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
