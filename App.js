import { useState, useEffect } from 'react';
import DetailsForm from './components/DetailsForm';
import CreativeWall from './components/CreativeWall';

function App() {
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ലോഗിൻ സ്റ്റാറ്റസ് പരിശോധിക്കുന്നു
    const userStatus = localStorage.getItem('isRegistered');
    
    // 'true' എന്ന string ആണോ എന്ന് കൃത്യമായി നോക്കുന്നു
    if (userStatus === 'true') {
      setIsRegistered(true);
    } else {
      setIsRegistered(false);
    }
    
    setLoading(false);
  }, []);

  // ഡാറ്റ ലോഡ് ആകുന്നത് വരെ ഒരു ലളിതമായ ലോഡിംഗ് കാണിക്കുന്നു
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
        <DetailsForm onNext={() => setIsRegistered(true)} />
      ) : (
        <CreativeWall />
      )}
    </div>
  );
}

export default App;
