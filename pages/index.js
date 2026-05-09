import { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchArtisticSubmissions } from '../utils/GoogleSheetLib';
import Footer from '../components/Footer';

// Core Components
import IntroSplash from '../components/IntroSplash';
import PhotoGallery from '../components/PhotoGallery';
import ProcessSlider from '../components/ProcessSlider';
import InstagramFeed from '../components/InstagramFeed';
import FilterBar from '../components/FilterBar';

// Form Components
import DetailsForm from '../components/DetailsForm';

export default function Home() {
  const [step, setStep] = useState('splash');
  const [activeTab, setActiveTab] = useState('All');
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const scriptURL = 'https://script.google.com/macros/s/AKfycbxzj7vxNbt3Kn6ET1Q_ik_8dS7skjBI_I2iK03W_nvO5_VGxhQDVdEa-tm6G4OSxy2D/exec'; 
  const imgbbAPIKey = '6150992b01e2acc330921c2be02bf83a'; 

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

  const filteredData = submissions.filter(item => 
    activeTab === 'All' ? true : item.type === activeTab
  );

  const featuredPainting = submissions.find(item => item.type === 'Painting');

  const handleUpload = async (e) => {
    e.preventDefault();
    setUploading(true);
    const form = e.target;
    const fileInput = form.imageFile.files[0];
    let imageUrl = "";

    try {
      if (fileInput) {
        const imgData = new FormData();
        imgData.append('image', fileInput);
        const imgRes = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbAPIKey}`, {
          method: 'POST',
          body: imgData
        });
        const imgJson = await imgRes.json();
        imageUrl = imgJson.data.url;
      }

      const formData = new FormData();
      formData.set('formType', 'creative');
      formData.set('Name', localStorage.getItem('userName') || "Guest");
      formData.set('Dept', localStorage.getItem('userDept') || "CUSAT");
      formData.set('Title', form.title.value);
      formData.set('Content', form.content.value);
      formData.set('imageUrl', imageUrl);

      await fetch(scriptURL, { method: 'POST', body: formData });
      alert("സൃഷ്ടി വിജയകരമായി പങ്കുവെച്ചു!");
      form.reset();
      loadData();
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', overflowX: 'hidden' }}>
      <Head>
        <title>SAMSKARA | CUSAT Artistic Collective</title>
        <link href="https://fonts.googleapis.com/css2?family=Syncopate:wght@700&family=Inter:wght@300;600&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
      </Head>

      <AnimatePresence mode="wait">
        {step === 'splash' && (
          <IntroSplash 
            key="splash" 
            onComplete={() => {
              const isRegistered = localStorage.getItem('isRegistered');
              if (isRegistered === 'true') {
                setStep('gallery');
              } else {
                setStep('details');
              }
            }} 
          />
        )}

        {step === 'details' && (
          <DetailsForm 
            key="details" 
            onNext={() => {
              localStorage.setItem('isRegistered', 'true');
              setStep('gallery');
            }} 
          />
        )}

        {step === 'gallery' && (
          <motion.div 
            key="gallery"
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 1 }}
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {/* Filter Bar - No border version */}
            <FilterBar activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* Featured Section */}
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

            {/* Main Gallery */}
            <section style={styles.section}>
              <PhotoGallery photos={filteredData} />
            </section>

            {/* Upload Portal - Border Removed, Subtle Shadow Added */}
            <section style={styles.uploadSection}>
              <h2 style={styles.subTitle}>സൃഷ്ടികൾ പങ്കുവെക്കൂ</h2>
              <form onSubmit={handleUpload} style={styles.form}>
                <input type="text" name="title" placeholder="Title" required style={styles.input} />
                <textarea name="content" placeholder="എഴുത്തുകൾ ഉണ്ടെങ്കിൽ..." style={styles.input} rows="3" />
                <div style={styles.fileContainer}>
                  <label style={{color: '#888'}}>ചിത്രങ്ങൾ ചേർക്കാം (Optional): </label>
                  <input type="file" name="imageFile" accept="image/*" style={styles.fileInput} />
                </div>
                <button type="submit" disabled={uploading} style={styles.submitBtn}>
                  {uploading ? "UPLOADING..." : "SUBMIT TO GALLERY"}
                </button>
              </form>
            </section>

            <InstagramFeed />
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const styles = {
  section: { padding: '40px 0' },
  sectionTitle: {
    fontFamily: "'Syncopate', sans-serif",
    textAlign: 'center',
    color: 'transparent',
    WebkitTextStroke: '1px #FFD700',
    fontSize: '1.8rem',
    textTransform: 'uppercase',
    letterSpacing: '4px',
    marginBottom: '30px'
  },
  uploadSection: {
    maxWidth: '650px',
    margin: '60px auto',
    padding: '40px 20px',
    background: '#0a0a0a', // നേരിയ വ്യത്യാസമുള്ള ബ്ലാക്ക്
    borderRadius: '40px',
    textAlign: 'center',
    // ബോർഡർ ഒഴിവാക്കി നിഴൽ നൽകി
    boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
  },
  subTitle: { color: '#FFD700', marginBottom: '25px', fontFamily: "'Syncopate', sans-serif", fontSize: '1.1rem', letterSpacing: '2px' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  input: {
    width: '100%', 
    padding: '16px', 
    background: '#151515', 
    border: 'none', // ബോർഡർ പൂർണ്ണമായും ഒഴിവാക്കി
    color: '#fff', 
    borderRadius: '15px', 
    outline: 'none',
    fontSize: '15px'
  },
  fileContainer: { fontSize: '13px', textAlign: 'left', padding: '10px 5px' },
  fileInput: { marginLeft: '10px', color: '#fbbf24', fontSize: '12px' },
  submitBtn: {
    padding: '18px', 
    background: 'linear-gradient(to right, #ef4444, #b91c1c)', // ഗ്രേഡിയന്റ് ലുക്ക്
    color: '#fff', 
    border: 'none', 
    borderRadius: '15px', 
    cursor: 'pointer', 
    fontWeight: 'bold', 
    letterSpacing: '2px',
    marginTop: '10px',
    boxShadow: '0 10px 20px rgba(239, 68, 68, 0.2)'
  }
};
