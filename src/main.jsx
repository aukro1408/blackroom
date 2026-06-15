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
import WatchPage from './pages/WatchPage'
import CollectionPage from './pages/CollectionPage'
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
          <Route path="/collection/:type"element={<CollectionPage />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/watch/:id" element={<WatchPage />} />
        </Route>

      </Routes>

    </BrowserRouter>

  </React.StrictMode>,
)

// Register service worker
if ('serviceWorker' in window) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then((registration) => {
      console.log('Service Worker registered with scope:', registration.scope)
    }).catch((error) => {
      console.log('Service Worker registration failed:', error)
    })
  })
}