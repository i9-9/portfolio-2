"use client";

import Footer from "@/components/Footer";
import Image from "next/image";

const EditorialPage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="grid-container pt-nav-2 pb-16">
        <div className="col-span-12 mb-16">
          <h1 className="text-name-hero font-helveticaNowDisplayBlack tracking-tight leading-none mb-6">
            Editorial
          </h1>
          <p className="text-type-1 text-muted-foreground max-w-2xl">
            A collection of graphic design work presented in a modern editorial layout. 
            Large-format imagery showcasing visual storytelling and design craft.
          </p>
        </div>

        {/* Two Column Editorial Grid */}
        <div className="col-span-12 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Left Column */}
          <div className="space-y-8 lg:space-y-12">
            {/* Large Image 1 */}
            <div className="w-full aspect-[4/5] bg-muted relative overflow-hidden rounded-lg">
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-muted-foreground text-sm">Graphic Content 1</p>
              </div>
            </div>

            {/* Text Block */}
            <div className="space-y-4">
              <h2 className="text-type-2 font-helveticaNowDisplayBold tracking-tight">
                Visual Identity
              </h2>
              <p className="text-type-0 text-muted-foreground leading-relaxed">
                Crafting distinctive visual identities that communicate brand essence 
                through typography, color, and composition. Each project explores the 
                intersection of form and function.
              </p>
            </div>

            {/* Large Image 2 */}
            <div className="w-full aspect-[3/4] bg-muted relative overflow-hidden rounded-lg">
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-muted-foreground text-sm">Graphic Content 2</p>
              </div>
            </div>

            {/* Large Image 3 */}
            <div className="w-full aspect-[16/9] bg-muted relative overflow-hidden rounded-lg">
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-muted-foreground text-sm">Graphic Content 3</p>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8 lg:space-y-12 lg:pt-24">
            {/* Large Image 4 */}
            <div className="w-full aspect-square bg-muted relative overflow-hidden rounded-lg">
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-muted-foreground text-sm">Graphic Content 4</p>
              </div>
            </div>

            {/* Text Block */}
            <div className="space-y-4">
              <h2 className="text-type-2 font-helveticaNowDisplayBold tracking-tight">
                Design Process
              </h2>
              <p className="text-type-0 text-muted-foreground leading-relaxed">
                A systematic approach to visual communication, grounded in research, 
                iteration, and refinement. From concept to execution, every detail 
                serves the larger narrative.
              </p>
            </div>

            {/* Large Image 5 */}
            <div className="w-full aspect-[4/5] bg-muted relative overflow-hidden rounded-lg">
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-muted-foreground text-sm">Graphic Content 5</p>
              </div>
            </div>

            {/* Large Image 6 */}
            <div className="w-full aspect-[3/2] bg-muted relative overflow-hidden rounded-lg">
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-muted-foreground text-sm">Graphic Content 6</p>
              </div>
            </div>
          </div>
        </div>

        {/* Full Width Section */}
        <div className="col-span-12 mt-16 lg:mt-24">
          <div className="w-full aspect-[21/9] bg-muted relative overflow-hidden rounded-lg">
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-muted-foreground text-sm">Full Width Graphic Content</p>
            </div>
          </div>
        </div>

        {/* Quote Section */}
        <div className="col-span-12 mt-16 lg:mt-24 mb-16">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <blockquote className="text-type-2 font-helveticaNowDisplayBold tracking-tight leading-snug">
              "Design is not just what it looks like and feels like. 
              Design is how it works."
            </blockquote>
            <p className="text-type-0 text-muted-foreground">
              — Steve Jobs
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default EditorialPage;
