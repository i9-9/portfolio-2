"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import NavbarHome from '../../../components/NavbarHome';

const Page = () => {
    const images = [
        "/projects-eldesenfreno/one.png",
        "/projects-eldesenfreno/two.png",
        "/projects-eldesenfreno/three.png",
        "/projects-eldesenfreno/four.png",
        "/projects-eldesenfreno/five.png",
        "/projects-eldesenfreno/six.png",

    ];

    return (
        <div className=''>
            <NavbarHome />
            <div className='grid md:grid-cols-2 py-3 px-4'>
                <div className='order-2 md:order-1'>
                    {images.map((src, index) => (
                        <div key={index} className="cursor-pointer ">
                            <Image 
                                alt={`image ${index + 1}`} 
                                src={src} 
                                height={280} 
                                width={167} 
                                layout="responsive" 
                                className='rounded-md'
                            />
                        </div>
                    ))}
                </div>
                <div>
                    <h1 className='text-verde text-h2 font-bold'>El Desenfreno</h1>
                    <p className='text-verde my-4 text-p'>
                        <span className='text-gris_claro bg-gris_oscuro p-1 px-2 text-small uppercase rounded-sm shadow-sm'>
                            Web Development
                        </span>
                        <span className='spacer'></span>
                        <span className='text-gris_claro bg-gris_oscuro p-1 px-2 text-small uppercase rounded-sm shadow-sm'>
                            Web design
                        </span>
                        <br /><br />
                        Web architecture: 
                        <Link className=' underline' href='https://www.1tbflor.com/'>
                           <br/> Florencia Gomez
                        </Link>
                        <br /><br />
                        <Link href="https://eldesenfreno-one.vercel.app/">
                            <button className='btn border border-verde px-2 py-1 hover:bg-gris_oscuro hover:text-gris_claro transition-all duration-1000 mr-2 rounded-sm'>LIVE SITE</button>
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Page;
