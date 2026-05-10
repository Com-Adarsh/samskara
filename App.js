import { useState, useEffect } from 'react';
import DetailsForm from './components/DetailsForm';
import CreativeWall from './components/CreativeWall'; // നിങ്ങളുടെ ഗാലറി/മെയിൻ പേജിന്റെ പേര് ഇവിടെ നൽകുക

function App() {
  const [isRegistered, setIsRegistered] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // ആപ്പ് ലോഡ് ചെയ്യുമ്പോൾ ലോക്കൽ സ്റ്റോറേജ് ചെക്ക് ചെയ്യുന്നു
    const status = localStorage.getItem('isRegistered');
    if (status === 'true') {
      setIsRegistered(true);
    }
    setChecking(false);
  }, []);

  // ഡാറ്റ ചെക്ക് ചെയ്യുന്ന സമയം വരെ ഒരു ചെറിയ ലോഡിംഗ് കാണിക്കാം
  if (checking) return null; 

  return (
    <div className="App">
      {!isRegistered ? (
        // രജിസ്റ്റർ ചെയ്തിട്ടില്ലെങ്കിൽ മാത്രം ഫോം കാണിക്കും
        <DetailsForm onNext={() => setIsRegistered(true)} />
      ) : (
        // രജിസ്റ്റർ ചെയ്തവർക്ക് നേരിട്ട് മെയിൻ കണ്ടന്റ്
        <CreativeWall /> 
      )}
    </div>
  );
}

export default App;
