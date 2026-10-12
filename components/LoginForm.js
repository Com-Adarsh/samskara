import { useState } from 'react';
import { motion } from 'framer-motion';

export default function LoginForm({ onBack, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    const phone = new FormData(event.currentTarget).get('phone');
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      });
      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.error || 'No registration found for that phone number.');
      }

      localStorage.setItem('isRegistered', 'true');
      localStorage.setItem('userPhone', phone);
      localStorage.setItem('userName', result.user.name || '');
      localStorage.setItem('userDept', result.user.dept || '');
      onSuccess();
    } catch (submitError) {
      setError(submitError.message || 'Could not verify your number. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={styles.container}>
      <div style={styles.formBox}>
        <h2 style={styles.title}>SAMSKARA <span style={{ color: '#ef4444' }}>CUSAT</span></h2>
        <p style={styles.subtitle}>Sign in with the phone number used during registration.</p>
        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label htmlFor="login-phone" style={styles.label}>WhatsApp Number</label>
            <input
              id="login-phone"
              type="tel"
              name="phone"
              pattern="[0-9]{10}"
              inputMode="numeric"
              autoComplete="tel-national"
              required
              style={styles.input}
              placeholder="10 Digit Number"
            />
          </div>
          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'VERIFYING...' : 'SIGN IN'}
          </button>
          {error && <p role="alert" style={styles.error}>{error}</p>}
        </form>
        <button type="button" onClick={onBack} style={styles.backButton}>Back to registration</button>
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
  button: { width: '100%', padding: '15px', borderRadius: '8px', border: 'none', background: 'linear-gradient(45deg, #ef4444, #991b1b)', color: '#fff', fontWeight: 'bold', cursor: 'pointer' },
  backButton: { display: 'block', margin: '18px auto 0', padding: '8px', border: 'none', background: 'none', color: '#fbbf24', cursor: 'pointer' },
  error: { color: '#fca5a5', fontSize: '13px', marginTop: '12px' }
};