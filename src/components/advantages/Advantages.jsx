import "./advantages.scss";

const advantagesData = [
  {
    icon: "❤️",
    title: "Comfortable",
    description:
      "Enjoy lifestyle amenities designed to provide homeowners with modern comfort, close to schools, churches, and hospitals.",
  },
  {
    icon: "✅",
    title: "Extra security",
    description:
      "Connect with tenants securely without sharing your phone number. We validate all users to ensure legitimacy.",
  },
  {
    icon: "⭐",
    title: "Luxury",
    description:
      "Experience the highest standard of property management, offering you all the benefits of professional service.",
  },
  {
    icon: "💰",
    title: "Best price",
    description:
      "Unsure about pricing? Let us help. Contact us for a free rental appraisal to determine the right rate for your property.",
  },
  {
    icon: "📍",
    title: "Strategic location",
    description:
      "Located in prime areas, close to shopping centers and business hubs for ultimate convenience and accessibility.",
  },
  {
    icon: "📈",
    title: "Efficient",
    description:
      "Schedule multiple property visits in one day with ease. Discover the best properties without the hassle.",
  },
];

const AdvantagesSection = () => {
  return (
    <section className="advantages-section">
      <div className="section-header">
        <span className="highlight">OUR ADVANTAGE</span>
        <h2>Providing you peace of mind</h2>
      </div>
      <div className="advantages-list">
        {advantagesData.map((advantage, index) => (
          <div key={index} className="advantage-item">
            <div className="icon">{advantage.icon}</div>
            <h3>{advantage.title}</h3>
            <p>{advantage.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AdvantagesSection;
