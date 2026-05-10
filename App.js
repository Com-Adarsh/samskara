import { useState } from 'react';
import DetailsForm from './components/DetailsForm';
import CreativeWall from './components/CreativeWall';


// App.js
const [isRegistered, setIsRegistered] = useState(() => {
  return localStorage.getItem('isRegistered') === 'true';
});
function App() {
  // ആപ്പ് ലോഡ് ചെയ്യുമ്പോൾ തന്നെ ലോക്കൽ സ്റ്റോറേജ് ചെക്ക് ചെയ്യുന്നു
  const [isRegistered, setIsRegistered] = useState(() => {
    const status = localStorage.getItem('isRegistered');
    return status === 'true';
  });

  // ഈ ഫങ്ക്ഷൻ DetailsForm-ലേക്ക് പാസ് ചെയ്യുന്നു
  const handleRegistrationSuccess = () => {
    setIsRegistered(true);
  };

  return (
    <div className="App" style={{ backgroundColor: '#050505', minHeight: '100vh' }}>
      {isRegistered ? (
        <CreativeWall />
      ) : (
        <DetailsForm onNext={handleRegistrationSuccess} />
      )}
    </div>
  );
}

export default App;
