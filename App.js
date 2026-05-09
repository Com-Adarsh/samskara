import { useState, useEffect } from 'react';
// നിങ്ങളുടെ മറ്റ് ഇംപോർട്ടുകൾ...

function App() {
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    // ആപ്പ് തുറക്കുമ്പോൾ ലോക്കൽ സ്റ്റോറേജ് പരിശോധിക്കുന്നു
    const status = localStorage.getItem('isRegistered');
    if (status === 'true') {
      setIsRegistered(true);
    }
  }, []);

  return (
    <div>
      {!isRegistered ? (
        <DetailsForm onNext={() => setIsRegistered(true)} />
      ) : (
        <Gallery /> // അല്ലെങ്കിൽ നിങ്ങളുടെ മെയിൻ കണ്ടന്റ്
      )}
    </div>
  );
}
