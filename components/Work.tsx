import Image from 'next/image';
import Marquee from "react-fast-marquee";
import Link from 'next/link';
import { useState } from 'react';

const Work = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showText1, setShowText1] = useState(false);
  const [showText2, setShowText2] = useState(false);
  const [showText3, setShowText3] = useState(false);

  const handleMouseMove = (event) => {
    setMousePosition({ x: event.clientX, y: event.clientY });
  };

  return (
    <div id='work' className='mx-1 h-auto pt-1' onMouseMove={handleMouseMove}>

      <div className='py-6'>
        <Link 
        onMouseEnter={() => setShowText1(true)}
        onMouseLeave={() => setShowText1(false)} 
        href="/work/kostume">
          {showText1 && (
          <div 
          style={{ position: 'fixed', top: mousePosition.y, left: mousePosition.x }}
          className=' border border-verde z-[1000] text-on-hover text-verde p-8 rounded-md bg-black'>
            <h3 className='bold text-center'>Kostume<br/>Web Design</h3> 
          </div>
        )}
          <Marquee
            speed={25}
            play={true}
            pauseOnHover={false}
            gradient={false}
            className='flex justify-center border border-t-verde border-b-verde py-1'>
            <Image className='mx-2' src='/projects-landing/kostume/kostume1.png' alt='kostume project' width={450} height={354} />
            <Image className='mx-2' src='/projects-landing/kostume/kostume2.png' alt='kostume project' width={450} height={354} />
            <Image className='mx-2' src='/projects-landing/kostume/kostume3.png' alt='kostume project' width={450} height={354} />
            <Image className='mx-2' src='/projects-landing/kostume/kostume1.png' alt='kostume project' width={450} height={354} />
            <Image className='mx-2' src='/projects-landing/kostume/kostume2.png' alt='kostume project' width={450} height={354} />
            <Image className='mx-2' src='/projects-landing/kostume/kostume3.png' alt='kostume project' width={450} height={354} />
            <Image className='mx-2' src='/projects-landing/kostume/kostume1.png' alt='kostume project' width={450} height={354} />
            <Image className='mx-2' src='/projects-landing/kostume/kostume2.png' alt='kostume project' width={450} height={354} />
            <Image className='mx-2' src='/projects-landing/kostume/kostume3.png' alt='kostume project' width={450} height={354} />
            <Image className='mx-2' src='/projects-landing/kostume/kostume1.png' alt='kostume project' width={450} height={354} />
            <Image className='mx-2' src='/projects-landing/kostume/kostume2.png' alt='kostume project' width={450} height={354} />
            <Image className='mx-2' src='/projects-landing/kostume/kostume3.png' alt='kostume project' width={450} height={354} />
            <Image className='mx-2' src='/projects-landing/kostume/kostume1.png' alt='kostume project' width={450} height={354} />
            <Image className='mx-2' src='/projects-landing/kostume/kostume2.png' alt='kostume project' width={450} height={354} />
            <Image className='mx-2' src='/projects-landing/kostume/kostume3.png' alt='kostume project' width={450} height={354} />
            <Image className='mx-2' src='/projects-landing/kostume/kostume1.png' alt='kostume project' width={450} height={354} />
            <Image className='mx-2' src='/projects-landing/kostume/kostume2.png' alt='kostume project' width={450} height={354} />
            <Image className='mx-2' src='/projects-landing/kostume/kostume3.png' alt='kostume project' width={450} height={354} />
          </Marquee>
        </Link>

        <Link
                  onMouseEnter={() => setShowText2(true)}
                  onMouseLeave={() => setShowText2(false)}
        href="/work/c7">
          {showText2 && (
          <div 
          style={{ position: 'fixed', top: mousePosition.y, left: mousePosition.x }}
          className=' border border-verde z-[1000] text-on-hover text-verde p-8 rounded-md bg-black'>
            <h3 className='bold text-center'>C7 Studio<br/>Web Design & Development</h3> 
          </div>
        )}
          <Marquee play={true} pauseOnHover={false} gradient={false} className='flex justify-center my-6 border border-t-verde border-b-verde py-1'>
            <Image className='mx-2' src='/projects-c7/c7-1.png' alt='c7 studio project' width={450} height={354} />
            <Image className='mx-2' src='/projects-c7/c7-2.png' alt='c7 studio project' width={450} height={354} />
            <Image className='mx-2' src='/projects-c7/c7-3.png' alt='c7 studio project' width={450} height={354} />
            <Image className='mx-2' src='/projects-c7/c7-4.png' alt='c7 studio project' width={450} height={354} />
            <Image className='mx-2' src='/projects-c7/c7-1.png' alt='c7 studio project' width={450} height={354} />
            <Image className='mx-2' src='/projects-c7/c7-2.png' alt='c7 studio project' width={450} height={354} />
            <Image className='mx-2' src='/projects-c7/c7-3.png' alt='c7 studio project' width={450} height={354} />
            <Image className='mx-2' src='/projects-c7/c7-4.png' alt='c7 studio project' width={450} height={354} />
            <Image className='mx-2' src='/projects-c7/c7-1.png' alt='c7 studio project' width={450} height={354} />
            <Image className='mx-2' src='/projects-c7/c7-2.png' alt='c7 studio project' width={450} height={354} />
            <Image className='mx-2' src='/projects-c7/c7-3.png' alt='c7 studio project' width={450} height={354} />
            <Image className='mx-2' src='/projects-c7/c7-4.png' alt='c7 studio project' width={450} height={354} />
            <Image className='mx-2' src='/projects-c7/c7-1.png' alt='c7 studio project' width={450} height={354} />
            <Image className='mx-2' src='/projects-c7/c7-2.png' alt='c7 studio project' width={450} height={354} />
            <Image className='mx-2' src='/projects-c7/c7-3.png' alt='c7 studio project' width={450} height={354} />
            <Image className='mx-2' src='/projects-c7/c7-4.png' alt='c7 studio project' width={450} height={354} />
            <Image className='mx-2' src='/projects-c7/c7-1.png' alt='c7 studio project' width={450} height={354} />
            <Image className='mx-2' src='/projects-c7/c7-2.png' alt='c7 studio project' width={450} height={354} />
            <Image className='mx-2' src='/projects-c7/c7-3.png' alt='c7 studio project' width={450} height={354} />
            <Image className='mx-2' src='/projects-c7/c7-4.png' alt='c7 studio project' width={450} height={354} />
          </Marquee>
        </Link>
        <Link
                onMouseEnter={() => setShowText3(true)}
                onMouseLeave={() => setShowText3(false)} 
                href="/work/sofar">
                        {showText3 && (
          <div 
          style={{ position: 'fixed', top: mousePosition.y, left: mousePosition.x }}
          className=' border border-verde z-[1000] text-on-hover text-verde p-8 rounded-md bg-black'>
            <h3 className='bold text-center'>So Far, So Near<br/>Web Design</h3> 
          </div>
        )}    
          <Marquee play={true} pauseOnHover={false} gradient={false} className='flex justify-center my-6 border border-t-verde border-b-verde py-1'>
            <Image className='mx-2' src='/projects-sofar/sofar-1.png' alt='So Far, So Near project' width={450} height={354} />
            <Image className='mx-2' src='/projects-sofar/sofar-2.png' alt='So Far, So Near project' width={450} height={354} />
            <Image className='mx-2' src='/projects-sofar/sofar-3.png' alt='So Far, So Near project' width={450} height={354} />
            <Image className='mx-2' src='/projects-sofar/sofar-4.png' alt='So Far, So Near project' width={450} height={354} />
            <Image className='mx-2' src='/projects-sofar/sofar-1.png' alt='So Far, So Near project' width={450} height={354} />
            <Image className='mx-2' src='/projects-sofar/sofar-2.png' alt='So Far, So Near project' width={450} height={354} />
            <Image className='mx-2' src='/projects-sofar/sofar-3.png' alt='So Far, So Near project' width={450} height={354} />
            <Image className='mx-2' src='/projects-sofar/sofar-4.png' alt='So Far, So Near project' width={450} height={354} />
            <Image className='mx-2' src='/projects-sofar/sofar-1.png' alt='So Far, So Near project' width={450} height={354} />
            <Image className='mx-2' src='/projects-sofar/sofar-2.png' alt='So Far, So Near project' width={450} height={354} />
            <Image className='mx-2' src='/projects-sofar/sofar-3.png' alt='So Far, So Near project' width={450} height={354} />
            <Image className='mx-2' src='/projects-sofar/sofar-4.png' alt='So Far, So Near project' width={450} height={354} />
            <Image className='mx-2' src='/projects-sofar/sofar-1.png' alt='So Far, So Near project' width={450} height={354} />
            <Image className='mx-2' src='/projects-sofar/sofar-2.png' alt='So Far, So Near project' width={450} height={354} />
            <Image className='mx-2' src='/projects-sofar/sofar-3.png' alt='So Far, So Near project' width={450} height={354} />
            <Image className='mx-2' src='/projects-sofar/sofar-4.png' alt='So Far, So Near project' width={450} height={354} />
            <Image className='mx-2' src='/projects-sofar/sofar-1.png' alt='So Far, So Near project' width={450} height={354} />
            <Image className='mx-2' src='/projects-sofar/sofar-2.png' alt='So Far, So Near project' width={450} height={354} />
            <Image className='mx-2' src='/projects-sofar/sofar-3.png' alt='So Far, So Near project' width={450} height={354} />
            <Image className='mx-2' src='/projects-sofar/sofar-4.png' alt='So Far, So Near project' width={450} height={354} />
          </Marquee>
        </Link>
        <h3 className='text-verde font-bold'>See more projects:<br /></h3>
        <div className='text-verde font-bold grid grid-cols-1 md:grid-cols-2'>
          <button className='border border-verde px-1 py-2 hover:bg-verde hover:text-violeta transition-all duration-700 text-xl'>
            <Link href="https://github.com/i9-9" >
              Github
            </Link>
          </button>
          <button className='border border-verde px-1 py-2  hover:bg-verde hover:text-violeta transition-all duration-700 text-xl'>
            <Link href="https://www.behance.net/ivan_nevares" >
              Behance
            </Link>
          </button>
          <br />
        </div>


      </div>
    </div>
  )
}

export default Work