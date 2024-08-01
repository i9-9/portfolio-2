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
            className='marquee border border-t-verde border-b-verde py-1 mb-2'
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <>
                <Image key={i * 3 + 1} className='marquee-image' src='/projects-landing/kostume/kostume1.png' alt='kostume project' width={450} height={354} />
                <Image key={i * 3 + 2} className='marquee-image' src='/projects-landing/kostume/kostume2.png' alt='kostume project' width={450} height={354} />
                <Image key={i * 3 + 3} className='marquee-image' src='/projects-landing/kostume/kostume3.png' alt='kostume project' width={450} height={354} />
              </>
            ))}
          </Marquee>
        </Link>

        <Link href="/work/c7">
          <div className='flex justify-between items-baseline text-verde text-sm'>
            <h2 className='text-p'>C7 Studio</h2>
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
              <>
                <Image key={i * 4 + 1} className='marquee-image' src='/projects-c7/c7-1.png' alt='c7 studio project' width={450} height={354} />
                <Image key={i * 4 + 2} className='marquee-image' src='/projects-c7/c7-2.png' alt='c7 studio project' width={450} height={354} />
                <Image key={i * 4 + 3} className='marquee-image' src='/projects-c7/c7-3.png' alt='c7 studio project' width={450} height={354} />
                <Image key={i * 4 + 4} className='marquee-image' src='/projects-c7/c7-4.png' alt='c7 studio project' width={450} height={354} />
              </>
            ))}
          </Marquee>
        </Link>

        <Link href="/work/sofar">
          <div className='flex justify-between items-baseline text-verde text-sm'>
            <h2 className='text-p'>So Far, So Near</h2>
            <h5 className='text-small'>Web Design</h5>
          </div>
          <Marquee
            speed={25}
            play={true}
            pauseOnHover={false}
            gradient={false}
            className='marquee border border-t-verde border-b-verde py-1 mb-2'
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <>
                <Image key={i * 4 + 1} className='marquee-image' src='/projects-sofar/sofar-1.png' alt='So Far, So Near project' width={450} height={354} />
                <Image key={i * 4 + 2} className='marquee-image' src='/projects-sofar/sofar-2.png' alt='So Far, So Near project' width={450} height={354} />
                <Image key={i * 4 + 3} className='marquee-image' src='/projects-sofar/sofar-3.png' alt='So Far, So Near project' width={450} height={354} />
                <Image key={i * 4 + 4} className='marquee-image' src='/projects-sofar/sofar-4.png' alt='So Far, So Near project' width={450} height={354} />
              </>
            ))}
          </Marquee>
        </Link>

        {/* <h3 className='text-verde text-sm mt-6 mb-2'>See more projects:<br /></h3>
        <div className='text-verde grid grid-cols-1 md:grid-cols-2 gap-x-8	'>
          <button className='border border-verde px-1 py-2 hover:bg-gris_oscuro hover:text-gris_claro transition-all duration-700 text-sm'>
            <Link href="https://github.com/i9-9">
              Github
            </Link>
          </button>
          <button className='border border-verde px-1 py-2 hover:bg-gris_oscuro hover:text-gris_claro transition-all duration-700 text-sm'>
            <Link href="https://www.behance.net/ivan_nevares">
              Behance
            </Link>
          </button>
          <br />
        </div> */}
      </div>
    </div>
  );
};

export default Work;
