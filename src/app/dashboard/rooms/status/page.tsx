'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BedDouble, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface Room {
  _id: string;
  roomNumber: string;
  type: string;
  floor: string;
  status: string;
  currentBooking: {
    guestName: string;
    checkIn: string;
    checkOut: string;
  } | null;
}

export default function RoomStatusPage() {
  const router = useRouter();
  const [selectedFloor, setSelectedFloor] = useState('all');
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/rooms');
      if (!response.ok) {
        throw new Error('Failed to fetch rooms');
      }
      const data = await response.json();
      setRooms(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch rooms');
    } finally {
      setLoading(false);
    }
  };

  // Filter rooms by floor
  const filteredRooms = selectedFloor === 'all' 
    ? rooms 
    : rooms.filter(room => room.floor === selectedFloor);

  // Count rooms by status
  const statusCounts = {
    occupied: rooms.filter(room => room.status === 'occupied').length,
    vacant: rooms.filter(room => room.status === 'vacant').length,
    maintenance: rooms.filter(room => room.status === 'maintenance').length,
  };

  // Get unique floors
  const uniqueFloors = Array.from(new Set(rooms.map(room => room.floor)));
  const floors = ['all', ...uniqueFloors];

  const handleRoomClick = (roomId: string) => {
    router.push(`/dashboard/rooms/${roomId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-700">Error Loading Rooms</h2>
        <p className="text-gray-500 mt-2">{error}</p>
        <button
          onClick={fetchRooms}
          className="mt-4 text-blue-600 hover:text-blue-800"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Room Status</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-green-100 p-2 rounded-full">
                <CheckCircle className="text-green-600" size={20} />
              </div>
              <div>
                <h2 className="text-base font-semibold">Occupied</h2>
                <p className="text-2xl font-bold text-green-600">{statusCounts.occupied}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-blue-100 p-2 rounded-full">
                <BedDouble className="text-blue-600" size={20} />
              </div>
              <div>
                <h2 className="text-base font-semibold">Vacant</h2>
                <p className="text-2xl font-bold text-blue-600">{statusCounts.vacant}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-red-100 p-2 rounded-full">
                <AlertTriangle className="text-red-600" size={20} />
              </div>
              <div>
                <h2 className="text-base font-semibold">Maintenance</h2>
                <p className="text-2xl font-bold text-red-600">{statusCounts.maintenance}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center gap-2 mb-4">
          <select
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedFloor}
            onChange={(e) => setSelectedFloor(e.target.value)}
          >
            {floors.map(floor => (
              <option key={floor} value={floor}>
                {floor === 'all' ? 'All Floors' : floor}
              </option>
            ))}
          </select>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {filteredRooms.map(room => (
            <div 
              key={room._id} 
              onClick={() => handleRoomClick(room._id)}
              className={`border rounded-lg p-3 flex flex-col items-center cursor-pointer transition-all hover:shadow-md ${
                room.status === 'occupied' 
                  ? 'border-green-200 bg-green-50 hover:bg-green-100' 
                  : room.status === 'vacant' 
                    ? 'border-blue-200 bg-blue-50 hover:bg-blue-100' 
                    : 'border-red-200 bg-red-50 hover:bg-red-100'
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 ${
                room.status === 'occupied' 
                  ? 'bg-green-100' 
                  : room.status === 'vacant' 
                    ? 'bg-blue-100' 
                    : 'bg-red-100'
              }`}>
                <BedDouble 
                  className={
                    room.status === 'occupied' 
                      ? 'text-green-600' 
                      : room.status === 'vacant' 
                        ? 'text-blue-600' 
                        : 'text-red-600'
                  } 
                  size={20} 
                />
              </div>
              <h3 className="font-semibold text-base">{room.roomNumber}</h3>
              <p className="text-xs text-gray-600">{room.type}</p>
              <p className="text-xs text-gray-500 mt-1">{room.floor}</p>
              {room.currentBooking?.guestName && (
                <p className="text-xs text-gray-700 mt-1 truncate max-w-full">{room.currentBooking.guestName}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 