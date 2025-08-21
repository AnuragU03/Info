'use client';

import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface ErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
      <AlertCircle className="h-10 w-10 text-destructive mb-4" />
      <h2 className="text-xl font-bold mb-2">Something went wrong!</h2>
      <p className="text-muted-foreground text-center mb-4 max-w-md">
        {error.message || 'An unexpected error occurred. Please try again later.'}
      </p>
      <Button onClick={reset} variant="outline">
        Try again
      </Button>
    </div>
  );
}
