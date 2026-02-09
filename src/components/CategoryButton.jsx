const CategoryButton = ({ name, image, active = false, onClick }) => {
  const baseClass = "sc-KyHQC sc-jiWiVj";

  const activeClass = active ? "dJjjJJ bAQHIv" : "XMojM bzqLNn";

  return (
    <a className="sc-ciMfCw ja-dRuB cy-tabs-navigation-menu-item" onClick={onClick}>
      <div className={`${baseClass} ${activeClass}`}>
        <img src={image} className="sc-bqOBqt PBviZ" alt={name} style={{ width: "2rem", height: "2rem" }} />
        {name}
      </div>
    </a>
  );
};

export default CategoryButton;