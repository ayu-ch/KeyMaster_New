import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter, BrowserRouter as Router } from "react-router-dom";
import './App.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  
    <Router>
    <App />
    </Router>
 
)
