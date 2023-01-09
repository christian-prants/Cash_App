import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { api, createSessions, getTransactions, getCashIn, getCashOut  } from '../Lib/Axios';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const navigate = useNavigate();
  const [user, setUser] = useState('');  
  const [balance, setBalance] = useState('');
  const [loading, setLoading] = useState(true);
  const [sumTransfer, setSumTransfer] = useState('');
  const [sumReceived, setSumReceived] = useState('');

  useEffect(() => {
    const recoverUser = localStorage.getItem("user");
    const recoverBalance = localStorage.getItem("balance");
    const recoverReceived = localStorage.getItem("received");
    const recoverTransfer = localStorage.getItem("transfer");

    if (recoverUser) {
      setUser(JSON.parse(recoverUser))
      setBalance(JSON.parse(recoverBalance))
      setSumReceived(JSON.parse(recoverReceived))
      setSumTransfer(JSON.parse(recoverTransfer))
    }

    setLoading(false)
  }, [])

  const updateBalance = async (newBalance, username) => {
    setBalance(newBalance)
    const received = await calcCashInTransaction(username);
    const transfer = await calcCashOutTransaction(username);
    setSumReceived(received);
    setSumTransfer(transfer);
  }

  const calcCashInTransaction = async (username) => {
    const getCashIn = await funcGetTransactions('cashin', username);  
    let sumCashIn = 0;

    Object.values(getCashIn.data.transactions).map((index => {
      const { createdAt, creditedAccountId, debitedAccountId, id, value, } = index;      
      sumCashIn = sumCashIn + value
    }))

    return (sumCashIn)
  }

  const calcCashOutTransaction = async (username) => {
    const getCashOut = await funcGetTransactions('cashout', username);
    let sumCashOut = 0;
    
    Object.values(getCashOut.data.transactions).map((index => {
      const { createdAt, creditedAccountId, debitedAccountId, id, value, } = index;      
      sumCashOut = sumCashOut + value
    }))
    return (sumCashOut);
  } 

  const funcGetTransactions = async (filter, user) => {
    if (filter === "todos") {
        const getTrans = await getTransactions(user);
        return (getTrans)
    }

    if (filter === "cashin") {        
        const getTrans = await getCashIn(user);
        return (getTrans)
    }

    if (filter === "cashout") {
        const getTrans = await getCashOut(user);
        return (getTrans)
    }    
  };

  const login = async (username, password) => {
    try {
      const response = await createSessions(username, password)
      const received = await calcCashInTransaction(username);
      const transfer = await calcCashOutTransaction(username);
      
      const logInUser = response.data.username
      const token = response.data.token
      const { balance: logInbalance } = response.data.getUserBalance      

      localStorage.setItem("user", JSON.stringify(logInUser));
      localStorage.setItem("balance", JSON.stringify(logInbalance));
      localStorage.setItem("received", JSON.stringify(received));
      localStorage.setItem("transfer", JSON.stringify(transfer));
      localStorage.setItem("token", token);

      api.defaults.headers.Authorization = `Bearer ${token}`;

      setBalance(logInbalance);
      setUser(logInUser);      
      setSumReceived(received);
      setSumTransfer(transfer);

      navigate("/")
    } catch (error) {
      if (error.response?.data?.message === 'Todos os campos devem ser preenchidos.') {
        alert('Todos os campos devem ser preenchidos.')
      }
    }               
  }

  const openMenu = (isOpen) => {
    return isOpen
  }

  const openTrans = (isOpen) => {
    return isOpen
  }

  const logout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    localStorage.removeItem("balance")
    localStorage.removeItem("received")
    localStorage.removeItem("transfer")
    api.defaults.headers.Authorization = ''
    setBalance('')
    setUser('')
    navigate("/login")
  }

  return (
    <AuthContext.Provider value = {{authenticated: !!user, user, balance, loading, sumReceived, sumTransfer, updateBalance, login, logout, openMenu, openTrans, funcGetTransactions}}>
        {children}
    </AuthContext.Provider>
  )
}

