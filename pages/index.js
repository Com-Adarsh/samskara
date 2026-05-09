import { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchArtisticSubmissions } from '../utils/GoogleSheetLib';
import Footer from '../components/Footer'; // Your new premium footer

// Core Components
import IntroSplash from '../components/IntroSplash';
import PhotoGallery from '../components/PhotoGallery';
import ProcessSlider from '../components/ProcessSlider';
import InstagramFeed from '../components/InstagramFeed';
import FilterBar from '../components/FilterBar';

// Form & Story
import DetailsForm from '../components/DetailsForm';
import StoryEntry from '../components/StoryEntry';

export default function Home() {
  const [step, setStep] = useState('splash');
  const [activeTab, setActiveTab] = useState('All');
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchArtisticSubmissions();
        setSubmissions(data || []);
      } catch (error) {
        console.error("Error loading Samskara data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredData = submissions.filter(item => 
    activeTab === 'All' ? true : item.type === activeTab
  );

  const featuredPainting = submissions.find(item => item.type === 'Painting');

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh' }}>
      <Head>
        <title>SAMSKARA | CUSAT Artistic Collective</title>
        <link href="https://fonts.googleapis.com/css2?family=Syncopate:wght@700&family=Inter:wght@300;600&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
      </Head>

      <AnimatePresence mode="wait">
        {/* PHASE 1: THE INTRO VIDEO */}
        {step === 'splash' && (
          <IntroSplash key="splash" onComplete={() => setStep('details')} />
        )}

        {/* PHASE 2: COLLECTING USER DETAILS */}
        {step === 'details' && (
          <DetailsForm key="details" onNext={() => setStep('story')} />
        )}

        {/* PHASE 3: THE STORY WRITING PORTAL */}
        {step === 'story' && (
          <StoryEntry key="story" onFinish={() => setStep('gallery')} />
        )}

        {/* PHASE 4: THE MAIN GALLERY HUB */}
        {step === 'gallery' && (
          <motion.div 
            key="gallery"
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            <FilterBar activeTab={activeTab} setActiveTab={setActiveTab} />

            {(activeTab === 'All' || activeTab === 'Painting') && featuredPainting && (
              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>Featured Process</h2>
                <ProcessSlider 
                  sketch={featuredPainting.sketchUrl} 
                  final={featuredPainting.url} 
                  artistName={featuredPainting.artist} 
                />
              </section>
            )}

            <section style={styles.section}>
              <PhotoGallery photos={filteredData} />
            </section>

            <InstagramFeed />

            {/* THE NEW PREMIUM FOOTER PLACED HERE */}
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const styles = {
  section: {
    padding: '40px 0',
  },
  sectionTitle: {
    fontFamily: "'Syncopate', sans-serif",
    textAlign: 'center',
    color: 'transparent',
    WebkitTextStroke: '1px #FFD700',
    fontSize: '2.5rem',
    textTransform: 'uppercase',
    letterSpacing: '4px',
    marginBottom: '30px'
  }
};
