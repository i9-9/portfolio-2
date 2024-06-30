import Marquee from "react-fast-marquee";

const MyMarquee = () => {
  const marqueeContent = "• Digital Designer"; // Your marquee text

  // Function to duplicate the content for looping effect
  const getMarqueeContent = () => {
    // Repeat the content multiple times to create a long enough marquee
    const repeatedContent = Array.from({ length: 70 }, () => marqueeContent).join("   ");
    return repeatedContent;
  };

  return (
    <div className=''>
      <Marquee
        speed={10}
        play={true}
        pauseOnHover={false}
        gradient={false}
        className='flex justify-center border bg-verde text-black border-verde text-sm overflow-hidden uppercase'>
        <p className='mx-1 font-supplySans'>
          {getMarqueeContent()}
        </p>
      </Marquee>
    </div>
  );
};

export default MyMarquee;
