
'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Maximize, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

declare global {
  interface Window {
    pannellum: {
      viewer: (id: string, config: any) => any;
    };
  }
}

type PannellumViewerProps = {
  images: string[];
};

export function PannellumViewer({ images }: PannellumViewerProps) {
  const { toast } = useToast();
  const viewerContainerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load the pannellum script and CSS
  useEffect(() => {
    const loadPannellum = () => {
      // Check if script is already present
      if (document.getElementById('pannellum-script')) {
        setIsReady(true);
        return;
      }

      const script = document.createElement('script');
      script.id = 'pannellum-script';
      script.src = '/pannellum.js';
      script.async = true;
      script.onload = () => setIsReady(true);
      script.onerror = () => {
        toast({
          variant: 'destructive',
          title: 'Failed to load viewer',
          description: 'The 360° viewer script could not be loaded.',
        });
      };
      document.body.appendChild(script);

      const link = document.createElement('link');
      link.id = 'pannellum-css';
      link.rel = 'stylesheet';
      link.href = '/pannellum.css';
      document.head.appendChild(link);
    };

    if (typeof window.pannellum === 'undefined') {
      loadPannellum();
    } else {
      setIsReady(true);
    }
  }, [toast]);

  // Initialize and update the viewer
  useEffect(() => {
    if (isReady && viewerContainerRef.current && images && images.length > 0 && images[currentIndex]) {
      // If a viewer instance exists, destroy it first to avoid conflicts
      if (viewerRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
      
      setIsLoading(true);

      try {
        viewerRef.current = window.pannellum.viewer(viewerContainerRef.current.id, {
          type: 'equirectangular',
          panorama: images[currentIndex],
          autoLoad: true,
          showControls: false,
          mouseZoom: false,
          keyboardZoom: false,
          draggable: true,
          friction: 0.05,
          loadButtonLabel: 'Click to Load Panorama',
        });

        viewerRef.current.on('load', () => {
            setIsLoading(false);
        });

        viewerRef.current.on('error', (err: string) => {
            console.error('Pannellum viewer error:', err);
            toast({ variant: 'destructive', title: 'Viewer Error', description: `Could not load the image: ${err}` });
            setIsLoading(false);
        });

      } catch (e) {
        console.error("Pannellum viewer initialization error:", e);
        toast({ variant: 'destructive', title: 'Viewer Error', description: 'Could not initialize the 360° viewer.'});
        setIsLoading(false);
      }
    }
    
    // Cleanup function to destroy viewer on component unmount or when dependencies change before re-render
    return () => {
        if (viewerRef.current) {
            try {
                viewerRef.current.destroy();
            } catch (e) {
                console.error('Error destroying pannellum viewer:', e);
            }
            viewerRef.current = null;
        }
    };
  }, [isReady, currentIndex, images, toast]);


  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % images.length;
    setCurrentIndex(nextIndex);
  };

  const handlePrev = () => {
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    setCurrentIndex(prevIndex);
  };
  
  const toggleFullScreen = () => {
    if (viewerRef.current) {
        viewerRef.current.toggleFullscreen();
    }
  }

  if (!images || images.length === 0) {
    return (
      <div className="flex items-center justify-center h-full bg-muted">
        <p className="text-muted-foreground">No 360° image available.</p>
      </div>
    );
  }

  const uniqueId = `pannellum-container-${useRef(Math.random()).current}`;

  return (
    <div className="relative w-full h-full group bg-black">
      <div id={uniqueId} ref={viewerContainerRef} className="w-full h-full" />
      
      {(isLoading || !isReady) && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
        </div>
      )}

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {images.length > 1 && (
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrev}
            className="bg-black/50 hover:bg-black/75 border-white/50 text-white rounded-full"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        )}
         <Button
            variant="outline"
            size="icon"
            onClick={toggleFullScreen}
            className="bg-black/50 hover:bg-black/75 border-white/50 text-white rounded-full"
          >
            <Maximize className="h-5 w-5" />
          </Button>
        {images.length > 1 && (
          <Button
            variant="outline"
            size="icon"
            onClick={handleNext}
            className="bg-black/50 hover:bg-black/75 border-white/50 text-white rounded-full"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        )}
      </div>
    </div>
  );
}
