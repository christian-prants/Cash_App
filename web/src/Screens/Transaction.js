import React, { useState, useContext } from 'react'

import { makeTransaction, getAccountBalance } from '../Lib/Axios';
import { AuthContext } from "../Context/Auth";

import Card from '../Components/UI/Card';
import styles from './Transaction.module.css';
    
const Transaction = ({ setIsOpen }) => {
    const { user, updateBalance, balance } = useContext(AuthContext);
    const [inputUser, setInputUser] = useState('');
    const [inputCash, setInputCash] = useState(0);

    const changeUser = (event) => {
        setInputUser(event.target.value);
    }
    const changeCash= (event) => {
        setInputCash(event.target.value);
    }

    const handleTransfer = async (event) => {
        event.preventDefault();

        if (inputUser === '' || inputCash === 0){
            alert('O campo Destinatário/Valor não podem ser vazio/zero.')
            return
        }         

        try {
            const response = await makeTransaction(user, inputUser, inputCash);

            if (response.data.message === 'OK') {
                const newBalance = await getAccountBalance(user);               
                updateBalance(newBalance.data.account.balance)
                alert('Transferência realizada com sucesso!')
            }
        } catch (error) {
            if (error.response?.data?.message === 'Saldo insuficiente.') {
                alert('Saldo insuficiente.')
            }

            if (error.response?.data?.message === 'Não é possível transferir saldo para si mesmo.') {
                alert('Não é possível transferir saldo para si mesmo.')
            }
            //if (!error.response.data.message) {
            //    alert('Ocorreu um erro durante o processo, transferência não efetuada.')
            //}
        }        

        setInputUser('');
        setInputCash(0);
    }

    return (
        <>            
            <div className={styles.bg} onClick={() => {setIsOpen(false)}} />
            <div className={styles.centered}>
                <Card className={styles.transaction}> 
                    <button className={styles.fecharBtn} onClick={() => {setIsOpen(false)}}>X</button>
                    <h1>Transferir Saldo</h1>
                    <form onSubmit={ handleTransfer }>
                        
                        <label htmlFor="cashInUser">Destinatário:</label>
                        <input 
                            id="cashInUser" 
                            type="text" 
                            value={inputUser} 
                            onChange={ changeUser } 
                        />
                        <label htmlFor="cashInValue">Valor à ser transferido:</label>
                        <input 
                            id="cashInValue" 
                            type="number" 
                            value={inputCash} 
                            onChange={ changeCash } 
                        />
                        <button className={styles.transferirBtn}>Transferir</button>
                    </form>
                </Card>
            </div>
        </>
    )
}

export default Transaction;