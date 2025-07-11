'use client';

import { useState } from 'react';
import { Pannellum } from 'pannellum-react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type PannellumViewerProps = {
  images: string[];
};

export function PannellumViewer({ images }: PannellumViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

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
      <Pannellum
        width="100%"
        height="100%"
        image={images[currentIndex]}
        pitch={10}
        yaw={180}
        hfov={110}
        autoLoad
        showZoomCtrl={false}
        showFullscreenCtrl={false}
        mouseZoom={false}
        orientationOnByDefault={false}
      >
      </Pannellum>
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
