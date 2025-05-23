"use client"

import React, { useState } from 'react';
import { Question, CodeSnippets } from '../types';

interface YouTubePlayerProps {
  selectedQuestion: Question;
  selectedLanguage: keyof CodeSnippets;
}

// Language display names
const languageDisplayNames: Record<string, string> = {
  'python': 'Python',
  'r': 'R',
  'cpp': 'C++',
  'spss': 'SPSS',
  'excel': 'Excel'
};

// Interface for a video item
interface VideoItem {
  language: string;
  url: string;
  videoId: string;
}

// Video thumbnail component
const VideoThumbnail: React.FC<{ 
  videoId: string; 
  language: string; 
  onClick: () => void;
}> = ({ videoId, language, onClick }) => {
  return (
    <div 
      className="relative cursor-pointer pb-[56.25%] h-0 overflow-hidden rounded-md bg-black"
      onClick={onClick}
    >
      {/* YouTube thumbnail preview */}
      <img 
        src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`} 
        alt={`${language} Tutorial Thumbnail`}
        onError={(e) => {
          // If maxresdefault fails, fall back to hqdefault
          (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
        }}
        className="absolute top-0 left-0 w-full h-full object-cover"
      />
      
      {/* Play button overlay */}
      <div className="absolute flex items-center justify-center inset-0">
        <div className="bg-red-600 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8 text-white ml-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
      
      {/* Video title/language indicator */}
      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white px-4 py-2">
        <p className="font-medium text-sm sm:text-base">
          {languageDisplayNames[language] || language} Tutorial
        </p>
      </div>
    </div>
  );
};

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({
  selectedQuestion,
  selectedLanguage,
}) => {
  // State to track which video is currently playing (if any)
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  
  // Get video ID from link
  const getVideoId = (url: string): string | null => {
    if (!url) return null;
    
    // YouTube URL patterns
    const regExp = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ ]{11})/i;
    const match = url.match(regExp);
    
    return match && match[1] ? match[1] : null;
  };

  // Get all available videos for the question
  const getAvailableVideos = (): VideoItem[] => {
    if (!selectedQuestion.youTubeLink) return [];
    
    const videos: VideoItem[] = [];
    const languages = ['python', 'r', 'cpp', 'spss', 'excel'] as const;
    
    // Collect all available video links
    for (const lang of languages) {
      const url = selectedQuestion.youTubeLink[lang];
      if (url) {
        const videoId = getVideoId(url);
        if (videoId) {
          videos.push({
            language: lang,
            url,
            videoId
          });
        }
      }
    }
    
    return videos;
  };

  const availableVideos = getAvailableVideos();
  
  // If no videos are available, don't render anything
  if (availableVideos.length === 0) {
    return null;
  }
  // Make the selected language video first in the list if available
  const orderedVideos = [...availableVideos];
  const selectedLangVideoIndex = orderedVideos.findIndex(v => v.language === selectedLanguage);
  if (selectedLangVideoIndex > 0) {
    const selectedVideo = orderedVideos.splice(selectedLangVideoIndex, 1)[0];
    orderedVideos.unshift(selectedVideo);
  }
  
  return (
    <div className="mt-6 bg-[var(--card-bg)] p-4 rounded-lg border border-[var(--border-color)] shadow-sm">
      <h3 className="text-lg font-semibold mb-3 text-[var(--accent)]">Video Tutorials</h3>
      
      {playingVideo ? (
        <>
          <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-md mb-4">
            <iframe 
              className="absolute top-0 left-0 w-full h-full"
              src={`https://www.youtube.com/embed/${playingVideo}?autoplay=1`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <button 
            onClick={() => setPlayingVideo(null)}
            className="mb-4 px-4 py-2 bg-[var(--accent)] text-[var(--accent-foreground)] rounded-md hover:opacity-90 transition-opacity flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to video selection
          </button>
        </>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
          {orderedVideos.map((video) => (
            <div key={video.videoId} className="flex flex-col">
              <VideoThumbnail 
                videoId={video.videoId}
                language={video.language}
                onClick={() => setPlayingVideo(video.videoId)}
              />
              <div className="mt-2 text-sm text-[var(--text-secondary)]">
                <p className="font-medium">{languageDisplayNames[video.language] || video.language} Tutorial</p>
                <a 
                  href={video.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-[var(--accent)] hover:underline flex items-center mt-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Open in YouTube
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <p className="text-sm text-[var(--text-secondary)] mt-2 border-t border-[var(--border-color)] pt-2">
        <span className="font-medium">Note:</span> Video tutorials for Question {selectedQuestion.id} are available in {orderedVideos.length} {orderedVideos.length === 1 ? 'language' : 'languages'}.
      </p>
    </div>
  );
};

export default YouTubePlayer;
