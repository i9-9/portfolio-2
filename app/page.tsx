"use client"

import Work from '../components/Work'
import NavbarHome from '../components/NavbarHome'
import Link from 'next/link'
import { motion } from "framer-motion"

export default function Home() {

  const text = "IVAN NEVARES"
  const description = "I'm a web developer and UI designer interested in generating creative and performant digital experiences"
  const work = "Explore"

  return (
    <div className='mx-auto px-4 '>
      <div className='items-center justify-between flex border-verde border-b pb-2 md:border-none md:pb-0'>
        <div>
          <Link href='/'>
            <motion.h1
              className='title pt-4 md:py-1 text-verde uppercase '
              initial={{ opacity: 0, }}
              animate={{ opacity: 1 }}
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
        <div className='hidden md:flex'>
          <Link href='/info'>
            <h2 className='text-verde'>DIGITAL DESIGNER</h2>
          </Link>
        </div>
      </div>
      <NavbarHome />
      <Work />
    </div>
  )
}
