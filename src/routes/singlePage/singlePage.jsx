import "./singlePage.scss";
import Slider from "../../components/slider/Slider";
import { useParams } from "react-router-dom";
import DOMPurify from "dompurify";

import { useAppStore } from "../../store";
import SimpleMap from "../../components/mapcomponent/SimpleMap";
import { useEffect, useState } from "react";

function SinglePage() {
  const { userInfo, properties } = useAppStore();
  const [property, setProperty] = useState({});
  // const navigate = useNavigate();
  const { id } = useParams();
  useEffect(() => {
    const filteredProperty = properties.filter(
      (property) => property._id == id
    );
    setProperty(filteredProperty);
  }, [properties, id]);

  // const handleSave = async () => {
  //   if (!userInfo) {
  //     navigate("/login");
  //   }
  //   // AFTER REACT 19 UPDATE TO USEOPTIMISTIK HOOK
  //   setSaved((prev) => !prev);
  //   try {
  //     await apiRequest.post("/users/save", { postId: post.id });
  //   } catch (err) {
  //     console.log(err);
  //     setSaved((prev) => !prev);
  //   }
  // };

  return property && !property.length > 0 ? (
    <h1>Loading...</h1>
  ) : (
    <div className="singlePage">
      <div className="details">
        <div className="wrapper">
          <Slider images={property[0].additional_photos} />
          <div className="info">
            <div className="top">
              <div className="post">
                <h1>{property[0].title}</h1>
                <div className="address">
                  <img src="/pin.png" alt="" />
                  <span>{property[0].address}</span>
                </div>
                <div className="price">₹ {property[0].rent}</div>
              </div>
              <div className="user">
                {/* <img src={post.user.avatar} alt="" /> */}
                <p>Listed By</p>
                <span>{userInfo?.first_name + " " + userInfo?.last_name}</span>
                <div>
                  {property[0]?.phone
                    ? `+91 ${property[0].phone}`
                    : "Contact No. Not provided"}
                </div>
              </div>
            </div>
            <div className="bottom">
              <h2>Description</h2>
            </div>
            <div
              style={{ marginTop: "10px" }}
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(property[0].description),
              }}
            ></div>
          </div>
        </div>
      </div>
      <div className="features">
        <div className="wrapper">
          <p className="title">General</p>
          <div className="listVertical">
            <div className="feature">
              <img src="/utility.png" alt="" />
              <div className="featureText">
                <span>Utilities</span>
                {property[0].utilities_included === "owner" ? (
                  <p>Owner is responsible</p>
                ) : (
                  <p>Tenant is responsible</p>
                )}
              </div>
            </div>
            <div className="feature">
              <img src="/pet.png" alt="" />
              <div className="featureText">
                <span>Pet Policy</span>
                {property[0].pets_allowed ? (
                  <p>Pets Allowed</p>
                ) : (
                  <p>Pets not Allowed</p>
                )}
              </div>
            </div>
            <div className="feature">
              <img src="/wifi.png" alt="" />
              <div className="featureText">
                <span>Wifi Policy</span>
                {property[0].wifi ? (
                  <p>Wifi Avaialable</p>
                ) : (
                  <p>Wifi not Available</p>
                )}
              </div>
            </div>
            <div className="feature">
              <img src="/parking.png" alt="" />
              <div className="featureText">
                <span>Parking Facility</span>
                {property[0].parking ? (
                  <p>Parking Avaialable</p>
                ) : (
                  <p>Parking not Available</p>
                )}
              </div>
            </div>
            <div className="feature">
              <img src="/fee.png" alt="" />
              <div className="featureText">
                <span>Income Policy</span>
                <p>{10000}</p>
              </div>
            </div>
          </div>
          <p className="title">Sizes</p>
          <div className="sizes">
            {/* <div className="size">
              <img src="/size.png" alt="" />
              <span>{post.postDetail.size} sqft</span>
            </div> */}
            <div className="size">
              <img src="/bed.png" alt="" />
              <span>{property[0].no_of_rooms} beds</span>
            </div>
            <div className="size">
              <img src="/bath.png" alt="" />
              <span>{3} bathroom</span>
            </div>
          </div>
          <p className="title">Nearby Places</p>
          <div className="listHorizontal">
            {/* <div className="feature">
              <img src="/school.png" alt="" />
              <div className="featureText">
                <span>School</span>
                <p>
                  {post.postDetail.school > 999
                    ? post.postDetail.school / 1000 + "km"
                    : post.postDetail.school + "m"}{" "}
                  away
                </p>
              </div>
            </div> */}
            <div className="feature">
              <img src="/pet.png" alt="" />
              <div className="featureText">
                <span>Bus Stop</span>
                <p>{50}m away</p>
              </div>
            </div>
            <div className="feature">
              <img src="/fee.png" alt="" />
              <div className="featureText">
                <span>Restaurant</span>
                <p>{50}m away</p>
              </div>
            </div>
          </div>

          {property[0].maps_included ? (
            <>
              <p className="title">Location</p>
              <div className="mapContainer">
                <SimpleMap properties={property} />
              </div>
            </>
          ) : (
            ""
          )}
          {/* <div className="buttons">
            <button>
              <img src="/chat.png" alt="" />
              Send a Message
            </button>
            <button
              onClick={handleSave}
              style={{
                backgroundColor: saved ? "#fece51" : "white",
              }}
            >
              <img src="/save.png" alt="" />
              {saved ? "Place Saved" : "Save the Place"}
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default SinglePage;
