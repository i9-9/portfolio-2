"use client"

import Work from '../components/Work'
import NavbarHome from '../components/NavbarHome'
import Link from 'next/link'
import { motion } from "framer-motion"
import MyMarquee from '../components/MarqueeLanding'

export default function Home() {

  const text = "IVAN NEVARES";
  const description = "I'm a web developer and UI designer interested in generating creative and performant digital experiences";
  const work = "Explore";

  return (
    <div className='mx-auto'>
      <div className=''>
        <MyMarquee />
      </div>
      <div className='items-center justify-between flex border-verde border-b pb-2 md:border-none md:pb-0 px-4'>
        <div>
          <Link href='/'>
            <motion.h1
              className='title pt-4 md:py-1 text-verde text-lg flex items-baseline font-supplySans' // Use items-baseline for alignment
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}>
              {text.split("").map((letter, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 * index }}  // Slower typing effect
                >
                  {letter === " " ? "\u00A0" : letter}
                </motion.span>
              ))}
              <motion.span
                className="cursor"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ repeat: Infinity, repeatType: "reverse", duration: 0.5, delay: 0.3 * text.length }} // Slower blink effect
              >
                {/* Empty span to create the block cursor */}
              </motion.span>
            </motion.h1>
          </Link>
        </div>
        <div className='hidden md:flex'>
          <Link href='/info'>
            <h2 className='text-verde font-supplySans'>DIGITAL DESIGNER</h2>
          </Link>
        </div>
      </div>
      <NavbarHome />
      <Work />
    </div>
  )
}
