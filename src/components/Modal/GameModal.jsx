import { useState, useEffect } from "react";
import LoadCasino from "../Loading/LoadCasino";
import Img18 from "/src/assets/svg/age-18plus-round.svg";

const GameModal = ({
  gameUrl,
  gameName,
  gameImg,
  onClose,
  isMobile,
}) => {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };

    updateTime();
    
    const intervalId = setInterval(updateTime, 1000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (isMobile && gameUrl) {
      window.location.href = gameUrl;
    }
  }, [gameUrl, isMobile]);

  const toggleFullscreen = () => {
    const elem = document.documentElement;

    if (!isFullscreen) {
      if (elem.requestFullscreen) elem.requestFullscreen();
      else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
      else if (elem.msRequestFullscreen) elem.msRequestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
      else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
      else if (document.msExitFullscreen) document.msExitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleIframeLoad = () => {
    setIframeLoaded(true);
  };

  if (isMobile) return null;

  return (
    <div className="sc-gwtVfY iVOthZ cy-game-window">
      <div className="sc-dogNfX hXBpHK game_column_flex_wrapper">
        <div className="sc-iOLOYK sc-cUluie jaIczi hEYaPr cy-game-navbar">
          <div className="sc-lnmtbb bBaxkM">
            <div className="sc-iqMSTM sc-jGhrkT cNDXZx jgBKE">
              <div className="sc-dSeeha sc-hdqUEi kWgyCH iQpKgV">
                <div className="sc-OPwof dBHGWN sc-iKjCcz eUUbAr cy-clock-component cy-game-navbar-clock">
                  <div className="cy-clock">{currentTime}</div>
                </div>
                <span className="sc-IYxHW gxNfBt"></span>
                <div className="sc-jDnEkQ huWxWb cy-open-responsible-gaming-button">
                  <img src={Img18} className="sc-bKxGPP bWFDOM" />
                  <span className="sc-IYxHW gxNfBt"></span>
                </div>
                <span className="sc-IYxHW gxNfBt"></span>
              </div>
              <div className="sc-dSeeha sc-hZoJMC kWgyCH cQDXZz">
                <div className="sc-ixnCPY cvzsHT cy-game-navbar-game-name">
                  {gameName}
                </div>
              </div>
            </div>
            <div className="sc-iqMSTM sc-cWgoYG cNDXZx XiJNy">
              <div className="sc-dSeeha sc-VJtBb kWgyCH jQIAqS">
                <span className="sc-IYxHW gxNfBt"></span>
              </div>
              <div className="sc-dSeeha sc-CHUkg kWgyCH gTNptV">
                <button 
                  className="sc-iVITdd fQGMWi cy-game-navbar-fullscreen-button"
                  onClick={toggleFullscreen}
                ></button>
                <span className="sc-hSNZQq hFOJgn"></span>
                <button 
                  className="sc-bcPLoT sc-djVRRB kSDmiN cedNG cy-game-navbar-close-button"
                  onClick={onClose}
                ></button>
              </div>
            </div>
          </div>
        </div>
        <div className="sc-dzZkzZ gLgOii" style={{ backgroundImage: `url(${gameImg})` }}>
          {!iframeLoaded && <LoadCasino />}
          {gameUrl && (
            <iframe 
              src={gameUrl}
              allow="autoplay" 
              className="sc-cQvPqr cqOVkk cy-game-iframe"
              onLoad={handleIframeLoad}
              style={{ display: iframeLoaded ? 'block' : 'none' }}
            ></iframe>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameModal;