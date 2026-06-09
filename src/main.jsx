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
import MovieDetails from './pages/MovieDetails'
import Search from './pages/Search'
import Actor from './pages/Actor'
import Favorites from './pages/Favorites'
import MainLayout from './components/MainLayout'
import ScrollToTop from './components/ScrollToTop'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>

    <BrowserRouter>

      <ScrollToTop />

      <Routes>

        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/actor/:id" element={<Actor />} />
          <Route path="/horror" element={<Horror />} />
          <Route path="/thriller" element={<Movie />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/scifi" element={<Detective />} />
          <Route path="/favorites" element={<Favorites />} />
        </Route>

      </Routes>

    </BrowserRouter>

  </React.StrictMode>,
)