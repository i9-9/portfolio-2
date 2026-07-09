"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
    // Hide scrollbar
    document.body.style.overflow = "hidden";
    
    return () => {
      document.body.style.overflow = "";
    };
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

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const clickX = e.clientX;
    const screenWidth = window.innerWidth;
    
    if (clickX < screenWidth / 2) {
      goToPrevious();
    } else {
      goToNext();
    }
  };

  if (images.length === 0) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-background">
      {/* Slideshow area */}
      <div 
        className="w-full h-full cursor-pointer px-4 lg:px-6 py-8 lg:py-12"
        style={{ 
          marginTop: "var(--nav-height)",
          height: "calc(100dvh - var(--nav-height))"
        }}
        onClick={handleClick}
      >
        <div className="w-full h-full flex items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex items-center"
              style={{ 
                height: "calc(100dvh - var(--nav-height) - 4rem)",
                maxWidth: "100%"
              }}
            >
              <Image
                src={`/dg/${images[currentIndex]}`}
                alt="Graphic design"
                width={2000}
                height={2000}
                className="object-contain"
                style={{ 
                  height: "100%",
                  width: "auto",
                  maxWidth: "100%"
                }}
                quality={95}
                priority
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default EditorialPage;
