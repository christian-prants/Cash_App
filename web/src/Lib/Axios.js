import axios from 'axios';

export const api = axios.create({
    baseURL: 'http://localhost:3000/'
})

export const createSessions = async (username, password) => {
    return api.post('/api/v1/generateAccessToken', {username, password})
}

export const createUser = async (username, password) => {
    return api.post('/users', {username, password})
}

export const getAccountBalance = async (username) => {
    return api.post('/accounts', { username })
}

export const getTransactions = async (username) => {
    return api.post('/transactions', { username })
}

export const getCashIn = async (username) => {
    return api.post('/transactions/cashin', { username })
}

export const getCashOut = async (username) => {
    return api.post('/transactions/cashout', { username })
}

export const makeTransaction = async (username, receiver, value) => {
    return api.post('/transactions/cashout/operation', { username, receiver, value })
}