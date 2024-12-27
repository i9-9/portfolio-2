"use client";
import { motion } from 'framer-motion';
import Image from 'next/image';
import ScreenSeparator from "../components/ScreenSeparator";


const ProfileLayout = () => {
  return (
    <div className="min-h-screen bg-[#0B1014] text-light-gray flex flex-col relative">
      <ScreenSeparator/>
      {/* Container */}
      <div className="flex-grow flex flex-col md:flex-row border border-gray-200 bg-[#3D3D3E] rounded-xl m-4">
        {/* Left Section */}
        <div className="w-full md:w-1/4 border-r border-gray-200 p-6 flex flex-col justify-between">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-helveticaNowDisplayBold mb-6 text-mid-gray">Iván Nevares</h1>
          </div>
          {/* Footer */}
          <div className="flex flex-col mt-6 text-sm">
            <p className="text-lima ">ivannevares9@gmail.com</p>
            <div className="text-sm text-lima mb-4">
              <a href="https://instagram.com/ivan_999999" target="_blank" className="hover:underline">Instagram</a>
              <span className="mr-1">,</span>
              <a href="https://behance.net/ivan_nevares" target="_blank" className="hover:underline">Behance</a>
              <span className="mr-1">,</span>
              <a href="https://dribbble.com/i9i9" target="_blank" className="hover:underline">Dribbble</a>
              <span className="mr-1">,</span>
              <a href="https://github.com/i9-9" target="_blank" className="hover:underline">Github</a>
            </div>
            <p className="text-sm mb-4 font-helveticaNowTextRegular text-mid-gray">
              Designer with experience in websites and applications, dedicated to crafting unique, modern, and tailored experiences.
            </p>
            <p className="text-sm mb-2 font-helveticaNowTextRegular text-mid-gray">Currently studying Graphic Design at the Universidad de Buenos Aires.</p>
            <p className="text-sm mb-2 font-helveticaNowTextRegular text-mid-gray">Sound Technician, trained at TECSON, Buenos Aires.</p>
            <p className="text-sm mb-2 font-helveticaNowTextRegular text-mid-gray">Web Designer at newtro.xyz.</p>
            <p className="text-sm mb-2 font-helveticaNowTextRegular text-mid-gray">Available for freelance web projects. If you have any questions, feel free to send me an email.</p>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full md:w-2/3 p-6 flex flex-col justify-start items-start text-left bg-[#3D3D3E] rounded-xl">
          <h2 className="text-4xl md:text-8xl font-helveticaNowDisplayBlack ">
            An<span className="text-lima"> experimental </span>designer with a strong interest within visual identity, print and digital design.
          </h2>
        </div>
      </div>

      {/* SVG in the upper right corner */}
      <div className="absolute top-4 right-4 p-4 animate-slow-spin">
        <Image 
        src="/circulo.svg"
        alt="SVG Icon"
        width={42}
        height={41}
        layout="fixed"
        />
      </div>

      {/* Bottom Bar */}
      <footer className="p-4 border-t border-gray-700 text-xs text-gray-500 flex justify-between">
        <div>2024</div>
        <div>UX/UI - Web Design - Front/End Development - Graphic Design</div>
      </footer>
    </div>
  );
};

export default ProfileLayout;
