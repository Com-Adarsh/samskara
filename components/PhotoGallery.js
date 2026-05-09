import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CreativeWall() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedImg, setSelectedImg] = useState(null); // For Lightbox

  // Settings
  const scriptURL = 'https://script.google.com/macros/s/AKfycbxzj7vxNbt3Kn6ET1Q_ik_8dS7skjBI_I2iK03W_nvO5_VGxhQDVdEa-tm6G4OSxy2D/exec'; 
  const imgbbAPIKey = '6150992b01e2acc330921c2be02bf83a'; 

  // Fetch data from Google Sheet
  const loadGallery = async () => {
    try {
      const res = await fetch(scriptURL);
      const data = await res.json();
      setItems(data.reverse()); // പുതിയത് ആദ്യം വരാൻ
      setLoading(false);
    } catch (err) {
      console.error("Gallery Error:", err);
      setLoading(false);
    }
  };

  useEffect(() => { loadGallery(); }, []);

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    
    const form = e.target;
    const fileInput = form.imageFile.files[0];
    let imageUrl = "";

    try {
      // 1. Upload to ImgBB if an image is selected
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

      // 2. Submit all data to Google Sheets
      const formData = new FormData();
      formData.append('formType', 'creative');
      formData.append('Name', localStorage.getItem('userName') || "Anonymous");
      formData.append('Dept', localStorage.getItem('userDept') || "CUSAT");
      formData.append('Title', form.title.value);
      formData.append('Content', form.content.value);
      formData.append('imageUrl', imageUrl);

      await fetch(scriptURL, { method: 'POST', body: formData });
      
      alert("സൃഷ്ടി വിജയകരമായി രേഖപ്പെടുത്തി!");
      form.reset();
      loadGallery(); // Refresh the gallery instantly
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={styles.galleryWrapper}>
      <h2 style={styles.heading}>CREATIVE <span style={{color: '#ef4444'}}>WALL</span></h2>
      
      {/* 1. GALLERY DISPLAY SECTION */}
      {loading ? (
        <div style={{ color: '#fff', textAlign: 'center', padding: '50px' }}>Loading the Darkroom...</div>
      ) : (
        <div style={styles.masonryGrid}>
          {items.map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              style={styles.photoCard}
            >
              {/* If image exists, make it clickable for Lightbox */}
              {item.imageUrl && (
                <img 
                  src={item.imageUrl} 
                  alt={item.Title} 
                  style={{...styles.image, cursor: 'pointer'}} 
                  onClick={() => setSelectedImg(item)}
                />
              )}
              
              {/* Text Content Area */}
              <div style={styles.cardBody}>
                <span style={styles.artistName}>{item.Name} | {item.Dept}</span>
                <h3 style={styles.photoTitle}>{item.Title}</h3>
                {item.Content && <p style={styles.photoText}>{item.Content}</p>}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* 2. LIGHTBOX OVERLAY (Opens when an image is clicked) */}
      <AnimatePresence>
        {selectedImg && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={styles.lightbox} 
            onClick={() => setSelectedImg(null)}
          >
            <motion.img 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              src={selectedImg.imageUrl} 
              style={styles.fullImg} 
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image itself
            />
            <div style={styles.imgInfo}>
              <h3 style={styles.lightboxTitle}>{selectedImg.Title}</h3>
              <p style={styles.lightboxArtist}>By {selectedImg.Name} ({selectedImg.Dept})</p>
              {selectedImg.Content && <p style={styles.lightboxDesc}>{selectedImg.Content}</p>}
            </div>
            <button style={styles.closeBtn} onClick={() => setSelectedImg(null)}>CLOSE</button>
          </motion.div>
        )}
      </AnimatePresence>

      <hr style={styles.divider} />

      {/* 3. UPLOAD SECTION */}
      <div style={styles.uploadSection}>
        <h3 style={{color: '#fbbf24', marginBottom: '20px', fontFamily: "'Syncopate', sans-serif", fontSize: '1.2rem'}}>
          SHARE YOUR CREATION
        </h3>
        <form onSubmit={handleSubmit}>
          <input type="text" name="title" placeholder="തലക്കെട്ട് (Title)" required style={styles.input} />
          <textarea name="content" rows="4" placeholder="കവിതയോ കഥയോ അല്ലെങ്കിൽ ചിത്രത്തെക്കുറിച്ചുള്ള വിവരണമോ ഇവിടെ എഴുതാം..." style={styles.input}></textarea>
          
          <div style={styles.fileBox}>
            <label style={styles.fileLabel}>ചിത്രങ്ങൾ ഉണ്ടെങ്കിൽ അപ്‌ലോഡ് ചെയ്യുക (Optional):</label>
            <input type="file" name="imageFile" accept="image/*" style={styles.fileInput} />
          </div>

          <button type="submit" disabled={uploading} style={styles.submitBtn}>
            {uploading ? "UPLOADING TO WALL..." : "SUBMIT CREATION"}
          </button>
        </form>
      </div>

    </div>
  );
}

// STYLES
const styles = {
  galleryWrapper: { 
    padding: '60px 5%', 
    backgroundColor: '#050505',
    fontFamily: "'Inter', sans-serif",
    minHeight: '100vh',
    color: '#fff'
  },
  heading: { 
    fontFamily: "'Syncopate', sans-serif",
    color: '#FFD700', 
    fontSize: '2rem',
    borderLeft: '4px solid #ef4444', 
    paddingLeft: '20px', 
    marginBottom: '50px',
    letterSpacing: '2px'
  },
  masonryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gridGap: '30px',
    alignItems: 'start' // Keeps cards at their natural height
  },
  photoCard: { 
    backgroundColor: '#111',
    borderRadius: '8px',
    overflow: 'hidden',
    borderBottom: '3px solid #ef4444',
    boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
  },
  image: { 
    width: '100%', 
    display: 'block', 
    maxHeight: '400px',
    objectFit: 'cover',
    transition: 'transform 0.3s ease' 
  },
  cardBody: {
    padding: '20px',
  },
  artistName: {
    fontFamily: "'Syncopate', sans-serif",
    fontSize: '0.7rem',
    color: '#ef4444',
    marginBottom: '8px',
    display: 'block'
  },
  photoTitle: {
    fontSize: '1.2rem',
    fontWeight: '600',
    color: '#FFD700',
    margin: '0 0 10px 0'
  },
  photoText: {
    fontSize: '0.9rem',
    color: '#ccc',
    lineHeight: '1.6',
    whiteSpace: 'pre-wrap',
    margin: 0
  },
  
  /* Lightbox Styles */
  lightbox: {
    position: 'fixed',
    top: 0, left: 0, width: '100%', height: '100%',
    backgroundColor: 'rgba(0,0,0,0.95)',
    display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
    zIndex: 10000,
    padding: '20px',
    overflowY: 'auto'
  },
  fullImg: { 
    maxHeight: '65vh', 
    maxWidth: '90%', 
    border: '1px solid #333',
    boxShadow: '0 0 50px rgba(239,68,68,0.15)',
    borderRadius: '5px'
  },
  imgInfo: { 
    color: '#fff', 
    textAlign: 'center', 
    marginTop: '25px',
    maxWidth: '600px'
  },
  lightboxTitle: {
    fontFamily: "'Syncopate', sans-serif",
    color: '#FFD700',
    fontSize: '1.5rem',
    margin: '0 0 10px 0'
  },
  lightboxArtist: {
    fontFamily: "'Inter', sans-serif",
    color: '#ef4444',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    fontSize: '0.8rem',
    marginBottom: '15px'
  },
  lightboxDesc: {
    color: '#ccc',
    fontSize: '0.9rem',
    lineHeight: '1.5',
    whiteSpace: 'pre-wrap'
  },
  closeBtn: {
    marginTop: '25px',
    background: 'none',
    border: '1px solid #ef4444',
    color: '#ef4444',
    padding: '10px 30px',
    cursor: 'pointer',
    fontFamily: "'Syncopate', sans-serif",
    fontSize: '0.7rem',
    letterSpacing: '2px',
    borderRadius: '30px',
    transition: '0.3s'
  },
  
  /* Upload Section Styles */
  divider: { border: '0', borderTop: '1px solid #222', margin: '60px 0' },
  uploadSection: { 
    background: 'linear-gradient(145deg, #0a0a0a, #111)', 
    padding: '40px', 
    borderRadius: '20px', 
    border: '1px solid #222',
    maxWidth: '800px',
    margin: '0 auto'
  },
  input: { 
    width: '100%', padding: '16px', marginBottom: '20px', 
    borderRadius: '10px', background: '#000', border: '1px solid #333', 
    color: '#fff', boxSizing: 'border-box', fontFamily: "'Inter', sans-serif"
  },
  fileBox: { 
    marginBottom: '25px', padding: '20px', 
    background: '#050505', border: '1px dashed #444', borderRadius: '10px' 
  },
  fileLabel: { display: 'block', fontSize: '13px', marginBottom: '10px', color: '#888' },
  fileInput: { color: '#fbbf24' },
  submitBtn: { 
    width: '100%', padding: '18px', 
    background: '#ef4444', border: 'none', borderRadius: '10px', 
    color: '#fff', fontWeight: 'bold', cursor: 'pointer', 
    letterSpacing: '2px', fontFamily: "'Syncopate', sans-serif"
  }
};
