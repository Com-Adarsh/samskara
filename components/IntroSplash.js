import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function IntroSplash({ onComplete }) {
  const [isVisible, setIsVisible] = useState(true);

  // Fallback: Reveal the site after 6 seconds if video fails
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 1200);
    }, 6000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          style={styles.container}
        >
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            style={styles.videoWrapper}
          >
            <video 
              autoPlay 
              muted 
              playsInline
              onEnded={() => {
                setIsVisible(false);
                setTimeout(onComplete, 1200);
              }}
              style={styles.video}
            >
              <source 
                src="https://raw.githubusercontent.com/Com-Adarsh/Samskara-Cusat/main/Public/SAMSKARA_Title_.mp4" 
                type="video/mp4" 
              />
              Your browser does not support the video tag.
            </video>

            <div style={styles.textOverlay}>
              <h1 style={styles.title}>SAMSKARA</h1>
              <p style={styles.subtitle}>CUSAT ARTISTIC COLLECTIVE</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const styles = {
  container: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: '#000000',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    overflow: 'hidden'
  },
  videoWrapper: {
    position: 'relative',
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  video: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    mixBlendMode: 'screen', 
    filter: 'contrast(1.2) brightness(0.8)',
  },
  textOverlay: {
    position: 'absolute',
    textAlign: 'center',
    pointerEvents: 'none',
    zIndex: 2
  },
  title: {
    fontFamily: "'Syncopate', sans-serif",
    fontSize: '3.5rem',
    color: '#FF0000',
    letterSpacing: '12px',
    margin: 0,
    fontWeight: '700',
    textShadow: '0 0 20px rgba(255, 0, 0, 0.5)'
  },
  subtitle: {
    fontFamily: "'Inter', sans-serif",
    color: '#FFFFFF',
    marginTop: '10px',
    letterSpacing: '5px',
    fontSize: '0.8rem',
    opacity: 0.8
  }
};
