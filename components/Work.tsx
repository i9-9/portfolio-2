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
                <Image className='marquee-image' src='/projects-landing/kostume/jul:24/1 - This is K.png' alt='Kostüme Website Design Project - Brand Overview' width={450} height={354} />
                <Image className='marquee-image' src='/projects-landing/kostume/jul:24/4 - Macbook mockup.png' alt='Kostüme Website Design Project - Desktop View' width={450} height={354} />
                <Image className='marquee-image' src='/projects-landing/kostume/jul:24/6 - Mobile mockup.png' alt='Kostüme Website Design Project - Mobile View' width={450} height={354} />
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
                <Image className='marquee-image' src='/newtro/one.png' alt='Newtro Website Design Project - Homepage View' width={450} height={354} />
                <Image className='marquee-image' src='/newtro/two.png' alt='Newtro Website Design Project - Features View' width={450} height={354} />
                <Image className='marquee-image' src='/newtro/three.png' alt='Newtro Website Design Project - Showcase View' width={450} height={354} />
                <Image className='marquee-image' src='/newtro/four.png' alt='Newtro Website Design Project - Mobile View' width={450} height={354} />
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
                <Image className='marquee-image' src='/projects-eldesenfreno/one.png' alt='El Desenfreno Website - Homepage Design' width={450} height={354} />
                <Image className='marquee-image' src='/projects-eldesenfreno/two.png' alt='El Desenfreno Website - Products Display' width={450} height={354} />
                <Image className='marquee-image' src='/projects-eldesenfreno/three.png' alt='El Desenfreno Website - Editorial Content' width={450} height={354} />
                <Image className='marquee-image' src='/projects-eldesenfreno/four.png' alt='El Desenfreno Website - Mobile Experience' width={450} height={354} />
                <Image className='marquee-image' src='/projects-eldesenfreno/five.png' alt='El Desenfreno Website - Shopping Interface' width={450} height={354} />
                <Image className='marquee-image' src='/projects-eldesenfreno/six.png' alt='El Desenfreno Website - Contact Page' width={450} height={354} />
              </React.Fragment>
            ))}
          </Marquee>
        </Link>
      </div>
    </div>
  );
};

export default Work;
