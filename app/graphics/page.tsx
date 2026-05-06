"use client";

import Footer from "@/components/Footer";
import { GraphicsGallery } from "@/components/GraphicsGallery";

const GraphicsPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="grid-container pb-16 pt-[120px]">
        <div className="col-span-12">
          <GraphicsGallery />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default GraphicsPage;
