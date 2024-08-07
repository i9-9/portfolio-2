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
    <div className="marquee-container">
      <Marquee
        speed={10}
        play={true}
        pauseOnHover={false}
        gradient={false}
        className="flex justify-center items-center border bg-gris_claro text-black border-verde text-p overflow-hidden uppercase"
        style={{ width: "100%" }} // Ensure full width responsiveness
      >
        <div className="flex justify-center items-center w-full">
          <p className="mx-1 font-supplySans">
            {getMarqueeContent()}
          </p>
        </div>
      </Marquee>
    </div>
  );
};

export default MyMarquee;