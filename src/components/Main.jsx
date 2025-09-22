import background from '../assets/background_high_res.jpg'
import { Link } from 'react-router-dom'

export default function Main() {
    return (
        <main>
            <div className='main-content'>
                <h1>Découvrez tout ce qui est possible avec SCPI Browser</h1>
                <span>
                    Explorez et analysez les opportunités d'investissement immobilier grâce à notre navigateur complet de données SCPI.
                </span>
                <div>
                    <Link to="/scpi">
                        <button className='browse-scpi'>Parcourir les SCPI</button>
                    </Link>
                    <Link to="/societes">
                        <button className='browse-societies'>Parcourir les Sociétés</button>
                    </Link>
                </div>
            </div>
            <img src={background} alt="Arrière-plan" className='background' />
        </main>
    )
}
