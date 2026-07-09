"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";

const EditorialPage = () => {
  const [images, setImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch("/api/graphics-images");
        const data = await response.json();

        if (data.images && data.images.length > 0) {
          setImages(data.images);
        }
      } catch (error) {
        console.error("Error fetching graphics images:", error);
      }
    };

    fetchImages();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        goToPrevious();
      } else if (e.key === "ArrowRight") {
        goToNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, images.length]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (images.length === 0) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-background">
      {/* Slideshow area below nav */}
      <div 
        className="pt-nav w-full flex items-center justify-center bg-background"
        style={{ height: "100dvh" }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full h-full flex items-center justify-center"
          >
            <Image
              src={`/dg/${images[currentIndex]}`}
              alt="Graphic design"
              width={2000}
              height={2000}
              className="object-contain"
              style={{ 
                maxHeight: "calc(100dvh - var(--nav-height))",
                maxWidth: "100%",
                height: "auto",
                width: "auto"
              }}
              quality={95}
              priority
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation arrows */}
        <button
          onClick={goToPrevious}
          className="fixed left-4 lg:left-8 top-1/2 -translate-y-1/2 z-10 p-3 bg-background/80 backdrop-blur-sm border border-border rounded-full transition-opacity hover:opacity-70"
          aria-label="Previous image"
        >
          <ChevronLeftIcon className="w-6 h-6" />
        </button>

        <button
          onClick={goToNext}
          className="fixed right-4 lg:right-8 top-1/2 -translate-y-1/2 z-10 p-3 bg-background/80 backdrop-blur-sm border border-border rounded-full transition-opacity hover:opacity-70"
          aria-label="Next image"
        >
          <ChevronRightIcon className="w-6 h-6" />
        </button>

        {/* Counter */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-10 px-4 py-2 bg-background/80 backdrop-blur-sm border border-border rounded-full">
          <span className="text-type-micro uppercase tracking-widest text-muted-foreground">
            {String(currentIndex + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default EditorialPage;
