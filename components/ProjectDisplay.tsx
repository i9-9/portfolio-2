// app/new/components/ProjectDisplay.tsx
import Image from 'next/image';

const ProjectDisplay = () => {
  return (
    <section className="relative bg-dark-gray p-4 rounded-lg w-full">
      <div className="absolute top-4 right-4 text-accent-green p-2 text-sm font-bold">
        El Desenfreno Ediciones [Web Design & Development]
      </div>
      <div className="border border-gray-600 rounded-md overflow-hidden">
        <Image
          src="/new/1x/asset_11.png"
          alt="Project Screenshot"
          width={800}      // Adjust the width based on your image
          height={600}     // Adjust the height based on your image
          layout="responsive"  // Ensures the image is responsive within its container
          priority        // Loads the image with higher priority
        />
      </div>
    </section>
  );
};

export default ProjectDisplay;

