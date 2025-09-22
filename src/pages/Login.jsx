import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login({ isOpen, onClose, onLogin }) {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const response = await fetch(`https://scp-project-backend.onrender.com/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })

            const data = await response.json()

            if (response.ok) {
                localStorage.setItem('adminToken', data.token)  
                localStorage.setItem('adminUser', JSON.stringify({ username: formData.username }))

                onLogin({ username: formData.username }, data.token)
                onClose()
                navigate('/admin')
            } else {
                setError(data.message || 'Erreur de connexion')
            }
        } catch (err) {
            setError('Erreur de connexion au serveur')
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    if (!isOpen) return null

    return (
        <div className="login-overlay" onClick={onClose}>
            <div className="login-modal" onClick={(e) => e.stopPropagation()}>
                <div className="login-header">
                    <h2>Connexion Admin</h2>
                </div>
                
                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="username">Nom d'utilisateur</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            className="form-input"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="password">Mot de passe</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="form-input"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    
                    {error && (
                        <div style={{ color: '#dc3545', textAlign: 'center', fontSize: '0.9rem' }}>
                            {error}
                        </div>
                    )}
                    
                    <div className="login-buttons">
                        <button 
                            type="submit" 
                            className="btn-primary"
                            disabled={loading}
                        >
                            {loading ? 'Connexion...' : 'Se connecter'}
                        </button>
                        <button 
                            type="button" 
                            className="btn-secondary"
                            onClick={onClose}
                        >
                            Annuler
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}