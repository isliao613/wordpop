import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { syncHtmlLang } from './i18n.js'
import { registerSW } from './sw-register.js'

syncHtmlLang()
registerSW()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
