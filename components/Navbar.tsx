"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { AiOutlineMenu } from 'react-icons/ai';

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
    <div className="">
      <AiOutlineMenu
        size={20}
        onClick={handleNav}
        className="absolute top-4 right-5 z-[1000] md:hidden text-verde border border-verde rounded"
      />
      {nav && (
        <div className="fixed inset-0 flex items-center justify-center bg-diamond z-20 text-verde font-bold">
          <div className="flex flex-col items-center text-center space-y-8">
            <Link
              className="text-4xl font-bold"
              href="/"
              onClick={handleNav}
            >
              INDEX
            </Link>
            <Link
              className="text-4xl font-bold"
              href="/info"
              onClick={handleNav}
            >
              INFO
            </Link>
            {/* <Link
              className="text-4xl font-bold"
              href="/digital-garden"
              onClick={handleNav}
            >
              DIGITAL GARDEN
            </Link> */}
            <Link
              className="text-4xl font-bold"
              href="/contact"
              onClick={handleNav}
            >
              CONTACT
            </Link>
          </div>
        </div>
      )}
      <header
        style={{ backgroundColor: `${color}` }}
        className="hidden grid-cols-2 md:grid items-center border-t-verde border-b-verde border-solid border-t-[1px] border-b-[1px] py-1 text-verde text-sm sticky top-0 z-10 transition duration-1000 mt-2"
      >
        <div>
          <Link href="/">
            <h2 className="font-black">
              I<span className="animate-pulse mx-2">/</span>N
            </h2>
          </Link>
        </div>
        <div className="flex justify-between">
          <div className="flex flex-col items-start">
            <Link href="/">
              <button className="hover-underline-animation">INDEX</button>
            </Link>
            <Link href="/info">
              <button className="hover-underline-animation">INFO</button>
            </Link>
          </div>
          <div className="flex items-center">
            {/* <Link href="/digital-garden">
              <h4 className="hover-underline-animation cursor-pointer">
                DIGITAL GARDEN
              </h4>
            </Link> */}
          </div>
          <div className="self-center justify-end bg-transparent">
            <Link href="/contact">
              <button className="p-2 border-solid border-verde border-[0.5px] hover:bg-[#0E0E0E]/30 hover:text-gris_claro hover:bg-verde transition-all duration-700">
                CONTACT
              </button>
            </Link>
          </div>
        </div>
      </header>
    </div>
  );
};

export default NavbarHome;
