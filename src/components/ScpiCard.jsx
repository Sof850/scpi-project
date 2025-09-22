import { Link } from 'react-router-dom'

export default function ScpiCard({ scpi }) {
    return (
        <div className="scpi-card">
            <div>
                <h3>{scpi.nom}</h3>
                
                <div className="card-info-row">
                    <span className="card-category-highlight">
                        {scpi.categorie}
                    </span>
                    <span className="card-performance">
                        {scpi.tdvm}% TDVM
                    </span>
                </div>
                
                <div className="card-info-row">
                    <span className="card-secondary-info">
                        Cap: {scpi.capitalisation}
                    </span>
                </div>
                
                <div className="card-info-row">
                    <span className="card-secondary-info">
                        {scpi.prixPart} €/part
                    </span>
                </div>
            </div>
            
            <Link to={`/scpi/${scpi.id}`} className="details-link">
                <span className='span-link'>Voir les détails {">"}</span>
            </Link>
        </div>
    )
}