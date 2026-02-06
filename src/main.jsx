import { createRoot } from 'react-dom/client'
import AppContextProvider from './AppContext.jsx'

import './css/casino-top-section.css'
import './css/casino-top-banner-slider.css'
import './css/casino-seo-content-container.css'
import './css/casino-offer-banner.css'
import './css/casino-footer-v2.css'
import './css/orbit-foundation.min.css'
import './css/sidebar.css'
import './css/default.css'
import './css/888casino.css'
import './css/cashier.css'

import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <AppContextProvider>
      <App className="normal-mode app-mode"/>
    </AppContextProvider>
  // </StrictMode>
)