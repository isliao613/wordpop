import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { syncHtmlLang } from './i18n.js'

syncHtmlLang()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
