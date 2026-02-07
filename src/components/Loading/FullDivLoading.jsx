import { useEffect } from "react";
import ImgSplash from "/src/assets/img/splash_logo.png";

const FullDivLoading = (props) => {
  useEffect(() => {
    const splashPage = document.getElementById("splash-page");
    if (!splashPage) return;
    
    if (props.show === true) {
      splashPage.classList.remove("d-none");
    } else {
      splashPage.classList.add("d-none");
    }
  }, [props.show]);

  return (
    <div id="splash-page" className="d-none">
      <div 
        className="splash-brand" 
        style={{backgroundImage: `url(${ImgSplash})`}}
      ></div>
    </div>
  );
};

export default FullDivLoading;