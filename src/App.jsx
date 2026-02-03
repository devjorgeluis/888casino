import { useState, useEffect, useContext } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { AppContext } from "./AppContext";
import ErrorBoundary from "./ErrorBoundary";
import AppRoutes from "./Routes";
import "animate.css";
import './css/casino.css'

function App() {
  const [config, setConfig] = useState({
    faviconURL: "/vite.svg",
    pageTitle: "Título",
  });

  const { contextData, setContextData } = useContext(AppContext);

  useEffect(() => {
    document.title = contextData.pageTitle;
    setConfig(config);
  }, []);

  // crea funcion para eliminar elementos del DOM
  Element.prototype.remove = function () {
    this.parentElement.removeChild(this);
  };
  NodeList.prototype.remove = HTMLCollection.prototype.remove = function () {
    for (var i = this.length - 1; i >= 0; i--) {
      if (this[i] && this[i].parentElement) {
        this[i].parentElement.removeChild(this[i]);
      }
    }
  };

  return (
    <Router>
      <ErrorBoundary fallback={<p>Something went wrong</p>}>
        <AppRoutes />
      </ErrorBoundary>
    </Router>
  );
}

export default App;