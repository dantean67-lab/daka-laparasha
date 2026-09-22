"use client";

import { useEffect, useRef, useState } from "react";

// A light "click to play" stand-in for the YouTube player. The real player (an iframe from
// youtube-nocookie.com) is only loaded after the visitor taps, so the page stays fast.
//
// Thumbnail: for a vertical Short, YouTube's "oardefault" image is a true 1215x2160 vertical
// picture (sharp on a phone). "maxresdefault" is a wide picture with the vertical frame only
// 405px wide in the middle, and "hqdefault" is smaller still, so they are used only as
// fallbacks, cropped to the middle by object-fit: cover. A missing image comes back as a
// tiny 120px placeholder or an error, and both make us try the next one.
const THUMBNAILS = ["oardefault", "maxresdefault", "hqdefault"] as const;
const PLACEHOLDER_MAX_WIDTH = 130;

export default function VideoFacade({ videoId, title }: { videoId: string; title: string }) {
  const [playing, setPlaying] = useState(false);
  const [level, setLevel] = useState(0); // which thumbnail we are on; THUMBNAILS.length = give up
  const imgRef = useRef<HTMLImageElement>(null);

  const tryNext = () => setLevel((current) => Math.min(current + 1, THUMBNAILS.length));

  // If the image already failed or finished loading before this code started, no event will
  // arrive, so look at it directly.
  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth <= PLACEHOLDER_MAX_WIDTH) tryNext();
  }, [level]);

  return (
    <div className="video-frame">
      {playing ? (
        <iframe
          className="absolute inset-0 h-full w-full border-0"
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&playsinline=1&rel=0`}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      ) : (
        <button type="button" className="video-play" onClick={() => setPlaying(true)} aria-label={`הפעלת הסרטון: ${title}`}>
          {level < THUMBNAILS.length && (
            // eslint-disable-next-line @next/next/no-img-element -- external YouTube image, deliberately not optimized
            <img
              key={level}
              ref={imgRef}
              src={`https://i.ytimg.com/vi/${videoId}/${THUMBNAILS[level]}.jpg`}
              alt=""
              className="h-full w-full object-cover"
              decoding="async"
              referrerPolicy="no-referrer"
              onError={tryNext}
              onLoad={(event) => {
                if (event.currentTarget.naturalWidth <= PLACEHOLDER_MAX_WIDTH) tryNext();
              }}
            />
          )}
          <span className="video-play-icon" aria-hidden="true">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z" />
            </svg>
          </span>
        </button>
      )}
    </div>
  );
}
