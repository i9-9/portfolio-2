import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import NavbarHome from '../../../components/NavbarHome'

const page = () => {
    return (
        <div className=''>
            <NavbarHome />
            <div className='grid md:grid-cols-2 py-3 px-4'>
                <div className='order-2 md:order-1'>
                    <Image alt="Web agency C7 Studio" src="/projects-c7/c7-1.png" height={650} width={650} />
                    <Image alt="Web agency C7 Studio" src="/projects-c7/c7-2.png" height={650} width={650} />
                    <Image alt="Web agency C7 Studio" src="/projects-c7/c7-3.png" height={650} width={650} />
                </div>
                <div className=''>
                    <h1 className='text-verde text-7xl font-bold'>C7 Studio</h1>
                    <p className='text-verde'>
                        C7 Studio [Web Agency] <br />
                        (Web design & Dev with Florencia Gomez)<br /><br />

                        <br />
                    <Link href="http://c7studio.net">
                        <button className='btn text-verde border border-verde px-2 py-1 hover:bg-violeta transition-all duration-1000'>LIVE SITE</button>
                    </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default page