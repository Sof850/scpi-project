import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import SocieteCard from "../components/SocieteCard"

export default function ScpiDetails() {
    const { id } = useParams()
    const [scpi, setScpi] = useState(null)
    const [societe, setSociete] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const scpiResponse = await fetch(`${API_URL}/api/scpi/${id}`)
                if (!scpiResponse.ok) {
                    throw new Error('Erreur lors du chargement de la SCPI')
                }
                const scpiData = await scpiResponse.json()
                setScpi(scpiData)

                if (scpiData.societeGestionId) {
                    const societeResponse = await fetch(`${API_URL}/api/societes/${scpiData.societeGestionId}`)
                    if (societeResponse.ok) {
                        const societeData = await societeResponse.json()
                        setSociete(societeData)
                    }
                }
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
                <h1>Chargement de la SCPI...</h1>
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

    if (!scpi) {
        return (
            <main className="browse-error">
                <h1>SCPI non trouvée</h1>
                <span>La SCPI demandée n'existe pas.</span>
            </main>
        )
    }

    return (
        <main className="details-main">
            <div className="details-header">
                <h1>{scpi.nom}</h1>
                
                {scpi.description && (
                    <p className="details-description">
                        {scpi.description}
                    </p>
                )}
                
                <div className="details-info-grid">
                    <div className="details-info-item">
                        <div className="details-info-label">Catégorie</div>
                        <div className="details-info-value">{scpi.categorie}</div>
                    </div>
                    
                    <div className="details-info-item">
                        <div className="details-info-label">TDVM</div>
                        <div className="details-info-value">{scpi.tdvm}%</div>
                    </div>
                    
                    <div className="details-info-item">
                        <div className="details-info-label">Capitalisation</div>
                        <div className="details-info-value">{scpi.capitalisation}</div>
                    </div>
                    
                    <div className="details-info-item">
                        <div className="details-info-label">Année de création</div>
                        <div className="details-info-value">{scpi.anneeCreation}</div>
                    </div>

                    <div className="details-info-item">
                        <div className="details-info-label">Prix par part</div>
                        <div className="details-info-value">{scpi.prixPart} €</div>
                    </div>

                    <div className="details-info-item">
                        <div className="details-info-label">Minimum souscription</div>
                        <div className="details-info-value">{scpi.minimumSouscription}</div>
                    </div>

                    <div className="details-info-item">
                        <div className="details-info-label">Nombre d'associés</div>
                        <div className="details-info-value">{scpi.nbAssocies}</div>
                    </div>

                    <div className="details-info-item">
                        <div className="details-info-label">Taux d'occupation financier</div>
                        <div className="details-info-value">{scpi.tauxOccupationFinancier}</div>
                    </div>
                </div>
            </div>

            {societe && (
                <div className="details-scpi-section">
                    <div className="details-scpi-title">
                        <h2>Société de gestion</h2>
                        <span className="details-scpi-subtitle">
                            Gérée par {societe.nom}
                        </span>
                    </div>
                    <SocieteCard societe={societe} />
                </div>
            )}
            
            {!societe && (
                <div className="browse-empty-state">
                    <span>Informations sur la société de gestion non disponibles.</span>
                </div>
            )}
        </main>
    )
}