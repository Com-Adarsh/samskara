import { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchArtisticSubmissions } from '../utils/GoogleSheetLib';

// Components
import IntroSplash from '../components/IntroSplash';
import DetailsForm from '../components/DetailsForm';
import CreativeWall from '../components/CreativeWall'; 
import Footer from '../components/Footer';

export default function Home() {
  const [step, setStep] = useState('splash');
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  // ഗാലറിയിലേക്ക് വേണ്ട ഡാറ്റ ലോഡ് ചെയ്യുന്നു
  const loadData = async () => {
    try {
      const data = await fetchArtisticSubmissions();
      setSubmissions(data || []);
    } catch (error) {
      console.error("Error loading Samskara data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', overflowX: 'hidden' }}>
      <Head>
        <title>SAMSKARA | CUSAT Artistic Collective</title>
        <link href="https://fonts.googleapis.com/css2?family=Syncopate:wght@700&family=Inter:wght@300;600&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
      </Head>

      <AnimatePresence mode="wait">
        {/* 1. ആനിമേഷൻ സ്പ്ലാഷ് സ്ക്രീൻ */}
        {step === 'splash' && (
          <IntroSplash 
            key="splash" 
            onComplete={() => {
              const isRegistered = localStorage.getItem('isRegistered');
              setStep(isRegistered === 'true' ? 'gallery' : 'details');
            }} 
          />
        )}

        {/* 2. രജിസ്ട്രേഷൻ ഫോം (രജിസ്റ്റർ ചെയ്യാത്തവർക്ക് മാത്രം) */}
        {step === 'details' && (
          <DetailsForm 
            key="details" 
            onNext={() => {
              localStorage.setItem('isRegistered', 'true');
              setStep('gallery');
            }} 
          />
        )}

        {/* 3. പ്രധാന ഗാലറി കംപോണന്റ് (CreativeWall) */}
        {step === 'gallery' && (
          <motion.div 
            key="gallery"
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 1 }}
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {/* 
              ഗാലറി, ഫിൽട്ടർ, അപ്‌ലോഡ് ഫോം എന്നിവയെല്ലാം CreativeWall-ലേക്ക് മാറ്റി.
              ഇവിടെ refreshData പ്രോപ്പ് നൽകുന്നത് അപ്‌ലോഡ് കഴിഞ്ഞാലുടൻ ലിസ്റ്റ് പുതുക്കാൻ സഹായിക്കും.
            */}
            <CreativeWall 
              submissions={submissions} 
              refreshData={loadData} 
              loading={loading}
            />
            
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
