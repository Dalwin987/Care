import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import { TiLocationArrow } from "react-icons/ti";


gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  useGSAP(() => {
    gsap.set("#video-frame", {
      clipPath: "polygon(14% 0, 72% 0, 88% 90%, 0 95%)",
      borderRadius: "0% 0% 40% 10%",
    });

    gsap.from("#video-frame", {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      borderRadius: "0% 0% 0% 0%",
      ease: "power1.inOut",
      scrollTrigger: {
        trigger: "#video-frame",
        start: "center center",
        end: "bottom center",
        scrub: true,
      },
    });
  });

  return (
    <div className="relative h-dvh w-screen overflow-hidden">
      {/* Hero Video */}
      <div
        id="video-frame"
        className="relative h-dvh w-screen overflow-hidden rounded-lg"
      >

      {/*if you need any alter vedio  change manipulate it*/} 
      <video
          src="/videos/Care.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/40 z-10"></div>

        {/* Hero Content */}
        <div className="absolute inset-0 z-20 flex flex-col justify-center px-6 sm:px-12">
          <h1 className="special-font hero-heading text-6xl md:text-8xl text-white">
            <b>Care➢Buddy࿐ </b>
          </h1>

          <p className="mt-4 mb-8 max-w-sm text-white text-lg">
            <b></b>Care Youself and Your Loved Ones with Our Reliable Medicine Delivery Service
            <br />
        
          </p>

         {/**  <Button
            id="watch-trailer"
            title="Watch Trailer"
            leftIcon={<TiLocationArrow className="text-lg" />}
            containerClass="flex items-center gap-2 bg-yellow-300 hover:bg-yellow-400 text-black"
          />*/}
        </div>

     

        <h1 className="special-font hero-heading absolute bottom-6 right-6 z-20 text-white text-5xl md:text-7xl">
            
          
        </h1>
      </div>
    </div>
  );
};

export default Hero;