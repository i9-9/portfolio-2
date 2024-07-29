"use client";

import React, { useState, useEffect } from "react";
import NameAnimation from "./NameAnimation";

const OpenMenuIcon = ({ onClick }: { onClick: () => void }) => (
  <svg width="28" height="10" viewBox="0 0 28 10" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={onClick} style={{ cursor: 'pointer' }}>
    <path d="M0 1H27.9255" stroke="#191919"/>
    <path d="M0 8.74609H27.9255" stroke="#191919"/>
  </svg>
);

const CloseMenuIcon = ({ onClick }: { onClick: () => void }) => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={onClick} style={{ cursor: 'pointer' }}>
    <path d="M1 1L20.799 20.799" stroke="#191919"/>
    <path d="M1 21L20.799 1.20101" stroke="#191919"/>
  </svg>
);

const NavbarHome = () => {
  const [color, setColor] = useState("transparent");
  const [nav, setNav] = useState(false);

  const handleNav = () => {
    setNav(!nav);
    if (!nav) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
  };

  const handleScrollMobile = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    e.preventDefault();
    const targetId = e.currentTarget.getAttribute("href") as string;
    const target = document.querySelector(targetId);
    target?.scrollIntoView({ behavior: "smooth" });
    handleNav(); // Close the menu after clicking
  };

  useEffect(() => {
    const changeColor = () => {
      if (window.scrollY >= 40) {
        setColor("#B5B5B5");
      } else {
        setColor("transparent");
      }
    };
    window.addEventListener("scroll", changeColor);
    return () => {
      window.removeEventListener("scroll", changeColor);
    };
  }, []);

  return (
    <div className="pt-2">
      {/* Mobile Name Animation and Menu Toggle */}
      <div
        className="md:hidden flex items-center justify-between border-t-verde border-b-verde border-solid border-t-[1px] border-b-[1px] py-2 px-4"
        style={{ backgroundColor: `${color}` }}
      >
        <NameAnimation text="IVAN NEVARES" />
        <div className="relative z-[1000]">
          {nav ? (
            <CloseMenuIcon onClick={handleNav} />
          ) : (
            <OpenMenuIcon onClick={handleNav} />
          )}
        </div>
      </div>

      {/* Mobile menu content */}
      {nav && (
        <div className="fixed inset-0 flex flex-col bg-gris_claro text-verde font-bold z-20 pt-8">
          {/* Navbar top section with border */}
          <div className="w-full px-4 flex items-center justify-between border-t-verde border-b-verde border-solid border-t-[1px] border-b-[1px]">
            <NameAnimation text="IVAN NEVARES" />
            <div className="relative z-[1000] cursor-pointer">
              <CloseMenuIcon onClick={handleNav} />
            </div>
          </div>
          {/* Centered menu items */}
          <div className="flex flex-col items-center justify-center flex-grow space-y-8">
            <a
              className="text-4xl font-bold cursor-pointer"
              href="/"
              onClick={handleScrollMobile}
            >
              INDEX
            </a>
            <a
              className="text-4xl font-bold cursor-pointer"
              href="/info"
              onClick={handleScrollMobile}
            >
              INFO
            </a>
          </div>
        </div>
      )}

      {/* Desktop menu */}
      <header
        style={{ backgroundColor: `${color}` }}
        className="hidden md:flex items-center justify-between border-t-verde border-b-verde border-solid border-t-[1px] border-b-[1px] py-1 text-verde text-sm sticky top-0 z-10 transition duration-1000"
      >
        <div className="w-full px-4 flex justify-between items-center">
          <div className="flex-1 flex items-center justify-start">
            <NameAnimation text="IVAN NEVARES" />
          </div>
          <div className="flex-1 flex items-center justify-left">
            <div className="grid grid-cols-1">
              <a href="/" className="hover-underline-animation">INDEX</a>
              <a href="/info" className="hover-underline-animation">INFO</a>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default NavbarHome;
