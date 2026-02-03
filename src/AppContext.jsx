import React, { createContext, useState, useEffect } from "react";
export const AppContext = createContext(null);

// este bloque de código se ejecuta antes de renderizar la página
// y contiene las variables globales de la aplicación (contextData)
const AppContextProvider = (props) => {
  let apiBaseUrl = import.meta.env.VITE_API_URL;
  let cdnUrl = import.meta.env.VITE_CDN_URL;
  let pageTitle = import.meta.env.VITE_PAGE_TITLE;
  let buildMode = import.meta.env.MODE;

  const getSessionFromStorage = () => {
    if (
      localStorage.getItem("session") &&
      localStorage.getItem("session") !== "undefined"
    ) {
      return JSON.parse(localStorage.getItem("session"));
    }
    return null;
  };

  let isMobile = navigator.userAgent.match(
    /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i
  );
  isMobile = (isMobile && (window.screen.width < 992));

  const [contextData, setContextData] = useState({
    apiBaseUrl: apiBaseUrl,
    cdnUrl: cdnUrl,
    buildMode: buildMode,
    session: getSessionFromStorage(),
    isMobile: isMobile,
    pageTitle: pageTitle,
  });

  const updateSession = (newSession) => {
    setContextData(prev => ({
      ...prev,
      session: newSession
    }));
  };
  
  return (
    <AppContext.Provider value={{ contextData, setContextData, updateSession }}>
      {props.children}
    </AppContext.Provider>
  );
};
export default AppContextProvider;
