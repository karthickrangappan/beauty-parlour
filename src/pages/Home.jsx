import React from "react";
import Hero from "./HeroTwo";
import AboutSanctuary from "../components/home/AboutSanctuary";
import FeaturedServices from "../components/home/FeaturedServices";
import MasonryGallery from "../components/home/MasonryGallery";
import CtaSection from "../components/home/CtaSection";


const Home = () => {
  return (
    <div className="w-full bg-[#fdf8f3] text-neutral-800 font-sans overflow-hidden">
      <Hero />
      <AboutSanctuary />
      <FeaturedServices />
      <MasonryGallery />
      <CtaSection />
    </div>
  );
};

export default Home;