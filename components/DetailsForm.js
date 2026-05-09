import { useState } from 'react';
import { motion } from 'framer-motion';

export default function DetailsForm({ onNext }) {
  const [loading, setLoading] = useState(false);

  // ഗൂഗിൾ ആപ്പ് സ്ക്രിപ്റ്റ് URL
  const scriptURL = 'https://script.google.com/macros/s/AKfycbxzj7vxNbt3Kn6ET1Q_ik_8dS7skjBI_I2iK03W_nvO5_VGxhQDVdEa-tm6G4OSxy2D/exec';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    
    try {
      await fetch(scriptURL, { method: 'POST', body: formData });
      
      // ലോക്കൽ സ്റ്റോറേജിൽ വിവരങ്ങൾ സൂക്ഷിക്കുന്നു
      localStorage.setItem('userName', formData.get('name'));
      localStorage.setItem('userDept', formData.get('dept'));
      localStorage.setItem('isRegistered', 'true');

      alert("സ്വാഗതം! നിങ്ങളുടെ എൻട്രി വിജയകരമായി രേഖപ്പെടുത്തി.");
      onNext(); 
    } catch (error) {
      console.error('Error!', error.message);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={styles.bodyReplacement}
    >
      <header style={styles.header}>
        <div style={styles.logoContainer}>
            <img 
              src="https://raw.githubusercontent.com/Com-Adarsh/Samskara-Cusat/main/Picsart_25-09-01_16-58-09-038.png" 
              alt="Samskara Logo" 
              style={{height: '60px'}} 
            />
        </div>
        <div style={styles.logo}>SAMSKARA <span style={{color: '#ef4444'}}>CUSAT</span></div>
      </header>

      <div style={styles.formContainer}>
        <div style={styles.heroText}>
            <p>"അക്ഷരങ്ങൾക്കും അറിവിനും അപ്പുറം, ആവിഷ്കാരത്തിൻ്റെ അനന്തമായ ആകാശമാണ് 'സംസ്കാര കുസാറ്റ്'."</p>
        </div>

        <form onSubmit={handleSubmit}>
            <input type="hidden" name="formType" value="registration" />

            <div style={styles.formGroup}>
                <label style={styles.label}>Full Name</label>
                <input type="text" name="name" placeholder="Enter your name" required style={styles.input} />
            </div>

            <div style={styles.formGroup}>
                <label style={styles.label}>WhatsApp Number</label>
                <input type="tel" name="phone" placeholder="10 Digit Number" pattern="[0-9]{10}" required style={styles.input} />
            </div>

            <div style={styles.formGroup}>
                <label style={styles.label}>Department</label>
                <input list="depts" name="dept" placeholder="Select or Search Department..." required style={styles.input} />
                <datalist id="depts">
                    <option value="Department of Applied Chemistry" />
                    <option value="Department of Applied Economics" />
                    <option value="Department of Physics" />
                    <option value="Department of Mathematics" />
                    <option value="Department of Statistics" />
                    <option value="Department of Biotechnology" />
                    <option value="Department of Electronics" />
                    <option value="Department of Instrumentation" />
                    <option value="Department of Computer Science" />
                    <option value="Department of Computer Applications (DCA)" />
                    <option value="International School of Photonics (ISP)" />
                    <option value="Civil Engineering (SOE)" />
                    <option value="Mechanical Engineering (SOE)" />
                    <option value="Electrical Engineering (SOE)" />
                    <option value="Electronics & Communication (SOE)" />
                    <option value="Computer Science & Engineering (SOE)" />
                    <option value="Information Technology (SOE)" />
                    <option value="Safety & Fire Engineering (SOE)" />
                    <option value="CUCEK Kuttanad (Engineering)" />
                    <option value="CUCEK Kuttanad (MCA)" />
                    <option value="Kunjali Marakkar School of Marine Engineering (KMSME)" />
                    <option value="Department of Ship Technology" />
                    <option value="Centre for Integrated Studies (CIS)" />
                    <option value="DDU Kaushal Kendras (DDUKK)" />
                    <option value="Department of Polymer Science and Rubber Tech (PS&RT)" />
                    <option value="Department of Marine Biology" />
                    <option value="Department of Marine Geology and Geophysics" />
                    <option value="Department of Physical Oceanography" />
                    <option value="Department of Chemical Oceanography" />
                    <option value="Department of Atmospheric Sciences" />
                    <option value="School of Industrial Fisheries (SIF)" />
                    <option value="Department of English and Foreign Languages" />
                    <option value="Department of Hindi" />
                    <option value="School of Legal Studies (SLS)" />
                    <option value="School of Management Studies (SMS)" />
                    <option value="School of Environmental Studies (SES)" />
                </datalist>
            </div>

            <div style={styles.flexGroup}>
                <div style={{...styles.formGroup, flex: 1}}>
                    <label style={styles.label}>Current Year</label>
                    <select name="year" required style={styles.select}>
                        <option value="">Select</option>
                        {[1, 2, 3, 4, 5].map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                </div>
                <div style={{...styles.formGroup, flex: 1}}>
                    <label style={styles.label}>Passing Out Year</label>
                    <input 
                      type="number" 
                      name="passing_year" 
                      placeholder="YYYY" 
                      required 
                      style={styles.input} 
                    />
                </div>
            </div>

            <button type="submit" disabled={loading} style={styles.button}>
                {loading ? "LOGGING IN..." : "ENTER CREATIVE WALL"}
            </button>
        </form>
      </div>
    </motion.div>
  );
}

const styles = {
  bodyReplacement: {
    backgroundImage: 'radial-gradient(circle at 50% 50%, #1a0505 0%, #050505 100%)',
    minHeight: '100vh',
    color: '#fff',
    fontFamily: "'Inter', sans-serif",
    padding: '20px'
  },
  header: { padding: '40px 20px', textAlign: 'center' },
  logo: { fontFamily: "'Urbanist', sans-serif", fontSize: '42px', color: '#fbbf24', letterSpacing: '5px' },
  formContainer: {
    maxWidth: '600px', margin: '0 auto 60px', background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(15px)', padding: '40px', borderRadius: '28px', border: '1px solid rgba(255, 255, 255, 0.1)'
  },
  heroText: { textAlign: 'center', marginBottom: '35px', color: '#ccc', fontSize: '15px', lineHeight: '1.8' },
  formGroup: { marginBottom: '25px' },
  label: { display: 'block', marginBottom: '10px', color: '#fbbf24', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: '600' },
  input: { 
    width: '100%', padding: '14px', background: 'rgba(255,255,255,0.07)', 
    border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '12px', 
    boxSizing: 'border-box', colorScheme: 'dark' 
  },
  select: { width: '100%', padding: '14px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '12px' },
  flexGroup: { display: 'flex', gap: '20px' },
  button: { width: '100%', padding: '18px', background: 'linear-gradient(45deg, #ef4444, #991b1b)', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '18px', fontWeight: '700', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '2px' }
};
