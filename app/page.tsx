"use client"

import Work from '../components/Work'
import NavbarHome from '../components/NavbarHome'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from "framer-motion"

export default function Home() {

  const text = "IVAN NEVARES"
  const description = "I'm a web developer and UI designer interested in generating creative and performant digital experiences"
  const work = "Explore"

  return (
    <div className='mx-auto px-4 '>
      <div>
        <Link href='/'>
          <motion.h1
            className='title text-xl pt-1 text-verde uppercase pl-1 md:pl-0 md:border-b-verde md:border-solid md:border-b-[1px]'
            initial={{ opacity: 0,}}
            animate={{ opacity: 1}}
            transition={{ delay: 0.2 }}>
            {text.split("").map((letter, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                {letter}
              </motion.span>
            ))}
          </motion.h1>
        </Link>
      </div>
      <NavbarHome />
      {/* <div className='grid md:grid-cols-2 mb-48 md:mb-0 md:mt-[25rem] '>
        <div>
          <motion.p
            className='text-left text-verde text-xl pt-28 md:py-0'
            initial={{ opacity: 0,}}
            animate={{ opacity: 1}}
            transition={{ delay: 0.6 }}
          >
            {description.split("").map((letter, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0,}}
                animate={{ opacity: 1,}}
                transition={{ delay: 0.05 * index }}
              >
                {letter}
              </motion.span>
            ))}
          </motion.p>
          <div className='flex justify-start '>
            <Link href="#work" scroll={false}>
              <motion.p
                initial={{ opacity: 0,}}
                animate={{ opacity: 1,}}
                transition={{ delay: 0.2 }}
                onClick={(e) => {
                  e.preventDefault();
                  const target = document.querySelector("#work");
                  target?.scrollIntoView({ behavior: "smooth" });
                }} className='text-verde text-3xl mt-6 flex items-center font-light italic hover-underline-animation cursor-pointer doublearrow'>
                {work.split("").map((letter, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * index }}
                  >
                    {letter}{" "}
                  </motion.span>
                ))}
                <img alt='arrow that points downwards' src='/double-arrow.svg' className='ml-2 animate-bounce' style={{ color: '#ADE252' }} /></motion.p>
            </Link>
          </div>
        </div>
        <div className='hidden md:flex justify-between ml-4 md:ml-0 my-24 sm:my-0 items-center md:items-start'>
        </div>
      </div> */}
      <Work />
    </div>
  )
}
