'use client';

import React from 'react';
import { IntegrationCard } from '@/components/integrations/integration-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { SuspenseWrapper } from '@/components/ui/suspense-wrapper';

export default function YatraIntegrationPage() {
  return (
    <SuspenseWrapper>
      <YatraIntegrationContent />
    </SuspenseWrapper>
  );
}

function YatraIntegrationContent() {
  const [isConnected, setIsConnected] = React.useState(false);
  const [autoSync, setAutoSync] = React.useState(true);

  const handleConnect = () => {
    // TODO: Implement Yatra OAuth flow
    setIsConnected(true);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
  };

  return (
    <div className="space-y-6">
      <IntegrationCard
        title="Yatra"
        description="Connect your property with Yatra for comprehensive booking management."
        status={isConnected ? 'connected' : 'disconnected'}
        lastSync={isConnected ? '30 minutes ago' : undefined}
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
      />

      {isConnected && (
        <Card>
          <CardHeader>
            <CardTitle>Integration Settings</CardTitle>
            <CardDescription>Configure your Yatra integration settings</CardDescription>
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
                <Label>Hotel ID</Label>
                <Input
                  placeholder="Enter your Yatra hotel ID"
                  disabled={!isConnected}
                />
              </div>

              <div className="space-y-2">
                <Label>Username</Label>
                <Input
                  placeholder="Enter your Yatra username"
                  disabled={!isConnected}
                />
              </div>

              <div className="space-y-2">
                <Label>Password</Label>
                <Input
                  type="password"
                  placeholder="Enter your Yatra password"
                  disabled={!isConnected}
                />
              </div>

              <div className="space-y-2">
                <Label>API Key</Label>
                <Input
                  type="password"
                  placeholder="Enter your Yatra API key"
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