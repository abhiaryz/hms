export default function CurrentReservationPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Current Reservation</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-2">Room Details</h2>
            <div className="space-y-2">
              <p className="text-gray-600">Room Number: <span className="font-medium">301</span></p>
              <p className="text-gray-600">Room Type: <span className="font-medium">Deluxe Suite</span></p>
              <p className="text-gray-600">Check-in: <span className="font-medium">April 5, 2024</span></p>
              <p className="text-gray-600">Check-out: <span className="font-medium">April 10, 2024</span></p>
            </div>
          </div>
          <div className="border rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-2">Guest Information</h2>
            <div className="space-y-2">
              <p className="text-gray-600">Name: <span className="font-medium">John Doe</span></p>
              <p className="text-gray-600">Email: <span className="font-medium">john.doe@example.com</span></p>
              <p className="text-gray-600">Phone: <span className="font-medium">+1 (555) 123-4567</span></p>
              <p className="text-gray-600">Guests: <span className="font-medium">2 Adults, 1 Child</span></p>
            </div>
          </div>
        </div>
        <div className="mt-6 flex space-x-4">
          <button className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
            Modify Reservation
          </button>
          <button className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700">
            Cancel Reservation
          </button>
        </div>
      </div>
    </div>
  );
} 