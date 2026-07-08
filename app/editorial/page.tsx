"use client";

import Footer from "@/components/Footer";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cross2Icon } from "@radix-ui/react-icons";

function ImageModal({
  isOpen,
  imageName,
  onClose,
}: {
  isOpen: boolean;
  imageName: string | null;
  onClose: () => void;
}) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !imageName) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm"
        onClick={onClose}
      >
        <div className="flex h-screen items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.98, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex h-full w-full max-h-[80vh] max-w-[80vw] items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute -top-12 right-0 z-10 text-white transition-colors hover:text-gray-300"
            >
              <Cross2Icon className="h-6 w-6" />
            </button>

            <div className="flex h-full max-h-full w-full max-w-full items-center justify-center">
              <Image
                src={`/dg/${imageName}`}
                alt={`Graphic design work`}
                width={1600}
                height={2000}
                className="max-h-full max-w-full object-contain"
                quality={95}
                style={{ maxWidth: "100%", maxHeight: "100%" }}
              />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

const EditorialPage = () => {
  const [images, setImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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

  const leftColumnImages = images.filter((_, index) => index % 2 === 0);
  const rightColumnImages = images.filter((_, index) => index % 2 === 1);

  return (
    <div className="min-h-screen bg-background">
      <div className="grid-container pt-nav-2 pb-24">
        {/* Two Column Editorial Grid */}
        <div className="col-span-12 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          
          {/* Left Column */}
          <div className="space-y-6 lg:space-y-8">
            {leftColumnImages.map((imageName, index) => (
              <div 
                key={imageName} 
                className="w-full cursor-pointer"
                onClick={() => setSelectedImage(imageName)}
              >
                <Image
                  src={`/dg/${imageName}`}
                  alt="Graphic design"
                  width={1200}
                  height={1600}
                  className="w-full h-auto"
                  loading={index < 2 ? "eager" : "lazy"}
                  quality={90}
                  priority={index === 0}
                />
              </div>
            ))}
          </div>

          {/* Right Column */}
          <div className="space-y-6 lg:space-y-8 lg:pt-32">
            {rightColumnImages.map((imageName, index) => (
              <div 
                key={imageName} 
                className="w-full cursor-pointer"
                onClick={() => setSelectedImage(imageName)}
              >
                <Image
                  src={`/dg/${imageName}`}
                  alt="Graphic design"
                  width={1200}
                  height={1600}
                  className="w-full h-auto"
                  loading={index < 2 ? "eager" : "lazy"}
                  quality={90}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <ImageModal
        isOpen={selectedImage !== null}
        imageName={selectedImage}
        onClose={() => setSelectedImage(null)}
      />

      <Footer />
    </div>
  );
};

export default EditorialPage;
