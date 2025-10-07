"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ArrowLeftIcon, Cross2Icon } from "@radix-ui/react-icons";

const MasonryGrid = ({ onImageClick }: { onImageClick: (imageName: string) => void }) => {
  const [images, setImages] = useState<string[]>([]);

  // Fetch images dynamically (already shuffled from API)
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('/api/graphics-images');
        const data = await response.json();
        
        if (data.images && data.images.length > 0) {
          setImages(data.images);
        }
      } catch (error) {
        console.error('Error fetching graphics images:', error);
      }
    };

    fetchImages();
  }, []);

  return (
    <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
      {images.map((imageName, index) => (
        <div
          key={imageName}
          className="break-inside-avoid mb-4"
        >
          <div 
            className="relative overflow-hidden bg-accent/5 cursor-pointer"
            onClick={() => onImageClick(imageName)}
          >
            <Image
              src={`/dg/${imageName}`}
              alt={`Graphic design work - ${imageName}`}
              width={600}
              height={800}
              className="w-full h-auto"
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
};

const ImageModal = ({ 
  isOpen, 
  imageName, 
  onClose 
}: { 
  isOpen: boolean; 
  imageName: string | null; 
  onClose: () => void; 
}) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
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
        <div className="flex items-center justify-center h-screen p-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="relative w-full h-full max-w-[60vw] max-h-[60vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors z-10"
            >
              <Cross2Icon className="w-6 h-6" />
            </button>
            
            <div className="w-full h-full max-w-full max-h-full flex items-center justify-center">
              <Image
                src={`/dg/${imageName}`}
                alt={`Graphic design work - ${imageName}`}
                width={1200}
                height={1600}
                className="max-w-full max-h-full object-contain"
                quality={95}
                style={{ maxWidth: '100%', maxHeight: '100%' }}
              />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

const GraphicsPage = () => {
  const { t } = useLanguage();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background">
      {/* Masonry Grid */}
      <div className="grid-container pt-[120px] pb-16">
        <div className="col-span-12">
          <MasonryGrid onImageClick={setSelectedImage} />
        </div>
      </div>

      <Footer />
      
      {/* Image Modal */}
      <ImageModal 
        isOpen={selectedImage !== null}
        imageName={selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </div>
  );
};

export default GraphicsPage;
