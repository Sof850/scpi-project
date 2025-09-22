import { Link } from 'react-router-dom'

export default function SocieteCard({ societe }) {
    return (
        <div className="societe-card">
            <div>
                <h3>{societe.nom}</h3>
                
                <div className="card-info-row">
                    <span className="card-secondary-info">
                        Depuis {societe.anneeCreation}
                    </span>
                    <span className="card-primary-value">
                        {societe.encoursSousGestion}
                    </span>
                </div>
                
                <div className="card-info-row">
                    <span className="card-secondary-info">
                        {societe.adresse.split(',')[1] || societe.adresse}
                    </span>
                </div>
            </div>
            
            <div className="card-links">
                <Link to={`/societes/${societe.id}`} className="details-link">
                    <span className='span-link'>Détails {">"}</span> 
                </Link>
                
                <a 
                    href={societe.siteWeb} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="details-link"
                >
                    <span className='span-link'>Site web {">"}</span>
                </a>
            </div>
        </div>
    )
}