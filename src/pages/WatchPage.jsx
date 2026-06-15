import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import EmbedPlayer from "../components/EmbedPlayer"
import { API_URL } from "../config/api"

export default function WatchPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [embedUrl, setEmbedUrl] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const initWatchFlow = async () => {
      try {
        console.log('WatchPage: Starting watch flow for title:', id)
        
        // Step 1: Search for provider ID by title
        console.log('WatchPage: Step 1 - Searching for provider ID')
        const searchResponse = await fetch(`${API_URL}/search-movie?title=${encodeURIComponent(id)}`)
        const searchData = await searchResponse.json()
        
        console.log('WatchPage: Search response:', searchData)
        
        if (searchData.error) {
          throw new Error(searchData.error)
        }
        
        const providerId = searchData.providerId
        console.log('WatchPage: Provider ID found:', providerId)
        
        // Step 2: Get embed URL using provider ID
        console.log('WatchPage: Step 2 - Getting embed URL')
        const streamResponse = await fetch(`${API_URL}/watch-stream/${providerId}`)
        const streamData = await streamResponse.json()
        
        console.log('WatchPage: Stream response:', streamData)
        
        if (streamData.error) {
          throw new Error(streamData.error)
        }
        
        const embedUrl = streamData.embedUrl
        console.log('WatchPage: Embed URL found:', embedUrl)
        
        setEmbedUrl(embedUrl)
        
      } catch (error) {
        console.error('WatchPage: Error:', error)
        setError(error.message)
      }
    }
    
    initWatchFlow()
  }, [id])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white pb-[100px]">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 z-50 rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-md transition-all duration-200 hover:bg-white/20 active:scale-95"
      >
        ← Назад
      </button>

      {error ? (
        <div className="text-center">
          <p className="text-lg mb-4">Ошибка: {error}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-red-600 rounded-lg"
          >
            Вернуться
          </button>
        </div>
      ) : embedUrl ? (
        <EmbedPlayer embedUrl={embedUrl} />
      ) : (
        <p className="text-lg">Загрузка...</p>
      )}
    </div>
  )
}