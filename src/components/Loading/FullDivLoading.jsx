import { useEffect, useState } from "react";

const FullDivLoading = ({ show = false }) => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      setProgress(0);

      // Simulate loading: fast to 90%
      const timer1 = setTimeout(() => setProgress(70), 100);
      const timer2 = setTimeout(() => setProgress(90), 400);

      // Complete when game loads (you'll trigger hide externally)
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    } else {
      // Complete animation then hide
      if (isVisible) {
        setProgress(100);
        const timer = setTimeout(() => {
          setIsVisible(false);
          setProgress(0);
        }, 400); // match fade-out duration
        return () => clearTimeout(timer);
      }
    }
  }, [show]);

  if (!isVisible) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[999999] pointer-events-none"
      style={{
        height: "3px",
        background: "rgba(179, 113, 255, 0.2)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          height: "100%",
          width: "100%",
          background: "rgb(179, 113, 255)",
          transform: `translateX(-${100 - progress}%)`,
          transition: progress === 100 
            ? "transform 0.3s ease-out, opacity 0.4s ease-out 0.3s" 
            : "transform 0.4s cubic-bezier(0.2, 0.8, 0.4, 1)",
          opacity: progress === 100 ? 0 : 1,
          transformOrigin: "left center",
        }}
      />
    </div>
  );
};

export default FullDivLoading;