import { useEffect, useRef, useState } from 'react'

export default function EmbedPlayer({ embedUrl }) {
  const iframeRef = useRef(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const handleIframeLoad = () => {
    console.log('EmbedPlayer: iframe loaded successfully')
    setLoading(false)
  }

  const handleIframeError = () => {
    console.error('EmbedPlayer: iframe failed to load')
    setError('Failed to load player')
    setLoading(false)
  }

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-black">
      {error ? (
        <div className="text-center text-white">
          <p className="text-lg mb-4">Player failed to load</p>
          <p className="text-sm text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => window.open(embedUrl, '_blank')}
            className="px-4 py-2 bg-red-600 rounded-lg"
          >
            Open in new window
          </button>
        </div>
      ) : (
        <iframe
          ref={iframeRef}
          src={embedUrl}
          className="h-full w-full border-0"
          allowFullScreen
          allow="autoplay; encrypted-media; picture-in-picture"
          title="Video Player"
          onLoad={handleIframeLoad}
          onError={handleIframeError}
        />
      )}
    </div>
  )
}
