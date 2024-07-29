"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import OpenMenuIcon from "/public/mobile_menu/OPEN_MENU.png"; // Path for open menu PNG
import CloseMenuIcon from "/public/mobile_menu/CLOSE_MENU.png"; // Path for close menu PNG
import NameAnimation from "./NameAnimation";

const NavbarHome = () => {
  const [color, setColor] = useState("transparent");
  const [nav, setNav] = useState(false);

  const handleNav = () => {
    setNav(!nav);
    if (!nav) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
  };

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    const targetId = e.currentTarget.getAttribute("href") as string;
    const target = document.querySelector(targetId);
    target?.scrollIntoView({ behavior: "smooth" });
  };

  const handleScrollMobile = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    const targetId = e.currentTarget.getAttribute("href") as string;
    const target = document.querySelector(targetId);
    target?.scrollIntoView({ behavior: "smooth" });
    handleNav();
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
    <div className="px-4 pt-2">
      {/* Mobile menu toggle */}
      <div className="absolute top-9 right-5 z-[1000] md:hidden cursor-pointer">
        <Image
          src={nav ? CloseMenuIcon : OpenMenuIcon}
          onClick={handleNav}
          className="p-2"
          alt={nav ? "Close menu" : "Open menu"}
          width={40} // Adjust the width if needed
          height={40} // Adjust the height if needed
        />
      </div>

      {/* Mobile menu content */}
      {nav && (
        <div className="fixed inset-0 flex items-center justify-center bg-gris_claro z-20 text-verde font-bold">
          <div className="flex flex-col items-center text-center space-y-8">
            <Link
              className="text-4xl font-bold"
              href="/"
              onClick={handleScrollMobile}
            >
              INDEX
            </Link>
            <Link
              className="text-4xl font-bold"
              href="/info"
              onClick={handleScrollMobile}
            >
              INFO
            </Link>
            {/* <Link
              className="text-4xl font-bold"
              href="/digital-garden"
              onClick={handleScrollMobile}
            >
              DIGITAL GARDEN
            </Link> */}
            <Link
              className="text-4xl font-bold"
              href="/contact"
              onClick={handleScrollMobile}
            >
              CONTACT
            </Link>
          </div>
        </div>
      )}

      {/* Desktop menu */}
      <header
        style={{ backgroundColor: `${color}` }}
        className="hidden md:flex items-center justify-between border-t-verde border-b-verde border-solid border-t-[1px] border-b-[1px] py-1 text-verde text-sm sticky top-0 z-10 transition duration-1000"
      >
        <div className="flex-1 flex items-center justify-start">
          <NameAnimation text="IVAN NEVARES" />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-left">
            <Link href="/">
              <button className="hover-underline-animation">INDEX</button>
            </Link>
            <Link href="/info">
              <button className="hover-underline-animation">INFO</button>
            </Link>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-end">
          <Link href="/contact">
            <button className="p-2 border-solid border-verde border-[0.5px] hover:bg-[#0E0E0E]/30 hover:text-gris_oscuro hover:bg-gris_claro transition-all duration-700">
              CONTACT
            </button>
          </Link>
        </div>
      </header>
    </div>
  );
};

export default NavbarHome;
