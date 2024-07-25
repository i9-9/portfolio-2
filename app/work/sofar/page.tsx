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
                    <Image alt="image showing work Wrong Biennale pavilion 'So Far, So Near" src="/projects-sofar/sofar-1.png" height={650} width={650} />
                    <Image alt="image showing work Wrong Biennale pavilion 'So Far, So Near" src="/projects-sofar/sofar-2.png" height={650} width={650} />
                    <Image alt="image showing work Wrong Biennale pavilion 'So Far, So Near" src="/projects-sofar/sofar-3.png" height={650} width={650} />
                </div>
                <div className=''>
                    <h1 className='text-verde text-7xl font-bold'>So Far, So Near</h1>
                    <p className='text-verde'>
                        So Far, So Near [Digital Art Pavillion] <br />
                        (Web design)<br /><br />

                        For C7 Studio<br />
                        Web development - <span className='hover-underline-animation'>
                            Florencia Gomez
                            </span>
                            <br />
                        <br />
                    <Link href="https://www.sofarsonear.online/">
                        <button className='btn text-verde border border-verde px-2 py-1 hover:bg-violeta transition-all duration-1000'>LIVE SITE</button>
                    </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default page