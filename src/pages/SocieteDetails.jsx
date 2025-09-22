import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import ScpiCard from "../components/ScpiCard"

export default function SocieteDetails() {
    const { id } = useParams()
    const [societe, setSociete] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const societeResponse = await fetch(`http://localhost:8000/api/societes/${id}`)
                if (!societeResponse.ok) {
                    throw new Error('Erreur lors du chargement de la société')
                }
                const societeData = await societeResponse.json()
                setSociete(societeData)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [id])

    if (loading) {
        return (
            <main className="browse-loading">
                <h1>Chargement de la société...</h1>
            </main>
        )
    }

    if (error) {
        return (
            <main className="browse-error">
                <h1>Erreur</h1>
                <span>{error}</span>
            </main>
        )
    }

    if (!societe) {
        return (
            <main className="browse-error">
                <h1>Société non trouvée</h1>
                <span>La société demandée n'existe pas.</span>
            </main>
        )
    }

    return (
        <main className="details-main">
            <div className="details-header">
                <h1>{societe.nom}</h1>
                
                {societe.description && (
                    <p className="details-description">
                        {societe.description}
                    </p>
                )}
                
                <div className="details-info-grid">
                    <div className="details-info-item">
                        <div className="details-info-label">Année de création</div>
                        <div className="details-info-value">{societe.anneeCreation}</div>
                    </div>
                    
                    <div className="details-info-item">
                        <div className="details-info-label">Encours sous gestion</div>
                        <div className="details-info-value">{societe.encoursSousGestion}</div>
                    </div>
                    
                    <div className="details-info-item">
                        <div className="details-info-label">Téléphone</div>
                        <div className="details-info-value">
                            <a href={`tel:${societe.telephone}`} className="details-phone-link">
                                {societe.telephone}
                            </a>
                        </div>
                    </div>
                    
                    <div className="details-info-item">
                        <div className="details-info-label">Adresse</div>
                        <div className="details-info-value">{societe.adresse}</div>
                    </div>

                    <div className="details-info-item">
                        <div className="details-info-label">SCPI gérées</div>
                        <div className="details-info-value">{societe.scpi.length} SCPI</div>
                    </div>

                    <div className="details-info-item">
                        <div className="details-info-label">Expérience</div>
                        <div className="details-info-value">{new Date().getFullYear() - societe.anneeCreation} ans</div>
                    </div>
                </div>
                
                <a 
                    href={societe.siteWeb} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="details-website-link"
                >
                    Visiter le site web →
                </a>
            </div>

            {societe.scpi && societe.scpi.length > 0 && (
                <div className="details-scpi-section">
                    <div className="details-scpi-title">
                        <h2>SCPI gérées par {societe.nom}</h2>
                        <span className="details-scpi-subtitle">
                            {societe.scpi.length} SCPI disponible{societe.scpi.length > 1 ? 's' : ''}
                        </span>
                    </div>
                    
                    <div className="browse-cards-container">
                        {societe.scpi.map(scpi => (
                            <ScpiCard key={scpi.id} scpi={scpi} />
                        ))}
                    </div>
                </div>
            )}
            
            {(!societe.scpi || societe.scpi.length === 0) && (
                <div className="browse-empty-state">
                    <span>Aucune SCPI gérée par cette société pour le moment.</span>
                </div>
            )}
        </main>
    )
}