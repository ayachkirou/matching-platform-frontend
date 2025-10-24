import React, { useState, useEffect } from 'react';

const TestBackendConnection = () => {
    const [status, setStatus] = useState('loading');
    const [message, setMessage] = useState('');
    const [showTest, setShowTest] = useState(true);

    const testConnection = async () => {
        try {
            setStatus('loading');
            setMessage('Test de connexion en cours...');
            
            const response = await fetch('http://localhost:8080/api/admin/offres/statistiques');
            
            if (response.ok) {
                const data = await response.json();
                setStatus('success');
                setMessage(`✅ Backend connecté! Offres: ${data.totalOffres || 0}`);
                
                // Masquer automatiquement après 3 secondes
                setTimeout(() => {
                    setShowTest(false);
                }, 3000);
            } else {
                setStatus('error');
                setMessage('❌ Backend accessible mais erreur API');
            }
        } catch (error) {
            setStatus('error');
            setMessage('❌ Backend non accessible - Vérifiez le port 8080');
        }
    };

    useEffect(() => {
        testConnection();
    }, []);

    // Ne rien afficher si le test est caché
    if (!showTest) return null;

    return (
        <div style={{
            padding: '10px 15px',
            margin: '10px 0',
            borderRadius: '5px',
            fontSize: '14px',
            backgroundColor: status === 'loading' ? '#fff3cd' : 
                           status === 'success' ? '#d4edda' : '#f8d7da',
            color: status === 'loading' ? '#856404' : 
                  status === 'success' ? '#155724' : '#721c24',
            border: `1px solid ${status === 'loading' ? '#ffeaa7' : 
                              status === 'success' ? '#c3e6cb' : '#f5c6cb'}`
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{message}</span>
                <div>
                    {status === 'error' && (
                        <button 
                            onClick={testConnection}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#721c24',
                                cursor: 'pointer',
                                marginLeft: '10px'
                            }}
                        >
                            🔄
                        </button>
                    )}
                    <button 
                        onClick={() => setShowTest(false)}
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '18px',
                            cursor: 'pointer',
                            marginLeft: '10px'
                        }}
                    >
                        ×
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TestBackendConnection;