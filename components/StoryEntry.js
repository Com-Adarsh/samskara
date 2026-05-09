import { motion } from 'framer-motion';

export default function StoryEntry({ onFinish }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: '#050505',
        color: '#fff',
        padding: '20px',
        textAlign: 'center'
      }}
    >
      <h2 style={{ fontFamily: "'Syncopate', sans-serif", color: '#fbbf24' }}>Creative Story</h2>
      <p style={{ maxWidth: '500px', margin: '20px 0', color: '#ccc' }}>
        This is where the story writing section will go.
      </p>
      
      <button 
        onClick={onFinish}
        style={{
          padding: '15px 40px',
          background: '#ef4444',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}
      >
        GO TO GALLERY
      </button>
    </motion.div>
  );
}
