import React, { useContext, useState, useEffect } from "react";

import { AuthContext } from "../../Context/Auth";
import { getTransactions, getCashIn, getCashOut } from "../../Lib/Axios";


import styles from './Table.module.css';

const Table = (props) => {
    const { user } = useContext(AuthContext);
    const [transactions, setTransactions] = useState([]);
    const [ userAccountId, setUserAccountId] = useState('');

    useEffect(() => {
        //console.log('atualizou state')
        //console.log(transactions)
    }, [transactions])

    const handleGetTrans = async () => {
        const { props: isChecked } = props

        if (isChecked === "todos") {
            const getTrans = await getTransactions(user);
            setTransactions( getTrans.data.transactions)
            setUserAccountId(getTrans.data.userAccId)
        } 
        
        if (isChecked === "cashin") {
            const getTrans = await getCashIn(user);
            setTransactions( getTrans.data.transactions)
        }

        if (isChecked === "cashout") {
            const getTrans = await getCashOut(user);
            setTransactions( getTrans.data.transactions)
        }                 
    }

    const handleCleanTable = () => {
        setTransactions('')
    }

    return (
        <div>
            <button className={styles.buscarBtn} onClick={ handleGetTrans }>Buscar Transações</button>
            <button className={styles.limparBtn} onClick={ handleCleanTable }>Limpar Busca</button>
            <table>
                <tbody>
                <tr>
                    <th>Tipo da Transação</th>
                    <th>Valor</th>
                    <th>Data da Transferência</th>
                </tr>
                {                    
                    Object.values(transactions).map((index) => {
                        const {createdAt, creditedAccountId, debitedAccountId, id, value} = index;
                        return (
                            <tr key={id}>
                                {   debitedAccountId === userAccountId ? <td>Cash Out</td> 
                                    : <td>Cash In</td>                                     
                                }

                                <td>{Number(value).toFixed(2)}</td>
                                <td>{new Date(createdAt).toLocaleDateString('br') + ' às ' + new Date(createdAt).getUTCHours() + ':' + new Date(createdAt).getUTCMinutes()+ ':' + new Date(createdAt).getUTCSeconds()}</td>
                                
                            </tr>            
                        )        
                    })
                }
                </tbody>
            </table>
        </div>
    );
};

export default Table;
