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
                alt="Graphic design"
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

  return (
    <div className="min-h-screen bg-background">
      {/* Editorial Layout */}
      <div className="w-full pt-nav-2 pb-32">
        <div className="max-w-[1800px] mx-auto px-6 lg:px-12">
          
          {images.map((imageName, index) => {
            const layoutPatterns = [
              // Pattern 1: Full bleed
              { gridCols: "grid-cols-12", colSpan: "col-span-12", marginTop: "mt-0", marginBottom: "mb-32 lg:mb-48" },
              // Pattern 2: Large left, margin right
              { gridCols: "grid-cols-12", colSpan: "col-span-12 lg:col-span-7", marginTop: "mt-0", marginBottom: "mb-24 lg:mb-32" },
              // Pattern 3: Margin left, large right
              { gridCols: "grid-cols-12", colSpan: "col-span-12 lg:col-span-7 lg:col-start-6", marginTop: "mt-0", marginBottom: "mb-24 lg:mb-32" },
              // Pattern 4: Medium centered
              { gridCols: "grid-cols-12", colSpan: "col-span-12 lg:col-span-8 lg:col-start-3", marginTop: "mt-0", marginBottom: "mb-32 lg:mb-40" },
              // Pattern 5: Small right aligned
              { gridCols: "grid-cols-12", colSpan: "col-span-12 lg:col-span-6 lg:col-start-7", marginTop: "mt-0", marginBottom: "mb-20 lg:mb-24" },
              // Pattern 6: Large with offset
              { gridCols: "grid-cols-12", colSpan: "col-span-12 lg:col-span-10 lg:col-start-2", marginTop: "mt-0", marginBottom: "mb-32 lg:mb-48" },
            ];

            const pattern = layoutPatterns[index % layoutPatterns.length];

            return (
              <div key={imageName} className={`grid ${pattern.gridCols} gap-6 ${pattern.marginBottom}`}>
                <div className={`${pattern.colSpan} ${pattern.marginTop}`}>
                  <div 
                    className="relative cursor-pointer"
                    onClick={() => setSelectedImage(imageName)}
                  >
                    <div className="relative mb-3">
                      <Image
                        src={`/dg/${imageName}`}
                        alt="Graphic design"
                        width={1600}
                        height={2000}
                        className="w-full h-auto"
                        loading={index < 2 ? "eager" : "lazy"}
                        quality={90}
                        priority={index === 0}
                      />
                    </div>
                    <div className="text-type-micro text-muted-foreground uppercase tracking-widest">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
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
