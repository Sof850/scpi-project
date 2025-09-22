import { useState, useEffect } from 'react'
import ScpiCard from '../components/ScpiCard.jsx'

export default function ScpiBrowser() {
    const [scpiList, setScpiList] = useState([])
    const [filteredScpiList, setFilteredScpiList] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    
    const [filters, setFilters] = useState({
        category: '',
        minTdvm: '',
        maxTdvm: '',
        minPrice: '',
        maxPrice: '',
        sortBy: 'nom',
        sortOrder: 'asc'
    })
    
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        const fetchScpi = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/scpi')
                if (!response.ok) {
                    throw new Error('Erreur lors du chargement des SCPI')
                }
                const data = await response.json()
                setScpiList(data)
                setFilteredScpiList(data)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        fetchScpi()
    }, [])

    useEffect(() => {
        let filtered = [...scpiList]

        if (searchTerm) {
            filtered = filtered.filter(scpi => 
                scpi.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                scpi.categorie.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }

        if (filters.category) {
            filtered = filtered.filter(scpi => scpi.categorie === filters.category)
        }

        if (filters.minTdvm) {
            filtered = filtered.filter(scpi => scpi.tdvm >= parseFloat(filters.minTdvm))
        }
        if (filters.maxTdvm) {
            filtered = filtered.filter(scpi => scpi.tdvm <= parseFloat(filters.maxTdvm))
        }

        if (filters.minPrice) {
            filtered = filtered.filter(scpi => scpi.prixPart >= parseFloat(filters.minPrice))
        }
        if (filters.maxPrice) {
            filtered = filtered.filter(scpi => scpi.prixPart <= parseFloat(filters.maxPrice))
        }

        filtered.sort((a, b) => {
            let aValue, bValue

            switch (filters.sortBy) {
                case 'nom':
                    aValue = a.nom.toLowerCase()
                    bValue = b.nom.toLowerCase()
                    break
                case 'tdvm':
                    aValue = a.tdvm
                    bValue = b.tdvm
                    break
                case 'prixPart':
                    aValue = a.prixPart
                    bValue = b.prixPart
                    break
                case 'anneeCreation':
                    aValue = a.anneeCreation
                    bValue = b.anneeCreation
                    break
                case 'capitalisation':
                    aValue = parseFloat(a.capitalisation.replace(/[^\d,]/g, '').replace(',', '.'))
                    bValue = parseFloat(b.capitalisation.replace(/[^\d,]/g, '').replace(',', '.'))
                    break
                default:
                    aValue = a.nom.toLowerCase()
                    bValue = b.nom.toLowerCase()
            }

            if (filters.sortOrder === 'asc') {
                return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
            } else {
                return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
            }
        })

        setFilteredScpiList(filtered)
    }, [scpiList, filters, searchTerm])

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }))
    }

    const clearFilters = () => {
        setFilters({
            category: '',
            minTdvm: '',
            maxTdvm: '',
            minPrice: '',
            maxPrice: '',
            sortBy: 'nom',
            sortOrder: 'asc'
        })
        setSearchTerm('')
    }

    const uniqueCategories = [...new Set(scpiList.map(scpi => scpi.categorie))]

    if (loading) {
        return (
            <main className="browse-loading">
                <h1>Chargement des SCPI...</h1>
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
                <h1>Browse SCPI</h1>
                <span>
                    Découvrez notre sélection de SCPI avec leurs performances et caractéristiques détaillées.
                </span>
            </div>

            <div className="filter-section">
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Rechercher par nom ou catégorie..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>

                <div className="filters-container">
                    <div className="filters-grid">
                        <div className="filter-group">
                            <label className="filter-label">Catégorie</label>
                            <select
                                value={filters.category}
                                onChange={(e) => handleFilterChange('category', e.target.value)}
                                className="filter-select"
                            >
                                <option value="">Toutes les catégories</option>
                                {uniqueCategories.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>

                        <div className="filter-group">
                            <label className="filter-label">TDVM (%)</label>
                            <div className="range-inputs">
                                <input
                                    type="number"
                                    placeholder="Min"
                                    step="0.1"
                                    value={filters.minTdvm}
                                    onChange={(e) => handleFilterChange('minTdvm', e.target.value)}
                                    className="range-input"
                                />
                                <span className="range-separator">-</span>
                                <input
                                    type="number"
                                    placeholder="Max"
                                    step="0.1"
                                    value={filters.maxTdvm}
                                    onChange={(e) => handleFilterChange('maxTdvm', e.target.value)}
                                    className="range-input"
                                />
                            </div>
                        </div>

                        <div className="filter-group">
                            <label className="filter-label">Prix par part (€)</label>
                            <div className="range-inputs">
                                <input
                                    type="number"
                                    placeholder="Min"
                                    value={filters.minPrice}
                                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                                    className="range-input"
                                />
                                <span className="range-separator">-</span>
                                <input
                                    type="number"
                                    placeholder="Max"
                                    value={filters.maxPrice}
                                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                                    className="range-input"
                                />
                            </div>
                        </div>

                        <div className="filter-group">
                            <label className="filter-label">Trier par</label>
                            <div className="sort-controls">
                                <select
                                    value={filters.sortBy}
                                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                                    className="filter-select"
                                >
                                    <option value="nom">Nom</option>
                                    <option value="tdvm">TDVM</option>
                                    <option value="prixPart">Prix par part</option>
                                    <option value="anneeCreation">Année de création</option>
                                    <option value="capitalisation">Capitalisation</option>
                                </select>
                                <button
                                    onClick={() => handleFilterChange('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
                                    className="sort-order-btn"
                                    title={filters.sortOrder === 'asc' ? 'Croissant' : 'Décroissant'}
                                >
                                    {filters.sortOrder === 'asc' ? '↑' : '↓'}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="filter-actions">
                        <button onClick={clearFilters} className="btn-secondary">
                            Effacer les filtres
                        </button>
                        <span className="results-count">
                            {filteredScpiList.length} SCPI trouvée{filteredScpiList.length > 1 ? 's' : ''}
                        </span>
                    </div>
                </div>
            </div>
            
            <div className="browse-cards-container">
                {filteredScpiList.map(scpi => (
                    <ScpiCard key={scpi.id} scpi={scpi} />
                ))}
            </div>
            
            {filteredScpiList.length === 0 && scpiList.length > 0 && (
                <div className="browse-empty-state">
                    <span>Aucune SCPI ne correspond à vos critères de recherche.</span>
                    <button onClick={clearFilters} className="btn-primary" style={{marginTop: '15px'}}>
                        Effacer les filtres
                    </button>
                </div>
            )}

            {scpiList.length === 0 && (
                <div className="browse-empty-state">
                    <span>Aucune SCPI disponible pour le moment.</span>
                </div>
            )}
        </main>
    )
}