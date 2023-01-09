import React, { useContext, useState } from 'react';

import { AuthContext } from '../../Context/Auth';

import styles from './Menu.module.css';

const Menu = ({setIsOpen, setMakeTrans, setSearchTrans}) => {
    const { logout, openMenu, openTrans } = useContext(AuthContext);

    const handleMakeTrans = () => {
        setMakeTrans(openTrans(true));
        setSearchTrans(openMenu(false));
        setIsOpen(openMenu(false)); 
    }

    const handleSearchTrans = () => {
        setSearchTrans(openMenu(true));
        setIsOpen(openMenu(false)); 
    }

    const handleLogout = () => {
        openMenu(false);
        logout();
    }

    return (
        <>  
            <div className = {styles.bg} />           
            <div className={ styles.menu }>
                <button onClick = { handleMakeTrans }>Realizar Transação</button>
                <button onClick = { handleSearchTrans }>Pesquisar Transações</button>
                <button onClick = { handleLogout }>Sair</button>
            </div>
        </> 
    )
}

export default Menu;