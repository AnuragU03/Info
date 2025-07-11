'use client';

import { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
  const viewerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewerId, setViewerId] = useState('');

  useEffect(() => {
    // Generate a unique ID only on the client side
    setViewerId(`pannellum-viewer-${Math.random().toString(36).substr(2, 9)}`);
  }, []);

  useEffect(() => {
    if (viewerId && viewerRef.current && images.length > 0 && typeof window.pannellum !== 'undefined') {
      // Ensure the pannellum stylesheet is loaded
      const linkId = 'pannellum-css';
      if (!document.getElementById(linkId)) {
        const link = document.createElement('link');
        link.id = linkId;
        link.rel = 'stylesheet';
        link.href = '/pannellum.css';
        document.head.appendChild(link);
      }
      
      const viewer = window.pannellum.viewer(viewerRef.current.id, {
        type: 'equirectangular',
        panorama: images[currentIndex],
        autoLoad: true,
        showZoomCtrl: false,
        showFullscreenCtrl: false,
        mouseZoom: false,
      });

      return () => {
        viewer.destroy();
      };
    }
  }, [currentIndex, images, viewerId]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  if (!images || images.length === 0) {
    return <div className="flex items-center justify-center h-full bg-muted">No images available for a 360° view.</div>;
  }
  
  return (
    <div className="relative w-full h-full group">
       <div id={viewerId} ref={viewerRef} style={{ width: '100%', height: '100%' }}></div>
      {images.length > 1 && (
        <>
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </>
      )}
    </div>
  );
}
