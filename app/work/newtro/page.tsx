"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import NavbarHome from '../../../components/NavbarHome';

const Page = () => {
    const images = [
        "/newtro/1.png",
        "/newtro/2.png",
        "/newtro/three.png",
        "/newtro/four.png",
        "/newtro/one.png",
        "/newtro/two.png",
        
    ];

    return (
        <div className=''>
            <NavbarHome />
            <div className='grid md:grid-cols-2 py-3 px-4'>
                <div className='order-2 md:order-1'>
                    {images.map((src, index) => (
                        <div key={index}>
                            <Image 
                                alt={`image ${index + 1}`} 
                                src={src} 
                                height={2800} 
                                width={1678} 
                                className='rounded-md mb-1'
                            />
                        </div>
                    ))}
                </div>
                <div>
                    <h1 className='text-verde text-7xl font-bold'>Newtro</h1>
                    <p className='text-verde my-4'>
                        <span className='text-gris_claro bg-gris_oscuro p-1 px-2 text-xs uppercase rounded-sm shadow-sm'>
                            W3B
                        </span>
                        <span className='spacer'></span>
                        <span className='text-gris_claro bg-gris_oscuro p-1 px-2 text-xs uppercase rounded-sm shadow-sm'>
                            UX/UI
                        </span>
                        <br /><br />
                        
                        <span className='text-md'>Front-End Development: </span>
                        <Link className='underline' href='https://www.1tbflor.com/'>
                           <br/> Florencia Gomez
                        </Link>
                        <br/><br/>Back-End Development
                        <Link className='underline' href=''>
                           <br/> Charlie Finos
                        </Link>
                        <Link className='underline' href='https://github.com/SweetmanTech'>
                           <br/> Sweetman
                        </Link>
                        <br/>
                        <span>
                        <br/>Newtro Arts aims to promote, educate, and introduce Latin American artists and cultural agents to blockchain technology.
                        </span>
                        <br /><br />
                        <Link href="https://www.newtro.xyz/">
                            <button className='btn border border-verde px-2 py-1 hover:bg-gris_oscuro hover:text-gris_claro transition-all duration-1000 mr-2 rounded-sm '>LIVE SITE</button>
                        </Link>

                    </p>
                </div>
            </div>
        </div>
    );
}

export default Page;
