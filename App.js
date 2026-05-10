import { useState, useEffect } from 'react';
import DetailsForm from './components/DetailsForm';
import CreativeWall from './components/CreativeWall'; // നിങ്ങളുടെ ഗാലറി പേജിന്റെ പേര് നൽകുക

function App() {
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ബ്രൗസറിൽ നേരത്തെ രജിസ്റ്റർ ചെയ്ത വിവരം ഉണ്ടോ എന്ന് നോക്കുന്നു
    const userStatus = localStorage.getItem('isRegistered');
    if (userStatus === 'true') {
      setIsRegistered(true);
    }
    setLoading(false);
  }, []);

  if (loading) return null; // ഡാറ്റ ലോഡ് ചെയ്യുന്നത് വരെ ഒന്നും കാണിക്കില്ല

  return (
    <div className="App">
      {!isRegistered ? (
        // രജിസ്റ്റർ ചെയ്തിട്ടില്ലെങ്കിൽ ഫോം കാണിക്കുക
        <DetailsForm onNext={() => setIsRegistered(true)} />
      ) : (
        // രജിസ്റ്റർ ചെയ്തവർക്ക് നേരിട്ട് മെയിൻ പേജ് കാണിക്കുക
        <CreativeWall />
      )}
    </div>
  );
}

export default App;
