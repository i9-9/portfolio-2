import React from 'react';
import Image from 'next/image';
import Marquee from "react-fast-marquee";
import Link from 'next/link';

const Work = () => {
  return (
    <div id='work' className='h-auto pt-2 px-4'>
      <div className=''>
        <Link href="/work/kostume">
          <div className='flex justify-between items-baseline text-verde text-sm'>
            <h2 className='text-p'>Kostüme</h2>
            <h5 className=' text-gris_oscuro text-small'>Web Design</h5>
          </div>
          <Marquee
            speed={25}
            play={true}
            pauseOnHover={false}
            gradient={false}
            className='marquee border border-t-verde border-b-verde py-1 mb-2 bg-[#070707]'
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <React.Fragment key={`kostume-${i}`}>
                <Image className='marquee-image' src='/projects-landing/kostume/jul:24/1 - This is K.png' alt='kostume project' width={450} height={354} />
                <Image className='marquee-image' src='/projects-landing/kostume/jul:24/4 - Macbook mockup.png' alt='kostume project' width={450} height={354} />
                <Image className='marquee-image' src='/projects-landing/kostume/jul:24/6 - Mobile mockup.png' alt='kostume project' width={450} height={354} />
              </React.Fragment>
            ))}
          </Marquee>
        </Link>

        <Link href="/work/newtro">
          <div className='flex justify-between items-baseline text-verde text-sm'>
            <h2 className='text-p'>Newtro</h2>
            <h5 className='text-small'>Web Design & Development</h5>
          </div>
          <Marquee
            speed={25}
            play={true}
            pauseOnHover={false}
            gradient={false}
            className='marquee border border-t-verde border-b-verde py-1 mb-2'
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <React.Fragment key={`newtro-${i}`}>
                <Image className='marquee-image' src='/newtro/one.png' alt='c7 studio project' width={450} height={354} />
                <Image className='marquee-image' src='/newtro/two.png' alt='c7 studio project' width={450} height={354} />
                <Image className='marquee-image' src='/newtro/three.png' alt='c7 studio project' width={450} height={354} />
                <Image className='marquee-image' src='/newtro/four.png' alt='c7 studio project' width={450} height={354} />
              </React.Fragment>
            ))}
          </Marquee>
        </Link>

        <Link href="/work/eldesenfreno">
          <div className='flex justify-between items-baseline text-verde text-sm'>
            <h2 className='text-p'>El Desenfreno</h2>
            <h5 className='text-small'>Web Design & Development</h5>
          </div>
          <Marquee
            speed={25}
            play={true}
            pauseOnHover={false}
            gradient={false}
            className='marquee border border-t-verde border-b-verde py-1 mb-2'
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <React.Fragment key={`eldesenfreno-${i}`}>
                <Image className='marquee-image' src='/projects-eldesenfreno/one.png' alt='So Far, So Near project' width={450} height={354} />
                <Image className='marquee-image' src='/projects-eldesenfreno/two.png' alt='So Far, So Near project' width={450} height={354} />
                <Image className='marquee-image' src='/projects-eldesenfreno/three.png' alt='So Far, So Near project' width={450} height={354} />
                <Image className='marquee-image' src='/projects-eldesenfreno/four.png' alt='So Far, So Near project' width={450} height={354} />
                <Image className='marquee-image' src='/projects-eldesenfreno/five.png' alt='So Far, So Near project' width={450} height={354} />
                <Image className='marquee-image' src='/projects-eldesenfreno/six.png' alt='So Far, So Near project' width={450} height={354} />
              </React.Fragment>
            ))}
          </Marquee>
        </Link>
      </div>
    </div>
  );
};

export default Work;
