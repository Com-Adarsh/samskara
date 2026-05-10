import { useState } from 'react';
import DetailsForm from './components/DetailsForm';
import CreativeWall from './components/CreativeWall';

function App() {
  // ആപ്പ് ലോഡ് ചെയ്യുമ്പോൾ തന്നെ ലോക്കൽ സ്റ്റോറേജ് ചെക്ക് ചെയ്യുന്നു
  // ഇത് ഫോം ഒരു നിമിഷം തെളിഞ്ഞു വരുന്നത് ഒഴിവാക്കും
  const [isRegistered, setIsRegistered] = useState(() => {
    const status = localStorage.getItem('isRegistered');
    return status === 'true';
  });

  // ഈ ഫങ്ക്ഷൻ DetailsForm സബ്മിറ്റ് ചെയ്യുമ്പോൾ വിളിക്കാനുള്ളതാണ്
  const handleRegistrationSuccess = () => {
    setIsRegistered(true);
  };

  return (
    <div className="App" style={{ backgroundColor: '#050505', minHeight: '100vh' }}>
      {isRegistered ? (
        // രജിസ്റ്റർ ചെയ്തവർക്ക് ക്രിയേറ്റീവ് വാൾ കാണിക്കുന്നു
        <CreativeWall />
      ) : (
        // രജിസ്റ്റർ ചെയ്യാത്തവർക്ക് ഫോം കാണിക്കുന്നു
        <DetailsForm onNext={handleRegistrationSuccess} />
      )}
    </div>
  );
}

export default App;
