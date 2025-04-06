export default function BookingHistoryPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Booking History</h1>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Booking ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Room Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Check-in
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Check-out
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">BK-2024-001</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Deluxe Suite</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">March 15, 2024</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">March 20, 2024</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  Completed
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <button className="text-blue-600 hover:text-blue-900">View Details</button>
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">BK-2024-002</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Standard Room</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">February 10, 2024</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">February 15, 2024</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  Completed
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <button className="text-blue-600 hover:text-blue-900">View Details</button>
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">BK-2024-003</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Executive Suite</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">January 5, 2024</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">January 10, 2024</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  Completed
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <button className="text-blue-600 hover:text-blue-900">View Details</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
} 