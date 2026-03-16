import React from "react";
import Hero from "./HeroTwo";
import AboutSanctuary from "../components/home/AboutSanctuary";
import TrendingServices from "../components/home/TrendingServices";
import TrendingProducts from "../components/home/TrendingProducts";
import RecentlyAddedProducts from "../components/home/RecentlyAddedProducts";
import MasonryGallery from "../components/home/MasonryGallery";
import CtaSection from "../components/home/CtaSection";


const Home = () => {
  return (
    <div className="w-full bg-white text-neutral-800 font-sans overflow-hidden">
      <Hero />
      <RecentlyAddedProducts />
      <AboutSanctuary />
      <TrendingProducts />
      <CtaSection />
      <TrendingServices />
      <MasonryGallery />
    </div>
  );
};

export default Home;