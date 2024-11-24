import "./getintouch.scss";
const Getintouch = () => {
  return (
    <>
      {" "}
      <div className="heading-contact">
        <h1>
          Get in <span className="touch">Touch</span>
        </h1>
        <p>
          I’m always open to new opportunities and collaborations. Whether
          you’re looking for a developer, consultant, or tech partner, feel free
          to get in touch!
        </p>
      </div>
      <div className="getintouch">
        <div className="left">
          <div className="input-box">
            <input type="text" placeholder="Name" />
            <input type="email" placeholder="Email" />
            <input type="text" placeholder="Phone Number" />
            <textarea
              className="left-textarea"
              rows={20}
              cols={50}
              placeholder="Enter Query Here"
            />
            <button>Send</button>
          </div>
        </div>
        <div className="right">
          <textarea rows={20} cols={50} placeholder="Enter Query Here" />
        </div>
      </div>
    </>
  );
};

export default Getintouch;
