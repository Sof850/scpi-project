import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import SocieteForm from '../components/SocieteForm.jsx'
import ScpiForm from '../components/ScpiForm.jsx'

export default function AdminDashboard() {
    const [societes, setSocietes] = useState([])
    const [scpis, setScpis] = useState([])
    const [loading, setLoading] = useState(true)
    const [showSocieteForm, setShowSocieteForm] = useState(false)
    const [showScpiForm, setShowScpiForm] = useState(false)
    const [editingSociete, setEditingSociete] = useState(null)
    const [editingScpi, setEditingScpi] = useState(null)

    const token = localStorage.getItem('adminToken')
    if (!token) {
        return <Navigate to="/" replace />
    }

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const [societesRes, scpisRes] = await Promise.all([
                fetch('http://localhost:8000/api/societes'),
                fetch('http://localhost:8000/api/scpi')
            ])
            
            const societesData = await societesRes.json()
            const scpisData = await scpisRes.json()
            
            setSocietes(societesData)
            setScpis(scpisData)
        } catch (error) {
            console.error('Erreur lors du chargement:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteSociete = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette société?')) {
            try {
                const response = await fetch(`http://localhost:8000/api/admin/societes/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                
                if (response.ok) {
                    setSocietes(societes.filter(s => s.id !== id))
                } else {
                    alert('Erreur lors de la suppression')
                }
            } catch (error) {
                alert('Erreur de connexion')
            }
        }
    }

    const handleDeleteScpi = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette SCPI?')) {
            try {
                const response = await fetch(`http://localhost:8000/api/admin/scpi/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                
                if (response.ok) {
                    setScpis(scpis.filter(s => s.id !== id))
                } else {
                    alert('Erreur lors de la suppression')
                }
            } catch (error) {
                alert('Erreur de connexion')
            }
        }
    }

    const handleSocieteSuccess = () => {
        setShowSocieteForm(false)
        setEditingSociete(null)
        fetchData()
    }

    const handleScpiSuccess = () => {
        setShowScpiForm(false)
        setEditingScpi(null)
        fetchData()
    }

    const getSocieteNameById = (id) => {
        const societe = societes.find(s => s.id === id)
        return societe ? societe.nom : 'Non trouvée'
    }

    if (loading) {
        return (
            <main className="browse-loading">
                <h1>Chargement du dashboard...</h1>
            </main>
        )
    }

    return (
        <>
            <main className="admin-main">
                <div className="admin-header">
                    <h1>Dashboard Admin</h1>
                    <p className="admin-subtitle">Gérez vos sociétés et SCPI</p>
                    
                    <div className="admin-actions">
                        <button 
                            className="btn-primary"
                            onClick={() => setShowSocieteForm(true)}
                        >
                            Ajouter une Société
                        </button>
                        <button 
                            className="btn-primary"
                            onClick={() => setShowScpiForm(true)}
                        >
                            Ajouter une SCPI
                        </button>
                    </div>
                </div>

                <div className="admin-table-container">
                    <h2>Sociétés de Gestion ({societes.length})</h2>
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nom</th>
                                <th>Année</th>
                                <th>Encours</th>
                                <th>Ville</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {societes.map(societe => (
                                <tr key={societe.id}>
                                    <td>{societe.id}</td>
                                    <td>{societe.nom}</td>
                                    <td>{societe.anneeCreation}</td>
                                    <td>{societe.encoursSousGestion}</td>
                                    <td>{societe.adresse.split(',')[1]?.trim() || societe.adresse}</td>
                                    <td>
                                        <div className="table-actions">
                                            <button 
                                                className="btn-edit"
                                                onClick={() => {
                                                    setEditingSociete(societe)
                                                    setShowSocieteForm(true)
                                                }}
                                            >
                                                Modifier
                                            </button>
                                            <button 
                                                className="btn-delete"
                                                onClick={() => handleDeleteSociete(societe.id)}
                                            >
                                                Supprimer
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="admin-table-container">
                    <h2>SCPI ({scpis.length})</h2>
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nom</th>
                                <th>Catégorie</th>
                                <th>TDVM</th>
                                <th>Prix/Part</th>
                                <th>Société de Gestion</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {scpis.map(scpi => (
                                <tr key={scpi.id}>
                                    <td>{scpi.id}</td>
                                    <td>{scpi.nom}</td>
                                    <td>{scpi.categorie}</td>
                                    <td>{scpi.tdvm}%</td>
                                    <td>{scpi.prixPart} €</td>
                                    <td>{getSocieteNameById(scpi.societeGestionId)}</td>
                                    <td>
                                        <div className="table-actions">
                                            <button 
                                                className="btn-edit"
                                                onClick={() => {
                                                    setEditingScpi(scpi)
                                                    setShowScpiForm(true)
                                                }}
                                            >
                                                Modifier
                                            </button>
                                            <button 
                                                className="btn-delete"
                                                onClick={() => handleDeleteScpi(scpi.id)}
                                            >
                                                Supprimer
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
            {showSocieteForm && (
                <SocieteForm
                    societe={editingSociete}
                    onClose={() => {
                        setShowSocieteForm(false)
                        setEditingSociete(null)
                    }}
                    onSuccess={handleSocieteSuccess}
                />
            )}

            {showScpiForm && (
                <ScpiForm
                    scpi={editingScpi}
                    societes={societes}
                    onClose={() => {
                        setShowScpiForm(false)
                        setEditingScpi(null)
                    }}
                    onSuccess={handleScpiSuccess}
                />
            )}
        </>
    )
}