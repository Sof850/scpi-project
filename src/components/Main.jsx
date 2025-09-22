import background from '../assets/background_high_res.jpg'
import { Link } from 'react-router-dom'

export default function Main() {
    return (
        <main>
            <div className='main-content'>
                <h1>Discover what's possible with SCPI Browser</h1>
                <span>
                    Explore and analyze real estate investment opportunities with our comprehensive SCPI data browser.
                </span>
                <div>
                    <Link to="/scpi">
                        <button className='browse-scpi'>Browse SCPI</button>
                    </Link>
                    <Link to="/societes">
                        <button className='browse-societies'>Browse Societies</button>
                    </Link>
                </div>
            </div>
            <img src={background} alt="Background" className='background' />
        </main>
    )
}