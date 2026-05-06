"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Cross2Icon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

function MasonryGrid({ onImageClick }: { onImageClick: (imageName: string) => void }) {
  const [images, setImages] = useState<string[]>([]);

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
    <div className="columns-1 gap-4 space-y-4 md:columns-2 lg:columns-3 md:gap-4">
      {images.map((imageName, index) => (
        <div key={imageName} className="mb-4 break-inside-avoid">
          <div
            className="relative cursor-pointer overflow-hidden bg-accent/5"
            onClick={() => onImageClick(imageName)}
          >
            <Image
              src={`/dg/${imageName}`}
              alt={`Graphic design work - ${imageName}`}
              width={600}
              height={800}
              className="h-auto w-full"
              loading={index < 3 ? "eager" : "lazy"}
              quality={85}
              priority={index < 2}
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>
        </div>
      ))}
    </div>
  );
}

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
            className="relative flex h-full w-full max-h-[60vh] max-w-[60vw] items-center justify-center"
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
                alt={`Graphic design work - ${imageName}`}
                width={1200}
                height={1600}
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

export function GraphicsGallery({ className }: { className?: string }) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <>
      <div className={cn("w-full", className)}>
        <MasonryGrid onImageClick={setSelectedImage} />
      </div>
      <ImageModal
        isOpen={selectedImage !== null}
        imageName={selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </>
  );
}
