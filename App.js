import { useState, useEffect } from 'react';
import DetailsForm from './components/DetailsForm';
import CreativeWall from './components/CreativeWall';

function App() {
  // സ്റ്റേറ്റ് തുടങ്ങുമ്പോൾ തന്നെ localStorage നോക്കുന്നു
  const [isRegistered, setIsRegistered] = useState(() => {
    return localStorage.getItem('isRegistered') === 'true';
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ആപ്പ് ലോഡ് ആയി എന്ന് ഉറപ്പിക്കാൻ മാത്രം useEffect
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div style={{ background: '#050505', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#fbbf24' }}>
        Loading...
      </div>
    );
  }

  return (
    <div className="App">
      {!isRegistered ? (
        // onNext വിളിക്കുമ്പോൾ സ്റ്റേറ്റ് മാറുന്നു
        <DetailsForm onNext={() => setIsRegistered(true)} />
      ) : (
        <CreativeWall />
      )}
    </div>
  );
}

export default App;
