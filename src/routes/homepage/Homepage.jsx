import Advantages from "../../components/advantages/Advantages";
// import Footer from "../../components/footer/Footer";
import Getintouch from "../../components/getintouch/Getintouch";
import HeroSection from "../../components/herosection/HeroSection";
// import Itemcard from "../../components/itemcard/Itemcard";
import RecommendationSlider from "../../components/recomendationslider/RecomendationSlider";
import "./homepage.scss";
const Homepage = () => {
  return (
    <div className="homepage">
      <HeroSection />
      <h4 className="discover">DISCOVER</h4>
      <h1 className="heading">Best recomendation</h1>

      {/* <div className="recomendation-container">
        <Itemcard />
        <Itemcard />
        <Itemcard />
        <Itemcard />
      </div> */}
      <RecommendationSlider />

      <Advantages />
      <Getintouch />
      {/* <Footer /> */}
    </div>
  );
};

export default Homepage;
