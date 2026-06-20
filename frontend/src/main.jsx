import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom'
import './index.css'
import App from './App.jsx'

import "@fontsource/dm-sans";
import "@fontsource/dm-sans/900";
import "@fontsource/dm-sans/500";
import "@fontsource/dm-sans/600";
import "@fontsource/dm-sans/400";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <App />
    </BrowserRouter>
  </StrictMode>,
)
