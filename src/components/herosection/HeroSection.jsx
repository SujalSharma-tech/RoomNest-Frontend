import Herofilter from "../herofilter/Herofilter";
import "./HeroSection.scss";
const HeroSection = () => {
  return (
    <div className="herosection">
      <div className="hero-text">
        <h1 className="title">Find Your Dream Home</h1>
        <p>Get the best offers from top real estate agents in the USA</p>
      </div>
      <Herofilter />
    </div>
  );
};

export default HeroSection;
