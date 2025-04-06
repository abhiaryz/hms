'use client';

import React from 'react';
import { IntegrationCard } from '@/components/integrations/integration-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export default function AirbnbIntegrationPage() {
  const [isConnected, setIsConnected] = React.useState(false);
  const [autoSync, setAutoSync] = React.useState(true);

  const handleConnect = () => {
    // TODO: Implement Airbnb OAuth flow
    setIsConnected(true);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
  };

  return (
    <div className="space-y-6">
      <IntegrationCard
        title="Airbnb"
        description="Connect your property with Airbnb to manage bookings and listings."
        status={isConnected ? 'connected' : 'disconnected'}
        lastSync={isConnected ? '2 hours ago' : undefined}
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
      />

      {isConnected && (
        <Card>
          <CardHeader>
            <CardTitle>Integration Settings</CardTitle>
            <CardDescription>Configure your Airbnb integration settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto Sync</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically sync bookings and availability
                  </p>
                </div>
                <Switch
                  checked={autoSync}
                  onCheckedChange={setAutoSync}
                />
              </div>

              <div className="space-y-2">
                <Label>Property ID</Label>
                <Input
                  placeholder="Enter your Airbnb property ID"
                  disabled={!isConnected}
                />
              </div>

              <div className="space-y-2">
                <Label>API Key</Label>
                <Input
                  type="password"
                  placeholder="Enter your Airbnb API key"
                  disabled={!isConnected}
                />
              </div>

              <Button className="w-full">
                Save Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 