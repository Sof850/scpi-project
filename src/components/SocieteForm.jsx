import { useState, useEffect } from 'react'

export default function SocieteForm({ societe, onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        nom: '',
        adresse: '',
        telephone: '',
        anneeCreation: '',
        encoursSousGestion: '',
        siteWeb: '',
        description: ''
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const token = localStorage.getItem('adminToken')

    useEffect(() => {
        if (societe) {
            setFormData({
                nom: societe.nom || '',
                adresse: societe.adresse || '',
                telephone: societe.telephone || '',
                anneeCreation: societe.anneeCreation || '',
                encoursSousGestion: societe.encoursSousGestion || '',
                siteWeb: societe.siteWeb || '',
                description: societe.description || ''
            })
        }
    }, [societe])

    const API_URL = import.meta.env.VITE_API_URL

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const url = societe 
                ? `${API_URL}/api/admin/societes/${societe.id}`
                : `${API_URL}/api/admin/societes`
            
            const method = societe ? 'PUT' : 'POST'

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    anneeCreation: parseInt(formData.anneeCreation)
                })
            })

            if (response.ok) {
                onSuccess()
            } else {
                const data = await response.json()
                setError(data.message || 'Erreur lors de la sauvegarde')
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

    return (
        <div className="form-overlay" onClick={onClose}>
            <div className="form-modal" onClick={(e) => e.stopPropagation()}>
                <h3>{societe ? 'Modifier la Société' : 'Ajouter une Société'}</h3>
                
                <form onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="nom">Nom *</label>
                            <input
                                type="text"
                                id="nom"
                                name="nom"
                                className="form-input"
                                value={formData.nom}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="adresse">Adresse *</label>
                            <input
                                type="text"
                                id="adresse"
                                name="adresse"
                                className="form-input"
                                value={formData.adresse}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="telephone">Téléphone</label>
                            <input
                                type="tel"
                                id="telephone"
                                name="telephone"
                                className="form-input"
                                value={formData.telephone}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="anneeCreation">Année de création *</label>
                            <input
                                type="number"
                                id="anneeCreation"
                                name="anneeCreation"
                                className="form-input"
                                value={formData.anneeCreation}
                                onChange={handleChange}
                                min="1900"
                                max={new Date().getFullYear()}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="encoursSousGestion">Encours sous gestion</label>
                            <input
                                type="text"
                                id="encoursSousGestion"
                                name="encoursSousGestion"
                                className="form-input"
                                value={formData.encoursSousGestion}
                                onChange={handleChange}
                                placeholder="Ex: 12 Mds €"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="siteWeb">Site web</label>
                            <input
                                type="url"
                                id="siteWeb"
                                name="siteWeb"
                                className="form-input"
                                value={formData.siteWeb}
                                onChange={handleChange}
                                placeholder="https://..."
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="description">Description</label>
                            <textarea
                                id="description"
                                name="description"
                                className="form-input"
                                value={formData.description}
                                onChange={handleChange}
                                rows="3"
                                placeholder="Description de la société..."
                            />
                        </div>
                    </div>

                    {error && (
                        <div style={{ color: '#dc3545', textAlign: 'center', fontSize: '0.9rem', marginTop: '15px' }}>
                            {error}
                        </div>
                    )}

                    <div className="form-buttons">
                        <button 
                            type="submit" 
                            className="btn-primary"
                            disabled={loading}
                        >
                            {loading ? 'Sauvegarde...' : (societe ? 'Modifier' : 'Ajouter')}
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