import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import Navbar from '../../../components/Navbar'

const page = () => {
    return (
        <div className='px-4'>
            <Navbar />
            <div className='grid grid-cols-2 py-6'>
                <div className='flex flex-col gap-2'>
                    <Image alt="image showing work for fashionwear brand Kostume" src="/projects-c7/c7-1.png" height={650} width={650} />
                    <Image alt="image showing work for fashionwear brand Kostume" src="/projects-c7/c7-2.png" height={650} width={650} />
                    <Image alt="image showing work for fashionwear brand Kostume" src="/projects-c7/c7-3.png" height={650} width={650} />
                </div>
                <div className=''>
                    <h1 className='text-verde text-7xl font-bold'>C7 STUDIO</h1>
                    <p className='text-verde '>
                    Branding, design and development with Florencia Gomez for our freelance agency <br /> <span className=' font-bold text-lg'>C7 STUDIO</span> to showcase our work and offer our web services.
                    <br />
                    </p>
                    <div className='py-2'>
                        <Link  href="https://landing-plum-sigma.vercel.app/">
                            <button className='btn text-verde border border-verde px-2 py-1 hover:bg-verde hover:text-violeta transition-all duration-1000'>LIVE SITE</button>
                        </Link>
                        <Link href="https://www.behance.net/gallery/164122441/C7-STUDIO">
                            <button className='btn text-verde border border-verde px-2 py-1 hover:bg-verde hover:text-violeta transition-all duration-1000'>BEHANCE</button>
                        </Link>
                        <Link href="https://github.com/c7-studio/landing">
                            <button className='btn text-verde border border-verde px-2 py-1 hover:bg-verde hover:text-violeta transition-all duration-1000'>GITHUB</button>
                        </Link>
                        
                    </div>
                </div>
            </div>
        </div>
    )
}

export default page