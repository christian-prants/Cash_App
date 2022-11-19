import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useContext } from 'react';

import { AuthProvider, AuthContext } from '../Context/Auth';

import Login from '../Screens/Login';
import Home from '../Screens/Home';
import SignUp from '../Screens/SignUp';

const AppRoutes = () => {
    const Private = () => {
        const { authenticated, loading } = useContext(AuthContext);

        if (loading) {
            return (
                <div className='loading'>Carregando...</div>
            )
        }

        if (!authenticated) {
            return (
                <Navigate to = "/login" />
            )
        }
        
        return ( <Home /> )
    }

    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route path = "/login" element = {<Login />} />
                    <Route path = "/signup" element = {<SignUp />} />
                    <Route path = "/" element = {<Private />} />
                </Routes>
            </AuthProvider>
        </Router>
    )
}

export default AppRoutes;