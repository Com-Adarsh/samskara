// components/FilterBar.js
export default function FilterBar({ activeTab, setActiveTab, onChangeStudent }) {
  const tabs = ["All", "Photography", "Music", "Dance", "Painting"];
  
  return (
    <div style={styles.bar}>
      {tabs.map(tab => (
        <button 
          key={tab}
          onClick={() => setActiveTab(tab)}
          style={{
            ...styles.btn,
            color: activeTab === tab ? '#FFD700' : '#FFF',
            borderBottom: activeTab === tab ? '2px solid #FF0000' : 'none'
          }}
        >
          {tab.toUpperCase()}
        </button>
      ))}
      {onChangeStudent && (
        <button onClick={onChangeStudent} style={styles.changeStudent}>
          CHANGE STUDENT
        </button>
      )}
    </div>
  );
}

const styles = {
  bar: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '20px', padding: '20px', backgroundColor: '#000' },
  btn: { background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold', padding: '10px' },
  changeStudent: { background: 'none', border: '1px solid #555', color: '#aaa', cursor: 'pointer', fontWeight: 'bold', padding: '9px 12px', fontSize: '11px' }
};
