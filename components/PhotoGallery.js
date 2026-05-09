import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CreativeWall() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedImg, setSelectedImg] = useState(null);

  const scriptURL = 'https://script.google.com/macros/s/AKfycbxzj7vxNbt3Kn6ET1Q_ik_8dS7skjBI_I2iK03W_nvO5_VGxhQDVdEa-tm6G4OSxy2D/exec'; 
  const imgbbAPIKey = '6150992b01e2acc330921c2be02bf83a'; 

  const loadGallery = async () => {
    try {
      const res = await fetch(scriptURL);
      const data = await res.json();
      setItems(data.reverse());
      setLoading(false);
    } catch (err) {
      console.error("Gallery Error:", err);
      setLoading(false);
    }
  };

  useEffect(() => { loadGallery(); }, []);

  const handleSubmit = async (e) => {
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
      formData.append('formType', 'creative');
      formData.append('Name', localStorage.getItem('userName') || "Anonymous");
      formData.append('Dept', localStorage.getItem('userDept') || "CUSAT");
      formData.append('Title', form.title.value);
      formData.append('Content', form.content.value);
      formData.append('imageUrl', imageUrl);

      await fetch(scriptURL, { method: 'POST', body: formData });
      alert("സൃഷ്ടി വിജയകരമായി രേഖപ്പെടുത്തി!");
      form.reset();
      loadGallery();
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={styles.galleryWrapper}>
      <h2 style={styles.heading}>CREATIVE <span style={{color: '#ef4444'}}>WALL</span></h2>
      
      {loading ? (
        <div style={{ color: '#fff', textAlign: 'center', padding: '50px' }}>Loading the Darkroom...</div>
      ) : (
        <div style={styles.masonryGrid}>
          {items.map((item, index) => (
            <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={styles.photoCard}>
              {item.imageUrl && (
                <img src={item.imageUrl} alt={item.Title} style={{...styles.image, cursor: 'pointer'}} onClick={() => setSelectedImg(item)} />
              )}
              <div style={styles.cardBody}>
                <span style={styles.artistName}>{item.Name} | {item.Dept}</span>
                <h3 style={styles.photoTitle}>{item.Title}</h3>
                {item.Content && <p style={styles.photoText}>{item.Content}</p>}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Lightbox Overlay */}
      <AnimatePresence>
        {selectedImg && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={styles.lightbox} onClick={() => setSelectedImg(null)}>
            <motion.img initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }} src={selectedImg.imageUrl} style={styles.fullImg} onClick={(e) => e.stopPropagation()} />
            <div style={styles.imgInfo}>
              <h3 style={styles.lightboxTitle}>{selectedImg.Title}</h3>
              <p style={styles.lightboxArtist}>By {selectedImg.Name} ({selectedImg.Dept})</p>
              <button style={styles.closeBtn} onClick={() => setSelectedImg(null)}>CLOSE</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <hr style={styles.divider} />

      {/* Upload Section - Only One Here */}
      <div style={styles.uploadSection}>
        <h3 style={{color: '#fbbf24', marginBottom: '20px', fontFamily: "'Syncopate', sans-serif", fontSize: '1rem'}}>SHARE YOUR CREATION</h3>
        <form onSubmit={handleSubmit}>
          <input type="text" name="title" placeholder="തലക്കെട്ട് (Title)" required style={styles.input} />
          <textarea name="content" rows="4" placeholder="വിവരണം..." style={styles.input}></textarea>
          <div style={styles.fileBox}>
            <input type="file" name="imageFile" accept="image/*" style={styles.fileInput} />
          </div>
          <button type="submit" disabled={uploading} style={styles.submitBtn}>
            {uploading ? "UPLOADING..." : "SUBMIT TO WALL"}
          </button>
        </form>
      </div>

      {/* Simple Instagram Link - No Yellow Box */}
      <div style={styles.instaSec}>
         <a href="https://www.instagram.com/samskara_cusat" target="_blank" rel="noreferrer" style={styles.instaBtn}>
            FOLLOW @SAMSKARA_CUSAT
         </a>
      </div>
    </div>
  );
}

const styles = {
  galleryWrapper: { padding: '60px 5%', backgroundColor: '#050505', minHeight: '100vh', color: '#fff' },
  heading: { fontFamily: "'Syncopate', sans-serif", color: '#FFD700', fontSize: '1.8rem', borderLeft: '4px solid #ef4444', paddingLeft: '20px', marginBottom: '40px' },
  masonryGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gridGap: '25px' },
  photoCard: { backgroundColor: '#111', borderRadius: '12px', overflow: 'hidden', border: '1px solid #222' },
  image: { width: '100%', display: 'block', maxHeight: '350px', objectFit: 'cover' },
  cardBody: { padding: '20px' },
  artistName: { fontSize: '0.7rem', color: '#ef4444', marginBottom: '5px', display: 'block', textTransform: 'uppercase' },
  photoTitle: { fontSize: '1.1rem', color: '#FFD700', margin: '0 0 10px 0' },
  photoText: { fontSize: '0.85rem', color: '#bbb', lineHeight: '1.5', whiteSpace: 'pre-wrap' },
  lightbox: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.95)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' },
  fullImg: { maxHeight: '70vh', maxWidth: '90%', borderRadius: '8px' },
  imgInfo: { textAlign: 'center', marginTop: '20px' },
  lightboxTitle: { color: '#FFD700', fontSize: '1.2rem', marginBottom: '5px' },
  lightboxArtist: { color: '#ef4444', fontSize: '0.8rem' },
  closeBtn: { marginTop: '15px', background: '#ef4444', border: 'none', color: '#fff', padding: '8px 20px', cursor: 'pointer', borderRadius: '20px', fontSize: '0.7rem' },
  divider: { border: '0', borderTop: '1px solid #111', margin: '60px 0' },
  uploadSection: { background: '#0a0a0a', padding: '30px', borderRadius: '20px', border: '1px solid #1a1a1a', maxWidth: '600px', margin: '0 auto' },
  input: { width: '100%', padding: '14px', marginBottom: '15px', borderRadius: '8px', background: '#000', border: '1px solid #333', color: '#fff' },
  fileBox: { marginBottom: '20px', padding: '15px', border: '1px dashed #333', borderRadius: '8px' },
  fileInput: { color: '#888', fontSize: '12px' },
  submitBtn: { width: '100%', padding: '15px', background: '#ef4444', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 'bold', cursor: 'pointer' },
  instaSec: { textAlign: 'center', marginTop: '50px' },
  instaBtn: { color: '#555', textDecoration: 'none', fontSize: '0.7rem', letterSpacing: '2px', border: '1px solid #222', padding: '10px 20px', borderRadius: '30px' }
};
