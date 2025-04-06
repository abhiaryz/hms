import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface IntegrationCardProps {
  title: string;
  description: string;
  status: 'connected' | 'disconnected' | 'pending';
  lastSync?: string;
  onConnect: () => void;
  onDisconnect: () => void;
}

export function IntegrationCard({
  title,
  description,
  status,
  lastSync,
  onConnect,
  onDisconnect,
}: IntegrationCardProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{title}</CardTitle>
          <Badge
            variant={
              status === 'connected'
                ? 'default'
                : status === 'pending'
                ? 'secondary'
                : 'destructive'
            }
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {lastSync && (
          <p className="text-sm text-muted-foreground">
            Last synced: {lastSync}
          </p>
        )}
      </CardContent>
      <CardFooter>
        {status === 'connected' ? (
          <Button variant="destructive" onClick={onDisconnect}>
            Disconnect
          </Button>
        ) : (
          <Button onClick={onConnect}>
            {status === 'pending' ? 'Complete Setup' : 'Connect'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
} 