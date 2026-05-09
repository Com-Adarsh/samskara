import { useState } from 'react';
import { motion } from 'framer-motion';

export default function DetailsForm({ onNext }) {
  const [loading, setLoading] = useState(false);

  // നിങ്ങളുടെ ഗൂഗിൾ ആപ്പ് സ്ക്രിപ്റ്റ് URL
  const scriptURL = 'https://script.google.com/macros/s/AKfycbxzj7vxNbt3Kn6ET1Q_ik_8dS7skjBI_I2iK03W_nvO5_VGxhQDVdEa-tm6G4OSxy2D/exec';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    
    try {
      // ഗൂഗിൾ ഷീറ്റിലേക്ക് വിവരങ്ങൾ അയക്കുന്നു
      await fetch(scriptURL, { method: 'POST', body: formData });
      
      // വിവരങ്ങൾ ബ്രൗസറിൽ സൂക്ഷിക്കുന്നു (CreativeWall-ൽ ഉപയോഗിക്കാൻ)
      localStorage.setItem('userName', formData.get('name'));
      localStorage.setItem('userDept', formData.get('dept'));
      localStorage.setItem('isRegistered', 'true');

      alert("സ്വാഗതം! നിങ്ങളുടെ എൻട്രി വിജയകരമായി രേഖപ്പെടുത്തി.");
      onNext(); // ക്രിയേറ്റീവ് വാളിലേക്ക് യൂസറെ മാറ്റുന്നു
    } catch (error) {
      console.error('Error!', error.message);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // പാസിംഗ് ഔട്ട് വർഷങ്ങൾ (Dropdown-ന് വേണ്ടി)
  const years = [2024, 2025, 2026, 2027, 2028, 2029, 2030];

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
                <input type="tel" name="phone" placeholder="XXXXXXXXXX" pattern="[0-9]{10}" required style={styles.input} />
            </div>

            <div style={styles.formGroup}>
                <label style={styles.label}>Department</label>
                <input list="depts" name="dept" placeholder="Select Department..." required style={styles.input} />
                <datalist id="depts">
                    <option value="Department of Statistics" />
                    <option value="Centre for Integrated Studies" />
                    <option value="Department of Computer Science" />
                    <option value="School of Management Studies (SMS)" />
                    <option value="School of Legal Studies (SLS)" />
                    <option value="Department of Physics" />
                    {/* മറ്റ് ഡിപ്പാർട്ട്മെൻ്റുകൾ ഇവിടെ ചേർക്കാം */}
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
                    <label style={styles.label}>Passing Year</label>
                    <select name="full_date" required style={styles.select}>
                        <option value="">Select</option>
                        {years.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                </div>
            </div>

            <div style={styles.formGroup}>
                <label style={styles.label}>Creative Domain</label>
                <select name="arts" required style={styles.select}>
                    <option value="">Choose your field...</option>
                    <optgroup label="Arts & Performing Arts" style={{background: '#111', color: '#fbbf24'}}>
                        <option value="Painting">Painting</option>
                        <option value="Dance">Dance</option>
                        <option value="Music">Music</option>
                    </optgroup>
                    <optgroup label="Literature" style={{background: '#111', color: '#fbbf24'}}>
                        <option value="Poetry">Poetry</option>
                        <option value="Prose">Prose</option>
                    </optgroup>
                </select>
            </div>

            <button type="submit" disabled={loading} style={styles.button}>
                {loading ? "SUBMITTING..." : "SUBMIT"}
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
  input: { width: '100%', padding: '14px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '12px', boxSizing: 'border-box' },
  select: { width: '100%', padding: '14px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '12px' },
  flexGroup: { display: 'flex', gap: '20px' },
  button: { width: '100%', padding: '18px', background: 'linear-gradient(45deg, #ef4444, #991b1b)', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '18px', fontWeight: '700', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '2px' }
};
