import { useEffect, useState, useRef } from 'react';
import { Howl } from 'howler';

interface SplashScreenProps {
  onComplete: () => void;
}

// Generate all 93 image URLs from GitHub
const generateImageUrls = () => {
  const imageNames = [
    '1771433126928',
    '1771450086167',
    '1771450112516',
    '1771450119282',
    '1771450124040',
    '1771450128563',
    '1771450134569',
    '1771450137830',
    '1771450145593',
    '1771450152652',
    '1771450161590',
    '1771450165771',
    '1771450169494',
    '1771450175355',
    '1771450178930',
    '1771450185930',
    '1771454566323',
    '1771454570753',
    '1771454573769',
    '1771455009621',
    '1771455014978',
    '1771455018976',
    '1771455021793',
    '1771455025117',
    '1771455028104',
    '1771455031605',
    '1771455038195',
    '1771455044938',
    '1771455048781',
    '1771455455037',
    '1771455458865',
    '1771455462317',
    '1771455465447',
    '1771455468799',
    '1771455472464',
    '1771455475432',
    '1771455478456',
    '1771455481883',
    '1771455485246',
    '1771455489115',
    '1771455492600',
    '1771455496149',
    '1771455499928',
    '1771455503033',
    '1771455506864',
    '1771455530401',
    '1771455551591',
    '1771455572334',
    '1771455618517',
    '1771455622916',
    '1771456769315',
    '1771456773066',
    '1771456776315',
    '1771456779890',
    '1771456795842',
    '1771456799962',
    '1771456804297',
    '1771456809326',
    '1771456817592',
    '1771456826518',
    '1771456857970',
    '1771456860739',
    '1771456864473',
    '1771456869556',
    '1771456876408',
    '1771456893409',
    '1771456899259',
    '1771456902953',
    '1771456916834',
    '1771456930001',
    '1771456934021',
    '1771456937220',
    '1771456944109',
    '1771456954935',
    '1771456961984',
    '1771456989079',
    '1771456992538',
    '1771456996044',
    '1771457001719',
    '1771457013472',
    '1771457035143',
    '1771457781030',
    '1771457785045',
    '1771457788659',
    '1771457793258',
    '1771457796812',
    '1771457802706',
    '1771457806164',
    '1771457811296',
    '1771457814221',
    '1771457818307',
    '1771457821867',
    '1771457825671',
    '1771457834493'
  ];

  // GitHub raw URL - removed duplicate folder name in path
  const baseUrl = 'https://raw.githubusercontent.com/richardewebb37-art/Designnavigationstructure/main/src/assets';
  const urls = imageNames.map(name => `${baseUrl}/${name}.png`);
  
  console.log('🔗 First image URL:', urls[0]);
  console.log('🔗 Last image URL:', urls[urls.length - 1]);
  
  return urls;
};

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [opacity, setOpacity] = useState(0);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const audioRef = useRef<Howl | null>(null);
  const imageRefs = useRef<HTMLImageElement[]>([]);
  const animationRef = useRef<number | null>(null);

  const imageUrls = generateImageUrls();

  console.log('🎬 SplashScreen component rendered!');
  console.log('  Total frames:', imageUrls.length);

  // Preload all images
  useEffect(() => {
    console.log('🎬 Preloading', imageUrls.length, 'animation frames...');
    
    let loadedCount = 0;
    const totalImages = imageUrls.length;

    imageUrls.forEach((url, index) => {
      const img = new Image();
      img.src = url;
      
      img.onload = () => {
        loadedCount++;
        console.log(`  📸 Loaded frame ${loadedCount}/${totalImages}`);
        
        if (loadedCount === totalImages) {
          console.log('  ✅ All frames loaded!');
          setImagesLoaded(true);
        }
      };

      img.onerror = () => {
        console.warn(`  ⚠️ Failed to load frame ${index + 1}: ${url}`);
        loadedCount++;
        
        if (loadedCount === totalImages) {
          console.log('  ✅ Preload complete (with some errors)');
          setImagesLoaded(true);
        }
      };

      imageRefs.current[index] = img;
    });
  }, []);

  // Animation loop
  useEffect(() => {
    if (!imagesLoaded) return;

    console.log('🎬 Starting animation sequence...');

    // Fade in
    const fadeIn = setTimeout(() => {
      console.log('  ✅ Fading in');
      setOpacity(1);
    }, 100);

    // Frame animation - 24 FPS (cinematic feel)
    // 93 frames at 24 FPS = ~3.875 seconds per loop
    // Play it twice for ~7.75 seconds total
    const frameInterval = 1000 / 24;
    let frameCount = 0;
    const totalLoops = 2;
    const totalFrames = imageUrls.length * totalLoops;

    const animateFrames = () => {
      if (frameCount < totalFrames) {
        setCurrentFrame(frameCount % imageUrls.length);
        frameCount++;
        animationRef.current = window.setTimeout(animateFrames, frameInterval);
      } else {
        // Hold on last frame
        console.log('  🎞️ Animation sequence complete');
      }
    };

    // Start animation after brief delay
    const startAnimation = setTimeout(() => {
      animateFrames();
    }, 300);

    // Total duration: animation (7.75s) + hold (0.5s) = ~8.25s
    const animationDuration = (imageUrls.length * totalLoops * frameInterval);
    const holdDuration = animationDuration + 500;

    // Fade out
    const fadeOut = setTimeout(() => {
      console.log('  ⬇️ Fading out');
      setOpacity(0);
    }, holdDuration);

    // Complete
    const complete = setTimeout(() => {
      console.log('  🎉 SplashScreen complete - calling onComplete');
      if (audioRef.current) {
        audioRef.current.fade(audioRef.current.volume(), 0, 500);
      }
      onComplete();
    }, holdDuration + 1500);

    // Cleanup
    return () => {
      clearTimeout(fadeIn);
      clearTimeout(startAnimation);
      clearTimeout(fadeOut);
      clearTimeout(complete);
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
      
      if (audioRef.current) {
        audioRef.current.unload();
      }
    };
  }, [imagesLoaded, onComplete, imageUrls.length]);

  return (
    <div className="fixed inset-0 z-[100] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center overflow-hidden">
      {/* Loading indicator */}
      {!imagesLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-yellow-400 font-bold text-xl tracking-tight">
              Loading Animation...
            </p>
          </div>
        </div>
      )}

      {/* Animation frames */}
      {imagesLoaded && (
        <div
          className="relative z-10 w-full h-full flex items-center justify-center"
          style={{
            opacity: opacity,
            transition: 'opacity 1.5s ease-in-out',
          }}
        >
          <img
            src={imageUrls[currentFrame]}
            alt={`Animation frame ${currentFrame + 1}`}
            className="max-w-[90vw] max-h-[90vh] object-contain"
            style={{
              filter: 'drop-shadow(0 0 30px rgba(251, 191, 36, 0.3))',
            }}
          />
        </div>
      )}
    </div>
  );
}