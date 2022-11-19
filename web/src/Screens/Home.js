import React, { useContext, useState } from 'react';

import { AuthContext } from '../Context/Auth';

import Transaction from "../Screens/Transaction";
import Table from '../Components/Helpers/Table';
import styles from './Home.module.css';
import imgLogo from '../Assets/logo.png';

const Home = () => {
    const { logout, balance } = useContext(AuthContext);
    const [isChecked, setIsChecked] = useState('todos');
    const [isOpen, setIsOpen] = useState(false);

    const handleCheck = (e) => {
        setIsChecked(e.target.value)
    }

    const handleMakeTrans = () => {
        setIsOpen(true)
    }

    const handleLogout = () => {
        logout();
    }
    return (
        <>  
            { isOpen && <Transaction setIsOpen = {setIsOpen} />}
            <div className={styles.home}>
                <div className={styles.barra_sup}>
                    <img src = {imgLogo} alt = 'logo NG Cash' />
                    <button className={styles.buscarBtn} onClick={ handleMakeTrans }>Realizar Transação</button>
                    <h1>SALDO: { Number(balance).toFixed(2) } </h1> 
                    <button onClick = {handleLogout}>LOGOUT</button>
                </div>

                <div className={styles.filtro}>
                    <h1>FILTRAR POR:</h1>
                        <div>
                            <input 
                                type = "radio" 
                                value = "todos" 
                                id = "todos" 
                                name = "same" 
                                checked = {isChecked === "todos"}
                                onChange = {handleCheck}
                            />
                            <label htmlFor = "cashin">TODOS</label>
                        </div>
                        <div>
                            <input 
                                type = "radio" 
                                value = "cashin" 
                                id = "cashin" 
                                name = "same" 
                                checked = {isChecked === "cashin"}
                                onChange = {handleCheck}
                            />
                            <label htmlFor = "cashin">CASH IN</label>
                        </div>
                        <div>
                            <input 
                                type = "radio" 
                                value = "cashout" 
                                id = "cashout" 
                                name = "same" 
                                checked = {isChecked === "cashout"}
                                onChange = {handleCheck}
                            />
                            <label htmlFor = "cashout">CASH OUT</label>  
                        </div>                                 
                </div>

                <div className={styles.tabela}>
                    <Table props={isChecked} />
                </div>
            </div>
            
        </>
    )
}

export default Home;