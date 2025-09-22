import { useState, useEffect } from 'react'
import SocieteCard from '../components/SocieteCard.jsx'

export default function SocieteBrowser() {
    const [societeList, setSocieteList] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchSocietes = async () => {
            try {
                const response = await fetch(`https://scp-project-backend.onrender.com/api/societes`)
                if (!response.ok) {
                    throw new Error('Erreur lors du chargement des sociétés')
                }
                const data = await response.json()
                setSocieteList(data)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchSocietes()
    }, [])

    if (loading) {
        return (
            <main className="browse-loading">
                <h1>Chargement des sociétés...</h1>
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

    return (
        <main className="browse-main">
            <div className="browse-header">
                <h1>Browse Sociétés de Gestion</h1>
                <span>
                    Découvrez les principales sociétés de gestion immobilière et leurs expertises.
                </span>
            </div>
            
            <div className="browse-cards-container">
                {societeList.map(societe => (
                    <SocieteCard key={societe.id} societe={societe} />
                ))}
            </div>
            
            {societeList.length === 0 && (
                <div className="browse-empty-state">
                    <span>Aucune société de gestion disponible pour le moment.</span>
                </div>
            )}
        </main>
    )
}