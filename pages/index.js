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

  // Settings
  const scriptURL = 'https://script.google.com/macros/s/AKfycbxzj7vxNbt3Kn6ET1Q_ik_8dS7skjBI_I2iK03W_nvO5_VGxhQDVdEa-tm6G4OSxy2D/exec'; 
  const imgbbAPIKey = '6150992b01e2acc330921c2be02bf83a'; 

  // ഗാലറി ഡാറ്റ ലോഡ് ചെയ്യാൻ
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

  // ഫിൽട്ടറിംഗ് ലോജിക്
  const filteredData = submissions.filter(item => 
    activeTab === 'All' ? true : item.type === activeTab
  );

  const featuredPainting = submissions.find(item => item.type === 'Painting');

  // ImgBB വഴിയുള്ള അപ്‌ലോഡ് ലോജിക്
  const handleUpload = async (e) => {
    e.preventDefault();
    setUploading(true);
    const form = e.target;
    const fileInput = form.imageFile.files[0];
    let imageUrl = "";

    try {
      // 1. ImgBB-ലേക്ക് ചിത്രം അപ്‌ലോഡ് ചെയ്യുന്നു
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

      // 2. ഗൂഗിൾ ഷീറ്റിലേക്ക് വിവരങ്ങൾ അയക്കുന്നു
      const formData = new FormData();
      formData.set('formType', 'creative');
      formData.set('Name', localStorage.getItem('userName') || "Guest");
      formData.set('Dept', localStorage.getItem('userDept') || "CUSAT");
      formData.set('Title', form.title.value);
      formData.set('Content', form.content.value);
      formData.set('imageUrl', imageUrl);

      await fetch(scriptURL, { method: 'POST', body: formData });
      alert("സൃഷ്ടി ഗാലറിയിൽ ചേർത്തു!");
      form.reset();
      loadData();
    } catch (err) {
      alert("Error uploading: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh' }}>
      <Head>
        <title>SAMSKARA | CUSAT Artistic Collective</title>
        <link href="https://fonts.googleapis.com/css2?family=Syncopate:wght@700&family=Inter:wght@300;600&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
      </Head>

      <AnimatePresence mode="wait">
        {/* PHASE 1: SPLASH - രജിസ്ട്രേഷൻ പരിശോധന ഇവിടെ നടക്കുന്നു */}
        {step === 'splash' && (
          <IntroSplash 
            key="splash" 
            onComplete={() => {
              const isRegistered = localStorage.getItem('isRegistered');
              if (isRegistered === 'true') {
                setStep('gallery'); // രജിസ്റ്റർ ചെയ്തവർക്ക് നേരിട്ട് ഗാലറി
              } else {
                setStep('details'); // അല്ലാത്തവർക്ക് രജിസ്ട്രേഷൻ ഫോം
              }
            }} 
          />
        )}

        {/* PHASE 2: DETAILS - ആദ്യ തവണ മാത്രം കാണിക്കുന്നത് */}
        {step === 'details' && (
          <DetailsForm 
            key="details" 
            onNext={() => {
              localStorage.setItem('isRegistered', 'true');
              setStep('gallery');
            }} 
          />
        )}

        {/* PHASE 3: GALLERY HUB */}
        {step === 'gallery' && (
          <motion.div 
            key="gallery"
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 1 }}
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
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

            {/* Upload Portal - ഗാലറിയുടെ താഴെ */}
            <section style={styles.uploadSection}>
              <h2 style={styles.subTitle}>സൃഷ്ടികൾ പങ്കുവെക്കൂ</h2>
              <form onSubmit={handleUpload} style={styles.form}>
                <input type="text" name="title" placeholder="Title" required style={styles.input} />
                <textarea name="content" placeholder="എഴുത്തുകൾ ഉണ്ടെങ്കിൽ..." style={styles.input} rows="3" />
                <div style={styles.fileContainer}>
                  <label>Add Image (Photography/Art): </label>
                  <input type="file" name="imageFile" accept="image/*" style={{marginLeft: '10px'}} />
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
    fontSize: '2rem',
    textTransform: 'uppercase',
    letterSpacing: '4px',
    marginBottom: '30px'
  },
  uploadSection: {
    maxWidth: '700px',
    margin: '60px auto',
    padding: '30px',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '30px',
    border: '1px solid rgba(255,215,0,0.2)',
    textAlign: 'center'
  },
  subTitle: { color: '#FFD700', marginBottom: '20px', fontFamily: "'Syncopate', sans-serif", fontSize: '1.2rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  input: {
    width: '100%', padding: '15px', background: '#111', border: '1px solid #333', 
    color: '#fff', borderRadius: '10px', outline: 'none'
  },
  fileContainer: { fontSize: '14px', color: '#888', textAlign: 'left', padding: '10px' },
  submitBtn: {
    padding: '18px', background: '#ef4444', color: '#fff', border: 'none', 
    borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', letterSpacing: '2px'
  }
};
