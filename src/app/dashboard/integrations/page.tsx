'use client';

import React from 'react';
import { IntegrationCard } from '@/components/integrations/integration-card';

export default function IntegrationsPage() {
  const integrations = [
    {
      title: 'Airbnb',
      description: 'Connect your property with Airbnb to manage bookings and listings.',
      status: 'disconnected' as const,
    },
    {
      title: 'MakeMyTrip',
      description: 'Sync your property with MakeMyTrip for seamless booking management.',
      status: 'disconnected' as const,
    },
    {
      title: 'Booking.com',
      description: 'Integrate with Booking.com to manage your property listings and reservations.',
      status: 'disconnected' as const,
    },
    {
      title: 'Goibibo',
      description: 'Connect with Goibibo to manage your hotel bookings and availability.',
      status: 'disconnected' as const,
    },
    {
      title: 'Agoda',
      description: 'Integrate with Agoda to sync your property listings and manage reservations.',
      status: 'disconnected' as const,
    },
    {
      title: 'Yatra',
      description: 'Connect your property with Yatra for comprehensive booking management.',
      status: 'disconnected' as const,
    },
    {
      title: 'TripAdvisor',
      description: 'Sync with TripAdvisor to manage your property listings and reviews.',
      status: 'disconnected' as const,
    },
    {
      title: 'Trivago',
      description: 'Integrate with Trivago to manage your hotel listings and bookings.',
      status: 'disconnected' as const,
    },
    {
      title: 'Expedia',
      description: 'Connect with Expedia to manage your property listings and reservations.',
      status: 'disconnected' as const,
    },
    {
      title: 'Skyscanner',
      description: 'Sync your property with Skyscanner for hotel booking management.',
      status: 'disconnected' as const,
    },
  ];

  const handleConnect = (platform: string) => {
    // TODO: Implement connection logic
    console.log(`Connecting to ${platform}...`);
  };

  const handleDisconnect = (platform: string) => {
    // TODO: Implement disconnection logic
    console.log(`Disconnecting from ${platform}...`);
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {integrations.map((integration) => (
        <IntegrationCard
          key={integration.title}
          title={integration.title}
          description={integration.description}
          status={integration.status}
          onConnect={() => handleConnect(integration.title)}
          onDisconnect={() => handleDisconnect(integration.title)}
        />
      ))}
    </div>
  );
} 