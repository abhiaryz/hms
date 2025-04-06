import { Star, Award, Crown, Medal, Check } from 'lucide-react';

const tiers = [
  {
    name: 'Bronze',
    icon: Star,
    color: 'amber',
    points: '0-1,999',
    benefits: [
      '5% off on room rates',
      'Welcome drink on arrival',
    ],
  },
  {
    name: 'Silver',
    icon: Medal,
    color: 'gray',
    points: '2,000-4,999',
    benefits: [
      '10% off on room rates',
      'Welcome drink on arrival',
      'Late checkout until 2 PM',
    ],
  },
  {
    name: 'Gold',
    icon: Award,
    color: 'yellow',
    points: '5,000-9,999',
    benefits: [
      '15% off on room rates',
      'Welcome drink on arrival',
      'Late checkout until 4 PM',
      'Complimentary breakfast',
    ],
  },
  {
    name: 'Platinum',
    icon: Crown,
    color: 'purple',
    points: '10,000+',
    benefits: [
      '20% off on room rates',
      'Welcome drink on arrival',
      'Late checkout until 6 PM',
      'Complimentary breakfast',
      'Room upgrade subject to availability',
    ],
  },
];

export default function TiersPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Loyalty Program Tiers</h1>
        <p className="mt-2 text-gray-600">
          Our loyalty program offers four tiers with increasing benefits. Earn points with every stay and enjoy exclusive perks.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {tiers.map((tier) => (
          <div key={tier.name} className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-3 mb-4">
              <tier.icon className={`text-${tier.color}-500`} size={24} />
              <div>
                <h2 className="font-semibold">{tier.name}</h2>
                <p className="text-sm text-gray-500">{tier.points} points</p>
              </div>
            </div>
            <ul className="space-y-2">
              {tier.benefits.map((benefit, index) => (
                <li key={index} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-sm">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">How to Earn Points</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-2">Room Stays</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span className="text-sm">10 points per night for standard rooms</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span className="text-sm">15 points per night for deluxe rooms</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span className="text-sm">20 points per night for suites</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-2">Additional Earnings</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span className="text-sm">5 points per $1 spent on food & beverages</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span className="text-sm">3 points per $1 spent on spa services</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span className="text-sm">2 points per $1 spent on other services</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Points Redemption</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-2">Room Redemptions</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span className="text-sm">5,000 points for one night in a standard room</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span className="text-sm">7,500 points for one night in a deluxe room</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span className="text-sm">10,000 points for one night in a suite</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-2">Other Redemptions</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span className="text-sm">2,500 points for $25 dining credit</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span className="text-sm">5,000 points for spa treatment</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span className="text-sm">1,000 points for late checkout</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 