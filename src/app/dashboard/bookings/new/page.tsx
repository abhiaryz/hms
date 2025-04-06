'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewBookingPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    checkIn: '',
    checkOut: '',
    roomType: 'Standard Room',
    adults: 1,
    children: 0,
    specialRequests: '',
    termsAccepted: false
  });
  
  const [availableRooms, setAvailableRooms] = useState<number[]>([]);
  const [step, setStep] = useState<'details' | 'rooms'>('details');
  
  // Sample available rooms data - in a real app, this would come from an API
  const roomTypes = {
    'Standard Room': [101, 102, 103, 201, 202],
    'Deluxe Room': [301, 302, 303],
    'Executive Suite': [401, 402],
    'Presidential Suite': [501]
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData({
        ...formData,
        [name]: checkbox.checked
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  const handleCheckAvailability = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would call an API to check room availability
    // For now, we'll just use our sample data
    const rooms = roomTypes[formData.roomType as keyof typeof roomTypes] || [];
    setAvailableRooms(rooms);
    setStep('rooms');
  };
  
  const handleRoomSelection = (roomNumber: number) => {
    // In a real app, this would create a booking with the selected room
    console.log('Booking created with room:', roomNumber);
    
    // Redirect to the booking confirmation page
    router.push('/dashboard/bookings/current');
  };
  
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Make New Booking</h1>
      
      {step === 'details' ? (
        <div className="bg-white rounded-lg shadow p-4">
          <form className="space-y-4" onSubmit={handleCheckAvailability}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Check-in Date</label>
                <input
                  type="date"
                  name="checkIn"
                  value={formData.checkIn}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-1.5 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Check-out Date</label>
                <input
                  type="date"
                  name="checkOut"
                  value={formData.checkOut}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-1.5 text-sm"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Room Type</label>
              <select 
                name="roomType"
                value={formData.roomType}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-1.5 text-sm"
              >
                <option>Standard Room</option>
                <option>Deluxe Room</option>
                <option>Executive Suite</option>
                <option>Presidential Suite</option>
              </select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Number of Adults</label>
                <input
                  type="number"
                  name="adults"
                  min="1"
                  max="4"
                  value={formData.adults}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-1.5 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Number of Children</label>
                <input
                  type="number"
                  name="children"
                  min="0"
                  max="4"
                  value={formData.children}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-1.5 text-sm"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Special Requests</label>
              <textarea
                name="specialRequests"
                rows={3}
                value={formData.specialRequests}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-1.5 text-sm"
                placeholder="Any special requests or requirements for your stay"
              />
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                name="termsAccepted"
                checked={formData.termsAccepted}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                required
              />
              <label className="ml-2 block text-sm text-gray-700">
                I agree to the terms and conditions
              </label>
            </div>
            
            <div className="flex space-x-2">
              <button
                type="submit"
                className="bg-blue-600 text-white py-1.5 px-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm"
              >
                Check Availability
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="bg-gray-200 text-gray-700 py-1.5 px-3 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-base font-semibold mb-4">Available Rooms</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {availableRooms.map((roomNumber) => (
              <div 
                key={roomNumber} 
                className="border rounded-lg p-3 hover:shadow-md cursor-pointer"
                onClick={() => handleRoomSelection(roomNumber)}
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">Room {roomNumber}</h3>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Available</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{formData.roomType}</p>
                <div className="flex justify-between text-sm">
                  <span>Check-in: {formData.checkIn}</span>
                  <span>Check-out: {formData.checkOut}</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setStep('details')}
              className="bg-gray-200 text-gray-700 py-1.5 px-3 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 text-sm"
            >
              Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 