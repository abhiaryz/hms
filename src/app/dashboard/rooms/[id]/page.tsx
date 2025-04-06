'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { BedDouble, Edit, Trash2, Calendar, Clock, DollarSign, Users, Wifi, Tv, Coffee, Wind, Key, Umbrella, Home, Bath, Monitor, Utensils, Receipt, Plus, CheckCircle, XCircle } from 'lucide-react';

interface Room {
  _id: string;
  roomNumber: string;
  type: string;
  floor: string;
  capacity: number;
  price: number;
  status: string;
  amenities: string[];
  notes: string;
  currentBooking: {
    guestName: string;
    checkIn: string;
    checkOut: string;
  } | null;
  maintenanceHistory: {
    date: string;
    description: string;
    resolved: boolean;
  }[];
  lastCleaned: string;
}

export default function RoomDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRoom();
  }, [id]);

  const fetchRoom = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/rooms?id=${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch room details');
      }
      const data = await response.json();
      setRoom(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch room details');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      const response = await fetch(`/api/rooms?id=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update room status');
      }

      // Refresh room data
      fetchRoom();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update room status');
    }
  };

  const handleDelete = () => {
    // In a real app, this would send a delete request to an API
    if (confirm('Are you sure you want to delete this room? This action cannot be undone.')) {
      console.log('Deleting room:', id);
      router.push('/dashboard/rooms');
    }
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
        <h2 className="text-2xl font-bold text-gray-700">Error Loading Room</h2>
        <p className="text-gray-500 mt-2">{error}</p>
        <button
          onClick={fetchRoom}
          className="mt-4 text-blue-600 hover:text-blue-800"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-700">Room Not Found</h2>
        <p className="text-gray-500 mt-2">The requested room could not be found.</p>
      </div>
    );
  }

  // Map amenity names to icons
  const amenityIcons: Record<string, any> = {
    'Wi-Fi': Wifi,
    'TV': Tv,
    'Mini Bar': Coffee,
    'Air Conditioning': Wind,
    'Safe': Key,
    'Balcony': Umbrella,
    'Ocean View': Home,
    'Kitchen': Coffee,
    'Jacuzzi': Bath,
    'Work Desk': Monitor,
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Room {room.roomNumber}</h1>
        <div className="flex gap-2">
          <button
            onClick={() => router.push(`/dashboard/rooms/${room._id}/edit`)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Edit Room
          </button>
          <button
            onClick={handleDelete}
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
          >
            Back to Rooms
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Room Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <BedDouble className="text-gray-500" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Type</p>
                  <p className="font-medium">{room.type}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Users className="text-gray-500" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Capacity</p>
                  <p className="font-medium">{room.capacity} persons</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="text-gray-500" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Price per Night</p>
                  <p className="font-medium">${room.price}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="text-gray-500" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Floor</p>
                  <p className="font-medium">{room.floor}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Current Status</h2>
            <div className="flex items-center gap-4">
              <div className={`px-4 py-2 rounded-full ${
                room.status === 'occupied' 
                  ? 'bg-green-100 text-green-800' 
                  : room.status === 'vacant' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-red-100 text-red-800'
              }`}>
                {room.status ? room.status.charAt(0).toUpperCase() + room.status.slice(1) : 'Unknown'}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleStatusChange('vacant')}
                  className={`px-3 py-1 rounded-md text-sm ${
                    room.status === 'vacant'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Mark Vacant
                </button>
                <button
                  onClick={() => handleStatusChange('maintenance')}
                  className={`px-3 py-1 rounded-md text-sm ${
                    room.status === 'maintenance'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Mark Maintenance
                </button>
              </div>
            </div>

            {room.currentBooking && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium mb-2">Current Booking</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Guest</p>
                    <p className="font-medium">{room.currentBooking.guestName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Check-in</p>
                    <p className="font-medium">{new Date(room.currentBooking.checkIn).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Check-out</p>
                    <p className="font-medium">{new Date(room.currentBooking.checkOut).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Maintenance History</h2>
            <div className="space-y-4">
              {(!room.maintenanceHistory || room.maintenanceHistory.length === 0) ? (
                <p className="text-gray-500">No maintenance history</p>
              ) : (
                room.maintenanceHistory.map((item, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`mt-1 ${item.resolved ? 'text-green-600' : 'text-red-600'}`}>
                      {item.resolved ? <CheckCircle size={20} /> : <XCircle size={20} />}
                    </div>
                    <div>
                      <p className="font-medium">{item.description}</p>
                      <p className="text-sm text-gray-500">{new Date(item.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Amenities</h2>
            <div className="grid grid-cols-2 gap-2">
              {(!room.amenities || room.amenities.length === 0) ? (
                <p className="text-gray-500">No amenities listed</p>
              ) : (
                room.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-2 text-gray-700">
                    <CheckCircle className="text-green-600" size={16} />
                    <span>{amenity}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Notes</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{room.notes || 'No notes available'}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Last Cleaned</h2>
            <p className="text-gray-700">
              {room.lastCleaned ? new Date(room.lastCleaned).toLocaleDateString() : 'Not available'}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Room Service</h2>
            <div className="space-y-4">
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => router.push(`/dashboard/services/room-service?room=${room.roomNumber}&type=food`)}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Utensils size={18} />
                  <span>Order Food & Beverages</span>
                </button>
                <button
                  onClick={() => router.push(`/dashboard/services/room-service?room=${room.roomNumber}&type=amenity`)}
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                >
                  <Receipt size={18} />
                  <span>Request Amenities</span>
                </button>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => router.push(`/dashboard/services/room-service?room=${room.roomNumber}`)}
                  className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                >
                  <Plus size={16} />
                  <span>View All Orders</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 