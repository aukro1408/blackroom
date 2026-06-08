import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom'

import './index.css'

import Home from './pages/Home'
import Horror from './pages/Horror'
import Movie from './pages/Movie'
import Detective from './pages/Detective'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>

    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/horror" element={<Horror />} />

        <Route path="/movie" element={<Movie />} />

        <Route path="/detective" element={<Detective />} />

      </Routes>

    </BrowserRouter>

  </React.StrictMode>,
)