
'use client';

import { useState, useEffect, useRef, useId } from 'react';
import { Loader2, ChevronLeft, ChevronRight, Maximize, Minimize } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

declare global {
  interface Window {
    pannellum: any;
  }
}

type PannellumViewerProps = {
  images: string[];
};

export function PannellumViewer({ images }: PannellumViewerProps) {
  const viewerContainerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { toast } = useToast();
  const pannellumContainerId = useId();

  useEffect(() => {
    if (window.pannellum) {
      setIsScriptLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = '/pannellum.js';
    script.async = true;
    script.onload = () => setIsScriptLoaded(true);
    script.onerror = () => {
        toast({
            variant: 'destructive',
            title: 'Error loading viewer',
            description: 'Could not load the 360 viewer script.'
        });
    };
    document.body.appendChild(script);

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/pannellum.css';
    document.head.appendChild(link);

    return () => {
      document.body.removeChild(script);
      document.head.removeChild(link);
    };
  }, [toast]);


  useEffect(() => {
    if (!isScriptLoaded || !images.length) {
      return;
    }

    // Destroy previous instance if it exists
    if (viewerRef.current) {
        viewerRef.current.destroy();
    }

    try {
        setIsLoading(true);
        setIsReady(false);
        viewerRef.current = window.pannellum.viewer(pannellumContainerId, {
            type: 'equirectangular',
            panorama: images[currentIndex],
            autoLoad: true,
            showControls: false,
            haov: 360,
            compass: false,
            hotSpotDebug: false,
            loadButtonLabel: 'Loading...',
            errorMsg: 'Could not load panorama.',
        });
        viewerRef.current.on('load', () => {
            setIsLoading(false);
            setIsReady(true);
        });
        viewerRef.current.on('error', (err: string) => {
            setIsLoading(false);
            toast({
                variant: 'destructive',
                title: 'Viewer Error',
                description: `Could not load 360° image. The file might be inaccessible. (${err})`,
            });
        });
    } catch(e) {
        console.error("Pannellum initialization error:", e);
        toast({
            variant: 'destructive',
            title: 'Viewer Initialization Error',
            description: 'There was a problem setting up the 360° viewer.',
        });
    }
    
    return () => {
      if (viewerRef.current && typeof viewerRef.current.destroy === 'function') {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
  }, [currentIndex, images, isScriptLoaded, pannellumContainerId, toast]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };
  
  const toggleFullscreen = () => {
      if (viewerRef.current) {
          viewerRef.current.toggleFullscreen();
          setIsFullscreen(f => !f);
      }
  }

  return (
    <div className="relative w-full h-full group bg-black">
      <div id={pannellumContainerId} ref={viewerContainerRef} className="w-full h-full" />
      
      {(isLoading || !isReady) && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
        </div>
      )}

      {isReady && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10 transition-opacity opacity-0 group-hover:opacity-100">
          <Button variant="secondary" size="icon" onClick={handlePrev} disabled={images.length <= 1}>
            <ChevronLeft />
          </Button>
          <span className="text-white text-sm font-medium bg-black/50 px-3 py-1 rounded-md">
            {currentIndex + 1} / {images.length}
          </span>
          <Button variant="secondary" size="icon" onClick={handleNext} disabled={images.length <= 1}>
            <ChevronRight />
          </Button>
        </div>
      )}

      {isReady && (
         <div className="absolute top-4 right-4 z-10 transition-opacity opacity-0 group-hover:opacity-100">
             <Button variant="secondary" size="icon" onClick={toggleFullscreen}>
                {isFullscreen ? <Minimize/> : <Maximize />}
             </Button>
         </div>
      )}
    </div>
  );
}
