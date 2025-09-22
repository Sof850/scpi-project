import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import siteLogo from '../assets/logo_32px.png'
import Login from '../pages/Login.jsx'

export default function Navbar() {
    const [showLogin, setShowLogin] = useState(false)
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(null)

    useEffect(() => {
        const savedToken = localStorage.getItem('adminToken')
        const savedUser = localStorage.getItem('adminUser')
        
        if (savedToken && savedUser) {
            setToken(savedToken)
            setUser(JSON.parse(savedUser))
        }
    }, [])

    const handleLogin = (userData, userToken) => {
        setUser(userData)
        setToken(userToken)
    }

    const handleLogout = () => {
        localStorage.removeItem('adminToken')
        localStorage.removeItem('adminUser')
        setUser(null)
        setToken(null)
    }

    return (
        <>
            <nav>
                <Link to="/">
                    <div className='logo-section'>
                        <img src={siteLogo} alt="Site Logo" className='logo' />
                        <span>SCPI Browser</span>
                    </div>
                </Link>
                
                <div className='admin-section'>
                    {user ? (
                        <>
                            <span>Bienvenue, {user.username}</span>
                            <Link to="/admin">
                                <button>Dashboard Admin</button>
                            </Link>
                            <Link to="/">
                                <button onClick={handleLogout}>Déconnexion</button>                            
                            </Link>
                        </>
                    ) : (
                        <>
                            <span>Vous êtes admin?</span>
                            <button onClick={() => setShowLogin(true)}>Cliquez ici</button>
                        </>
                    )}
                </div>
            </nav>
            
            <Login 
                isOpen={showLogin}
                onClose={() => setShowLogin(false)}
                onLogin={handleLogin}
            />
        </>
    )
}