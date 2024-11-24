import "./footer.scss";
import { Facebook, Instagram, Twitter } from "lucide-react";
// import logo from "./logomain.png";
const Footer = () => {
  return (
    <div className="footer">
      <div className="footer-left">
        <div className="left-items">
          <div className="logo">
            ROOM<span>NEST</span>
          </div>

          <div className="text">
            <p>We Help You Find Exactly What You’re Looking For</p>
          </div>
          <div className="buttons">
            <button>
              <Facebook />
            </button>
            <button>
              <Instagram />
            </button>
            <button>
              <Twitter />
            </button>
          </div>
        </div>
        <div className="copyright">
          2024 all Right Reserved Term of use Roomnest
        </div>
      </div>

      <div className="footer-right">
        <div>
          <ul>
            <li>Information</li>
            <li>About</li>
            <li>Product</li>
            <li>Blog</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Footer;
