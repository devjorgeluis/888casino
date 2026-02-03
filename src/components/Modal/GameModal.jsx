import { useContext, useState, useEffect } from "react";
import { AppContext } from "../../AppContext";
import LoadCasino from "../Loading/LoadCasino";

const GameModal = ({
  gameUrl,
  gameName,
  gameImg,
  provider,
  onClose,
  isMobile,
  launchInNewTab,
}) => {
  const { contextData } = useContext(AppContext);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

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
    <div className="relative w-full">
      {/* Background Image */}
      <div className="relative flex h-dvh w-full flex-col max-h-[calc((100svh_+_1.75rem)_-_(var(--header-inner-height,_4.75rem)_+_var(--game-header-height,3.75rem)_+_var(--pwa-prompt-height,0px)_+_2rem))]">
        <div className="absolute inset-0 -top-20 -z-[1] h-full w-full [mask-image:radial-gradient(50%_65.21%_at_50%_0%,#FFF_0%,rgba(0,0,0,0)_100%)]">
          <img
            src={gameImg || "//static.everymatrix.com/cms2/base/_casino/5/5AFF597602068FAA76346A403EB5D02C.jpg"}
            alt="Game background"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>

        {/* Header */}
        <div className="container z-10 grow-0 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white/50">
              <span className="mr-4 uppercase text-white">{gameName || "Joker's Jewels™"}</span>
              <span>{provider}</span>
            </h2>

            <div className="flex gap-2">
              {/* Fullscreen */}
              <button
                onClick={toggleFullscreen}
                className="rounded-lg bg-theme-secondary-500 p-2 text-theme-primary-950 transition hover:bg-theme-secondary-600 focus:outline-none focus:ring-2 focus:ring-theme-secondary-500 focus:ring-offset-2 focus:ring-offset-transparent"
                aria-label="Pantalla completa"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 8V6a2 2 0 0 1 2-2h2M4 16v2a2 2 0 0 0 2 2h2m8-16h2a2 2 0 0 1 2 2v2m-4 12h2a2 2 0 0 0 2-2v-2" />
                </svg>
              </button>

              {/* Favorite */}
              <button
                className="rounded-lg bg-theme-secondary-500 p-2 text-theme-primary-950 transition hover:bg-theme-secondary-600 focus:outline-none focus:ring-2 focus:ring-theme-secondary-500 focus:ring-offset-2 focus:ring-offset-transparent"
                aria-label="Añadir a favoritos"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19.5 12.572L12 20l-7.5-7.428A5 5 0 1 1 12 6.006a5 5 0 1 1 7.5 6.572" />
                </svg>
              </button>

              {/* Close */}
              <button
                onClick={onClose}
                className="rounded-lg bg-theme-secondary-500 p-2 text-theme-primary-950 transition hover:bg-theme-secondary-600 focus:outline-none focus:ring-2 focus:ring-theme-secondary-500 focus:ring-offset-2 focus:ring-offset-transparent"
                aria-label="Cerrar"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Game Iframe Container */}
        <div className="container relative flex-1 py-4">
          {/* Loading Overlay */}
          {!iframeLoaded && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/30">
              <LoadCasino />
            </div>
          )}

          {/* Only render iframe when gameUrl is valid */}
          {gameUrl && (
            <iframe
              src={gameUrl}
              className="h-full w-full rounded-2xl border-0 shadow-2xl"
              allow="fullscreen; camera; microphone"
              title={gameName}
              onLoad={handleIframeLoad}
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-top-navigation-by-user-activation"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default GameModal;