import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { api, createSessions } from '../Lib/Axios';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const navigate = useNavigate();
  const [user, setUser] = useState('');  
  const [balance, setBalance] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const recoverUser = localStorage.getItem("user");
    const recoverBalance = localStorage.getItem("balance");

    if (recoverUser) {
      setUser(JSON.parse(recoverUser))
      setBalance(JSON.parse(recoverBalance))
    }

    setLoading(false)
  }, [])

  const updateBalance = async (newBalance) => {
    setBalance(newBalance)
  }

  const login = async (username, password) => {
    
    try {
      const response = await createSessions(username, password)

      const logInUser = response.data.username
      const token = response.data.token
      const { balance: logInbalance } = response.data.getUserBalance
      console.log(logInbalance)

      localStorage.setItem("user", JSON.stringify(logInUser))
      localStorage.setItem("balance", JSON.stringify(logInbalance))
      localStorage.setItem("token", token)

      api.defaults.headers.Authorization = `Bearer ${token}`

      setBalance(logInbalance)
      setUser(logInUser)
      navigate("/")
    } catch (error) {
      if (error.response?.data?.message === 'Todos os campos devem ser preenchidos.') {
        alert('Todos os campos devem ser preenchidos.')
      }
    }               
  }

  const logout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    localStorage.removeItem("balance")
    api.defaults.headers.Authorization = ''
    setBalance('')
    setUser('')
    navigate("/login")
  }

  return (
    <AuthContext.Provider value = {{authenticated: !!user, user, balance, loading, updateBalance, login, logout}}>
        {children}
    </AuthContext.Provider>
  )
}

