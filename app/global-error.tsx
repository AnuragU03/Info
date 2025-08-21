'use client';

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorBoundaryProps {
  error: Error;
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorBoundaryProps) {
  return (
    <div className="min-h-[400px] container flex items-center justify-center p-4">
      <Alert variant="destructive" className="max-w-2xl">
        <AlertCircle className="h-5 w-5" />
        <AlertTitle>Something went wrong!</AlertTitle>
        <AlertDescription className="mt-2 mb-4">
          {error.message || 'An unexpected error occurred. This could be due to configuration issues or network problems.'}
        </AlertDescription>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={reset}
          className="mt-2"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Try again
        </Button>
      </Alert>
    </div>
  );
}
