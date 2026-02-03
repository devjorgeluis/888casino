import { createRoot } from 'react-dom/client'
import AppContextProvider from './AppContext.jsx'

import './css/sidebar.css'
import './css/default.css'
import './css/fortunajuegos.css'

import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <AppContextProvider>
      <App className="normal-mode app-mode"/>
    </AppContextProvider>
  // </StrictMode>
)