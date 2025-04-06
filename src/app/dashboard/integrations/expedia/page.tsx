'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function ExpediaIntegrationPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement Expedia OAuth connection
      console.log('Connecting to Expedia...');
    } catch (error) {
      console.error('Error connecting to Expedia:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Expedia Integration</CardTitle>
          <CardDescription>
            Connect your Expedia account to sync your bookings and manage your properties.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={handleConnect}
            disabled={isLoading}
          >
            {isLoading ? 'Connecting...' : 'Connect Expedia'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
} 