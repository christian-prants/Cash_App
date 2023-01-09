import React, { useContext, useState, useEffect } from "react";

import { AuthContext } from "../Context/Auth";

import styles from "./Table.module.css";

const Table = () => {
    const { user, funcGetTransactions } = useContext(AuthContext);
    const [transactions, setTransactions] = useState([]);
    const [userAccountId, setUserAccountId] = useState("");
    const [isChecked, setIsChecked] = useState('todos');

    useEffect(() => {
        //console.log('atualizou state')
        //console.log(transactions)
    }, [transactions]);

    const handleCheck = (e) => {
        setIsChecked(e.target.value)
    }

    const handleGetTrans = async () => {
        if (isChecked === "todos") {
            const getTrans = await funcGetTransactions(isChecked, user);

            setTransactions(getTrans.data.transactions);
            setUserAccountId(getTrans.data.userAccId);
        }

        if (isChecked === "cashin") {
            const getTrans = await funcGetTransactions(isChecked, user);
            setTransactions(getTrans.data.transactions);
        }

        if (isChecked === "cashout") {
            const getTrans = await funcGetTransactions(isChecked, user);
            setTransactions(getTrans.data.transactions);
        }
    };

    const handleCleanTable = () => {
        setTransactions("");
    };

    return (
        <>
            <div className={styles.filtro}>
                <h1>FILTRAR POR:</h1>
                <div className={styles.radios}>
                    <input
                        type="radio"
                        value="todos"
                        id="todos"
                        name="same"
                        checked={isChecked === "todos"}
                        onChange={handleCheck}
                    />
                    <label htmlFor="todos">TODOS</label>
                </div>
                <div className={styles.radios}>
                    <input
                        type="radio"
                        value="cashin"
                        id="cashin"
                        name="same"
                        checked={isChecked === "cashin"}
                        onChange={handleCheck}
                    />
                    <label htmlFor="cashin">CREDITADO</label>
                </div>
                <div className={styles.radios}>
                    <input
                        type="radio"
                        value="cashout"
                        id="cashout"
                        name="same"
                        checked={isChecked === "cashout"}
                        onChange={handleCheck}
                    />
                    <label htmlFor="cashout">DEBITADO</label>
                </div>
            </div>

            <div className={styles.general}>
                    <div className={styles.selectors}>
                        <button onClick={handleGetTrans}>Buscar Transações</button>
                        <button onClick={handleCleanTable}>Limpar</button>
                    </div>

                <div className={styles.table}>
                    <table>
                        <tbody>
                        <tr>
                            <th>Tipo da Transação</th>
                            <th>Valor</th>
                            <th>Data da Transferência</th>
                        </tr>
                        {Object.values(transactions).map((index) => {
                            const {
                            createdAt,
                            creditedAccountId,
                            debitedAccountId,
                            id,
                            value,
                            } = index;
                            return (
                            <tr key={id}>
                                {debitedAccountId === userAccountId ? (
                                <td>Cash Out</td>
                                ) : (
                                <td>Cash In</td>
                                )}

                                <td>{Number(value).toFixed(2)}</td>
                                <td>
                                {new Date(createdAt).toLocaleDateString("br") +
                                    " às " +
                                    new Date(createdAt).getUTCHours() +
                                    ":" +
                                    new Date(createdAt).getUTCMinutes() +
                                    ":" +
                                    new Date(createdAt).getUTCSeconds()}
                                </td>
                            </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default Table;
