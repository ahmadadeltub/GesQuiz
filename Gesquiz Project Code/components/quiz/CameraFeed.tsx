import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Spinner } from '../common/Spinner';
import { Gesture } from '../../types';
import { GESTURE_OPTIONS } from '../../constants';

interface CameraFeedProps {
  onCameraReady: (captureFunc: () => string | null) => void;
  width?: number;
  height?: number;
  detectedGesture: Gesture | null;
  overlayRenderer?: (ctx: CanvasRenderingContext2D) => void;
  stabilityCounter?: number;
  stabilityThreshold?: number;
}

export const CameraFeed: React.FC<CameraFeedProps> = ({ 
  onCameraReady, 
  width = 640, 
  height = 480, 
  detectedGesture, 
  overlayRenderer,
  stabilityCounter = 0,
  stabilityThreshold = 1,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const gestureInfo = detectedGesture ? GESTURE_OPTIONS.find(g => g.gesture === detectedGesture) : null;
  const progress = Math.min(stabilityCounter / stabilityThreshold, 1);
  const circumference = 2 * Math.PI * 45; // 2 * pi * radius (radius is 45)
  const strokeDashoffset = circumference - progress * circumference;

  useEffect(() => {
    const enableCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width, height, facingMode: 'user' },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsLoading(false);
      } catch (err) {
        console.error("Error accessing camera:", err);
        setError("Could not access camera. Please check permissions.");
        setIsLoading(false);
      }
    };

    enableCamera();

    return () => {
      // Cleanup: stop video tracks on unmount
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, height]);
  
  const captureFrame = useCallback((): string | null => {
      if (videoRef.current && canvasRef.current) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext('2d');
        if (context) {
          context.save();
          context.scale(-1, 1);
          context.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
          context.restore();

          if (overlayRenderer) {
              overlayRenderer(context);
          }

          return canvas.toDataURL('image/jpeg').split(',')[1];
        }
      }
      return null;
  }, [overlayRenderer]);
  
  useEffect(() => {
    if(!isLoading && !error){
        onCameraReady(captureFrame);
    }
  }, [isLoading, error, onCameraReady, captureFrame])

  return (
    <div className="relative w-full max-w-2xl mx-auto bg-gray-900 rounded-lg overflow-hidden shadow-lg border-4 border-gray-700">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-auto transform -scale-x-100"
        aria-label="Live camera feed for gesture recognition"
      />
      <canvas ref={canvasRef} className="hidden" aria-hidden="true" />
      {gestureInfo && (
        <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white p-4 rounded-xl shadow-lg flex flex-col items-center justify-center" role="status" aria-live="polite">
            <div className="relative w-28 h-28 flex items-center justify-center">
                 <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                        className="text-gray-600"
                        stroke="currentColor"
                        strokeWidth="10"
                        cx="50"
                        cy="50"
                        r="45"
                        fill="transparent"
                    />
                    <circle
                        className="text-primary-light"
                        stroke="currentColor"
                        strokeWidth="10"
                        strokeLinecap="round"
                        cx="50"
                        cy="50"
                        r="45"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        style={{ transition: 'stroke-dashoffset 0.3s ease-in-out' }}
                    />
                </svg>
                <span className="text-5xl" aria-hidden="true">{gestureInfo.icon}</span>
            </div>
            <span className="text-2xl font-bold mt-2">Choice {gestureInfo.label}</span>
        </div>
      )}
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-75" role="status">
          <Spinner />
          <p className="text-white mt-2">Starting camera...</p>
        </div>
      )}
      {error && (
         <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-900 bg-opacity-75 p-4" role="alert">
          <p className="text-white text-center font-semibold">{error}</p>
        </div>
      )}
    </div>
  );
};
