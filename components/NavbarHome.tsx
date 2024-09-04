"use client"

import React, { useState, useEffect } from "react";
import Image from "next/image";
import NameAnimation from "./NameAnimation";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";

const NavbarHome = () => {
  const [navOpen, setNavOpen] = useState(false);

  const handleNavToggle = () => {
    setNavOpen(prevState => {
      const newState = !prevState;
      document.body.classList.toggle("no-scroll", newState);
      return newState;
    });
  };

  useEffect(() => {
    console.log("NavbarHome rendered, navOpen:", navOpen);
  }, [navOpen]);

  return (
    <div>
      {/* Mobile Navbar */}
      <div className="md:hidden flex items-center justify-between border-b border-solid border-gray-700 px-4 py-2 bg-transparent">
        <div className="flex items-center">
          <Image src="/logo.png" alt="Logo" width={30} height={30} className="mr-2" />
          <NameAnimation text="IVAN NEVARES" />
        </div>
        <div className="relative z-[1000]">
          {!navOpen && (
            <AiOutlineMenu
              size={20}
              onClick={handleNavToggle}
              style={{ color: "#191919", cursor: "pointer" }}
              role="button"
              aria-label="Open menu"
            />
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 bg-gris_claro z-20 flex flex-col transition-transform duration-300 ${navOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="w-full px-4 py-2 flex justify-between items-center border-b border-gray-700">
          <div className="flex items-center">
            <Image src="/logo.png" alt="Logo" width={30} height={30} className="mr-2" />
            <NameAnimation text="IVAN NEVARES" />
          </div>
          <AiOutlineClose
            size={20}
            onClick={handleNavToggle}
            style={{ color: "#191919", cursor: "pointer" }}
            role="button"
            aria-label="Close menu"
          />
        </div>
        <div className="flex flex-col items-center justify-center flex-grow space-y-8 mt-8">
          <a className="text-4xl font-bold navbar-item" href="/" onClick={handleNavToggle}>
            INDEX
          </a>
          <a className="text-4xl font-bold navbar-item" href="/info" onClick={handleNavToggle}>
            INFO
          </a>
        </div>
      </div>

      {/* Desktop Navbar */}
      <header className="hidden md:flex items-center justify-between py-2 px-4 bg-transparent border-b border-solid border-gray-700">
        <div className="flex items-center">
          <Image src="/logo.png" alt="Logo" width={30} height={30} className="mr-2" />
          <NameAnimation text="IVAN NEVARES" />
        </div>
        <nav className="flex items-center space-x-8">
          <a className="text-h6 hover-underline-animation navbar-item" href="/">
            INDEX
          </a>
          <a className="text-h6 hover-underline-animation navbar-item" href="/info">
            INFO
          </a>
        </nav>
      </header>
    </div>
  );
};

export default NavbarHome;
