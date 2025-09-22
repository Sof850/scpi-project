import { useState, useEffect } from 'react'

export default function ScpiForm({ scpi, societes, onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        nom: '',
        categorie: '',
        tdvm: '',
        capitalisation: '',
        anneeCreation: '',
        prixPart: '',
        minimumSouscription: '',
        nbAssocies: '',
        tauxOccupationFinancier: '',
        societeGestionId: '',
        description: ''
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const token = localStorage.getItem('adminToken')

    useEffect(() => {
        if (scpi) {
            setFormData({
                nom: scpi.nom || '',
                categorie: scpi.categorie || '',
                tdvm: scpi.tdvm || '',
                capitalisation: scpi.capitalisation || '',
                anneeCreation: scpi.anneeCreation || '',
                prixPart: scpi.prixPart || '',
                minimumSouscription: scpi.minimumSouscription || '',
                nbAssocies: scpi.nbAssocies || '',
                tauxOccupationFinancier: scpi.tauxOccupationFinancier || '',
                societeGestionId: scpi.societeGestionId || '',
                description: scpi.description || ''
            })
        }
    }, [scpi])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const url = scpi 
                ? `https://scp-project-backend.onrender.com/api/admin/scpi/${scpi.id}`
                : `https://scp-project-backend.onrender.com/api/admin/scpi`
            
            const method = scpi ? 'PUT' : 'POST'

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    tdvm: parseFloat(formData.tdvm),
                    anneeCreation: parseInt(formData.anneeCreation),
                    prixPart: parseInt(formData.prixPart),
                    nbAssocies: parseInt(formData.nbAssocies),
                    societeGestionId: parseInt(formData.societeGestionId)
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
                <h3>{scpi ? 'Modifier la SCPI' : 'Ajouter une SCPI'}</h3>
                
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
                            <label htmlFor="categorie">Catégorie *</label>
                            <select
                                id="categorie"
                                name="categorie"
                                className="form-input"
                                value={formData.categorie}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Choisir une catégorie</option>
                                <option value="Santé">Santé</option>
                                <option value="Diversifiée">Diversifiée</option>
                                <option value="Bureaux">Bureaux</option>
                                <option value="Commerces">Commerces</option>
                                <option value="Logistique">Logistique</option>
                                <option value="Résidentiel">Résidentiel</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="tdvm">TDVM (%) *</label>
                            <input
                                type="number"
                                id="tdvm"
                                name="tdvm"
                                className="form-input"
                                value={formData.tdvm}
                                onChange={handleChange}
                                step="0.1"
                                min="0"
                                max="20"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="capitalisation">Capitalisation</label>
                            <input
                                type="text"
                                id="capitalisation"
                                name="capitalisation"
                                className="form-input"
                                value={formData.capitalisation}
                                onChange={handleChange}
                                placeholder="Ex: 4,2 Mds €"
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
                            <label htmlFor="prixPart">Prix par part (€) *</label>
                            <input
                                type="number"
                                id="prixPart"
                                name="prixPart"
                                className="form-input"
                                value={formData.prixPart}
                                onChange={handleChange}
                                min="1"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="minimumSouscription">Minimum souscription</label>
                            <input
                                type="text"
                                id="minimumSouscription"
                                name="minimumSouscription"
                                className="form-input"
                                value={formData.minimumSouscription}
                                onChange={handleChange}
                                placeholder="Ex: 10 parts (2 030 €)"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="nbAssocies">Nombre d'associés</label>
                            <input
                                type="number"
                                id="nbAssocies"
                                name="nbAssocies"
                                className="form-input"
                                value={formData.nbAssocies}
                                onChange={handleChange}
                                min="0"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="tauxOccupationFinancier">Taux d'occupation</label>
                            <input
                                type="text"
                                id="tauxOccupationFinancier"
                                name="tauxOccupationFinancier"
                                className="form-input"
                                value={formData.tauxOccupationFinancier}
                                onChange={handleChange}
                                placeholder="Ex: 96%"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="societeGestionId">Société de gestion *</label>
                            <select
                                id="societeGestionId"
                                name="societeGestionId"
                                className="form-input"
                                value={formData.societeGestionId}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Choisir une société</option>
                                {societes.map(societe => (
                                    <option key={societe.id} value={societe.id}>
                                        {societe.nom}
                                    </option>
                                ))}
                            </select>
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
                                placeholder="Description de la SCPI..."
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
                            {loading ? 'Sauvegarde...' : (scpi ? 'Modifier' : 'Ajouter')}
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