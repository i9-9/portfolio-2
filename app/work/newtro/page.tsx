"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '../../../components/Navbar';

const Page = () => {
    const [selectedImageIndex, setSelectedImageIndex] = useState(null);

    const images = [
        "/newtro/0_START.png",
        "/newtro/1_MACBOOK.png",
        "/newtro/2_FULL.png",
    ];

    const openModal = (index) => setSelectedImageIndex(index);
    const closeModal = () => setSelectedImageIndex(null);

    return (
        <div className='px-4'>
            <Navbar />
            <div className='grid md:grid-cols-2 py-3'>
                <div className='order-2 md:order-1'>
                    {images.map((src, index) => (
                        <div key={index} onClick={() => openModal(index)}>
                            <Image alt={`image ${index + 1}`} src={src} height={2800} width={1678} />
                        </div>
                    ))}
                </div>
                <div>
                    <h1 className='text-verde text-7xl font-bold'>Newtro</h1>
                    <p className='text-verde my-4'>
                        <span className='text-gris_claro bg-gris_oscuro p-1 px-2 text-xs uppercase'>
                            W3B
                        </span>
                        <span className='spacer'></span>
                        <span className='text-gris_claro bg-gris_oscuro p-1 px-2 text-xs uppercase'>
                            Web design
                        </span>
                        <br /><br />
                        
                        <span className='text-md'>Front-End Development: </span>
                        <Link className='underline' href='https://www.1tbflor.com/'>
                           <br/> Florencia Gomez
                        </Link>
                        <br/><br/>Back-End Development
                        <Link className='underline' href='https://www.1tbflor.com/'>
                           <br/> Charlie Finos
                        </Link>
                        <br/>
                        <span>

                        <br/>Newtro Arts aims to promote, educate and introduce latin american artists and cultural agents to blockchain technology.

                        </span>
                        <br /><br />
                        <Link href="https://www.newtro.xyz/">
                            <button className='btn border border-verde px-2 py-1 hover:bg-gris_oscuro hover:text-gris_claro transition-all duration-1000 mr-2'>LIVE SITE</button>
                        </Link>
                        <Link href="https://www.behance.net/gallery/203848481/Kostueme">
                            <button className='btn border border-verde px-2 py-1 hover:bg-gris_oscuro hover:text-gris_claro transition-all duration-1000'>BEHANCE</button>
                        </Link>
                    </p>
                </div>
            </div>

            {selectedImageIndex !== null && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-container">
                        <button className="modal-close-btn" onClick={closeModal}>CLOSE</button>
                        <div className="image-scroll-container">
                            {images.map((src, index) => (
                                <div key={index} className={`image-item ${index === selectedImageIndex ? 'active' : ''}`}>
                                    <Image src={src} alt={`image ${index + 1}`} layout="intrinsic" width={1200} height={800} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Page;
