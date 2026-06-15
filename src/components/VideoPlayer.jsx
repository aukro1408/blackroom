import { useRef, useEffect } from "react";
import Hls from "hls.js";

export default function VideoPlayer({ url }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !url) return;

    if (Hls.isSupported()) {
      const hls = new Hls({
        debug: true
      });

      console.log("Loading stream:", url);

      hls.attachMedia(video);

      hls.on(Hls.Events.MEDIA_ATTACHED, () => {
        console.log("MEDIA ATTACHED");
        hls.loadSource(url);
      });

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log("MANIFEST LOADED");
      });

      hls.on(Hls.Events.LEVEL_LOADED, () => {
        console.log("LEVEL LOADED");
      });

      hls.on(Hls.Events.FRAG_LOADING, (event, data) => {
        console.log("FRAGMENT LOADING:", data);
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error("HLS ERROR:", data);
      });

      return () => {
        hls.destroy();
      };

    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = url;
      console.log("Native HLS");
    }

  }, [url]);

  return (
    <video
      ref={videoRef}
      controls
      playsInline
      style={{
        width: "800px",
        height: "450px",
        borderRadius: "12px",
        backgroundColor: "black",
      }}
    />
  );
}