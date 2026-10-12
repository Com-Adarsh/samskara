import { useState } from 'react';
import { motion } from 'framer-motion';

export default function DetailsForm({ onNext, onLogin }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const scriptURL = 'https://script.google.com/macros/s/AKfycbz1-qpuklkJwq9yZDuxBVcksOaa6yFNfB8YM4kFTNXTpTCAUP5Pg2W6cxdc7r0r3obu/exec';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const form = e.target;
    const formData = new FormData(form);

    try {
      await fetch(scriptURL, {
        method: 'POST', 
        body: formData,
        mode: 'no-cors' 
      });

      localStorage.setItem('isRegistered', 'true');
      localStorage.setItem('userName', formData.get('name'));
      localStorage.setItem('userDept', formData.get('dept'));
      localStorage.setItem('userPhone', formData.get('phone'));
      onNext();

    } catch (error) {
      console.error('Submission failed', error);
      setError('Could not save your details. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={styles.container}>
      <div style={styles.formBox}>
        <h2 style={styles.title}>SAMSKARA <span style={{color: '#ef4444'}}>CUSAT</span></h2>
        <p style={styles.subtitle}>നിങ്ങളുടെ വിവരങ്ങൾ നൽകി ക്രിയേറ്റീവ് വാളിലേക്ക് പ്രവേശിക്കുക</p>
        
        <form onSubmit={handleSubmit}>
          <input type="hidden" name="formType" value="registration" />
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Full Name</label>
            <input type="text" name="name" required style={styles.input} placeholder="പേര് നൽകുക" />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>WhatsApp Number</label>
            <input type="tel" name="phone" pattern="[0-9]{10}" required style={styles.input} placeholder="10 Digit Number" />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Department</label>
            <input name="dept" required style={styles.input} placeholder="Enter Department" />
          </div>

         <div style={styles.inputGroup}>
            <label style={styles.label}>Interest</label>
            <input name="interest" required style={styles.input} placeholder="Enter Interest" />
          </div>

       <div style={styles.inputGroup}>
            <label style={styles.label}>Pass Out Year</label>
            <input name="passing_year" required style={styles.input} placeholder="Enter Year of Passing" />
          </div>

          <div style={styles.row}>
            <div style={{flex: 1}}>
              <label style={styles.label}>Year</label>
              <select name="year" required style={styles.input}>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
                <option value="5">5th Year</option>
              </select>
            </div>
            <div style={{flex: 1}}>
              <label style={styles.label}>Blood Group</label>
              <select name="blood" required style={styles.input}>
                <option value="O+">O+</option>
                <option value="A+">A+</option>
                <option value="B+">B+</option>
                <option value="AB+">AB+</option>
                <option value="O-">O-</option>
                <option value="A-">A-</option>
                <option value="B-">B-</option>
                <option value="AB-">AB-</option>
                {/* ബാക്കി ഗ്രൂപ്പുകളും ചേർക്കാം */}
              </select>
            </div>
          </div>

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? "സേവ് ചെയ്യുന്നു..." : "ENTER CREATIVE WALL"}
          </button>
          {error && <p role="alert" style={styles.error}>{error}</p>}
        </form>
        <button type="button" onClick={onLogin} style={styles.loginButton}>
          Already registered? Sign in with your phone
        </button>
      </div>
    </motion.div>
  );
}

const styles = {
  container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' },
  formBox: { background: 'rgba(255,255,255,0.05)', padding: '30px', borderRadius: '20px', width: '100%', maxWidth: '450px', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' },
  title: { textAlign: 'center', color: '#fbbf24', fontSize: '28px', marginBottom: '10px' },
  subtitle: { textAlign: 'center', color: '#ccc', fontSize: '12px', marginBottom: '25px' },
  inputGroup: { marginBottom: '15px' },
  label: { display: 'block', fontSize: '10px', color: '#fbbf24', marginBottom: '5px', textTransform: 'uppercase' },
  input: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: '#111', color: '#fff', boxSizing: 'border-box' },
  row: { display: 'flex', gap: '10px', marginBottom: '20px' },
  button: { width: '100%', padding: '15px', borderRadius: '8px', border: 'none', background: 'linear-gradient(45deg, #ef4444, #991b1b)', color: '#fff', fontWeight: 'bold', cursor: 'pointer' },
  loginButton: { display: 'block', margin: '18px auto 0', padding: '8px', border: 'none', background: 'none', color: '#fbbf24', cursor: 'pointer' },
  error: { color: '#fca5a5', fontSize: '13px', marginTop: '12px' }
};
