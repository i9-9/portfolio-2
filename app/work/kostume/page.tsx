"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import NavbarHome from '../../../components/NavbarHome';
import NameAnimation from '../../../components/NameAnimation'; // Import the NameAnimation component

const Page = () => {
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

    const images = [
        "/projects-landing/kostume/jul:24/1 - This is K.png",
        "/projects-landing/kostume/jul:24/2 - About.png",
        "/projects-landing/kostume/jul:24/3 - Full Desktop.png",
        "/projects-landing/kostume/jul:24/4 - Macbook mockup.png",
        "/projects-landing/kostume/jul:24/5 - Tablet.png",
        "/projects-landing/kostume/jul:24/6 - Mobile mockup.png",
        "/projects-landing/kostume/jul:24/7 - Desktop p.png",
    ];

    const openModal = (index: number) => setSelectedImageIndex(index);
    const closeModal = () => setSelectedImageIndex(null);

    return (
        <div className=''>
            <NavbarHome />
            <div className='grid md:grid-cols-2 py-3 px-4'>
                <div className='order-2 md:order-1'>
                    {images.map((src, index) => (
                        <div key={index} onClick={() => openModal(index)}>
                            <Image alt={`image ${index + 1}`} src={src} height={2800} width={1678} />
                        </div>
                    ))}
                </div>
                <div>
                    <h1 className='text-verde text-7xl font-bold'>Kostüme</h1>
                    <p className='text-verde my-4'>
                        <span className='text-gris_claro bg-gris_oscuro p-1 px-2 text-xs uppercase'>
                            E-shop 
                        </span>
                        <span className='spacer'></span>
                        <span className='text-gris_claro bg-gris_oscuro p-1 px-2 text-xs uppercase'>
                            Web design
                        </span>
                        <br /><br />
                        For C7 Studio<br />
                        Web development: 
                        <Link className='underline' href='https://www.1tbflor.com/'>
                           <br/> Florencia Gomez
                        </Link>
                        <br /><br />
                        <Link href="https://www.kostumeweb.net/">
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
                        <button className="modal-close-btn bg-gris" onClick={closeModal}>CLOSE</button>
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
