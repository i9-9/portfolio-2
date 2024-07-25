import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import Navbar from '../../../components/Navbar'

const page = () => {
    return (
        <div className='px-4'>
            <Navbar />
            <div className='grid md:grid-cols-2 py-3'>
                <div className='order-2 md:order-1'>
                    <Image alt="image showing work for fashionwear brand Kostume" src="/projects-landing/kostume/kostume1.png" height={650} width={650} />
                    <Image alt="image showing work for fashionwear brand Kostume" src="/projects-landing/kostume/kostume2.png" height={650} width={650} />
                    <Image alt="image showing work for fashionwear brand Kostume" src="/projects-landing/kostume/kostume3.png" height={650} width={650} />
                </div>
                <div className=''>
                    <h1 className='text-verde text-7xl font-bold'>Newtro</h1>
                    <p className='text-verde'>
                    Newtro Arts aims to promote, educate and introduce latin american artists and cultural agents to blockchain technology.<br/>Role: UI designer<br/>
                    <Link href="https://www.newtro.xyz/">
                        <button className='btn text-verde border border-verde px-2 py-1 hover:bg-violeta transition-all duration-1000'>LIVE SITE</button>
                    </Link>
                    <Link href="https://www.behance.net/gallery/203203483/Newtro">
                        <button className='btn text-verde border border-verde px-2 py-1 hover:bg-violeta transition-all duration-1000'>BEHANCE</button>
                    </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default page