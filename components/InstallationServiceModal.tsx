'use client';

import { useState } from 'react';
import { X, Wrench, Calendar, Check } from 'lucide-react';

export default function InstallationServiceModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    date: '',
    time: '',
    service: 'basic',
  });
  const [booked, setBooked] = useState(false);

  const handleSubmit = () => {
    if (formData.name && formData.phone && formData.address && formData.date) {
      setBooked(true);
    }
  };

  const services = [
    { id: 'basic', name: 'Basic Setup', price: 299, features: ['Phone unboxing', 'SIM activation', 'Basic data transfer', 'Initial setup'] },
    { id: 'standard', name: 'Standard Setup', price: 499, features: ['All Basic services', 'App installation', 'Contact transfer', 'Photo backup', 'WhatsApp setup'] },
    { id: 'premium', name: 'Premium Setup', price: 999, features: ['All Standard services', 'Complete data transfer', 'Device optimization', 'Security setup', '1-hour training session'] },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-[#10B981] to-[#059669] rounded-xl flex items-center justify-center">
              <Wrench className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Installation Service</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {booked ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Booking Confirmed!</h3>
              <p className="text-gray-600 mb-4">Our technician will visit you on {formData.date} at {formData.time}.</p>
              <p className="text-sm text-gray-500">You will receive a confirmation SMS shortly.</p>
            </div>
          ) : step === 1 ? (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 mb-4">Select Service Package</h3>
              {services.map((service) => (
                <button
                  key={service.id}
                  onClick={() => { setFormData({ ...formData, service: service.id }); setStep(2); }}
                  className="w-full p-4 rounded-xl border-2 border-gray-200 hover:border-[#10B981] transition-all text-left"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-gray-900">{service.name}</h4>
                      <p className="text-lg font-bold text-[#10B981]">₹{service.price}</p>
                    </div>
                  </div>
                  <ul className="text-sm text-gray-500 space-y-1">
                    {service.features.map((f, i) => <li key={i}>• {f}</li>)}
                  </ul>
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time Slot</label>
                  <select
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                  >
                    <option value="">Select</option>
                    <option value="10AM-12PM">10 AM - 12 PM</option>
                    <option value="12PM-2PM">12 PM - 2 PM</option>
                    <option value="2PM-4PM">2 PM - 4 PM</option>
                    <option value="4PM-6PM">4 PM - 6 PM</option>
                  </select>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm font-medium text-gray-700">Service: {services.find(s => s.id === formData.service)?.name}</p>
                <p className="text-sm text-gray-500">₹{services.find(s => s.id === formData.service)?.price} (to be paid at service)</p>
              </div>

              <button
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-[#10B981] to-[#059669] text-white font-bold py-3 px-6 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <Calendar className="h-5 w-5" />
                Book Installation
              </button>
              
              <button onClick={() => setStep(1)} className="w-full text-gray-500 text-sm hover:underline">
                ← Back to services
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}