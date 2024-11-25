import Herofilter from "../herofilter/Herofilter";
import "./HeroSection.scss";
const HeroSection = () => {
  return (
    <div className="herosection">
      <div className="hero-text">
        <h1 className="title">
          Find your happy place with <br /> RoomNest
        </h1>
        <p>Find your perfect space, right next to campus</p>
      </div>
      <Herofilter />
    </div>
  );
};

export default HeroSection;
