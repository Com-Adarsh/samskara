import React from 'react';

export default function Footer() {
  return (
    <footer style={styles.footer}>
      {/* About Section */}
      <div style={styles.footerSec}>
        <h4 style={styles.heading}>About Samskara</h4>
        <p style={styles.text}>
          ക്യാമ്പസുകളിലെ സർഗ്ഗാത്മകതയെയും പുരോഗമന ചിന്തകളെയും ഒന്നിപ്പിക്കുന്ന സാംസ്കാരിക-സാഹിത്യ വിഭാഗമാണ് സംസ്കാര. 
          കലയും സാഹിത്യവും ജീവിതത്തെയും സമൂഹത്തെയും മാറ്റിയെടുക്കാനുള്ള കരുത്താണെന്ന് ഞങ്ങൾ വിശ്വസിക്കുന്നു.
        </p>
      </div>

      {/* Contact Section */}
      <div style={styles.footerSec}>
        <h4 style={styles.heading}>Contact</h4>
        <a href="mailto:samskaracusat@gmail.com" style={styles.link}>
          <i className="fa-solid fa-envelope"></i> samskaracusat@gmail.com
        </a>
        <p style={styles.text}>
          <i className="fa-solid fa-location-dot"></i> CUSAT, Kalamassery, Kochi
        </p>
      </div>

      {/* Socials Section */}
      <div style={styles.footerSec}>
        <h4 style={styles.heading}>Follow Us</h4>
        <a href="https://www.instagram.com/samskara_cusat" target="_blank" rel="noopener noreferrer" style={styles.link}>
          <i className="fa-brands fa-instagram"></i> @samskara_cusat
        </a>
        <a href="https://whatsapp.com/channel/0029VaesYjiHgZWZT1NwWo1z" target="_blank" rel="noopener noreferrer" style={styles.link}>
          <i className="fa-brands fa-whatsapp"></i> SFI CUSAT WhatsApp
        </a>
      </div>

      {/* Copyright */}
      <div style={styles.copyright}>
        &copy; 2026 SAMSKARA CUSAT | Designed for the Creative Minds of CUSAT
      </div>
    </footer>
  );
}

// Paste your styles constant here below the component
const styles = {
  footer: {
    marginTop: '50px',
    padding: '80px 20px 40px',
    background: 'linear-gradient(to top, #0a0a0a, #000)',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: '40px',
    color: '#fff',
    position: 'relative',
    zIndex: 10,
    width: '100%',
    boxSizing: 'border-box'
  },
  footerSec: { flex: '1', minWidth: '280px', maxWidth: '400px' },
  heading: { color: '#fbbf24', marginBottom: '20px', fontSize: '15px', letterSpacing: '2px', textTransform: 'uppercase' },
  text: { color: '#888', fontSize: '14px', lineHeight: '1.8' },
  link: { color: '#bbb', textDecoration: 'none', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', transition: '0.3s' },
  copyright: { width: '100%', textAlign: 'center', paddingTop: '40px', borderTop: '1px solid rgba(255,255,255,0.05)', color: '#444', fontSize: '11px', marginTop: '20px' }
};
