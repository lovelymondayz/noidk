import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { initializeApi } from './services/api'
import { useAuthStore } from './store/authStore'

initializeApi(() => useAuthStore.getState().accessToken)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
