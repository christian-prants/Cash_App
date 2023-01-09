import React, { useContext, useState } from 'react';

import { AuthContext } from '../Context/Auth';

import Menu from '../Components/UI/Menu';
import Transaction from './Transaction';
import Table from './Table';
import General from './General';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faClose } from '@fortawesome/free-solid-svg-icons';
import styles from './Home.module.css';
import imgLogo from '../Assets/logo.png';

const Home = () => {
    const { openMenu } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);
    const [makeTrans, setMakeTrans] = useState(false);
    const [searchTrans, setSearchTrans] = useState(false);

    const isMenuOpen = () => {
        if (!isOpen) {
            setIsOpen(openMenu(true));
        } else {
            setIsOpen(openMenu(false));
        }        
    }

    const retHome = () => {
        setSearchTrans(false);
    }

    return (
        <>  
            { 
                isOpen && <Menu setIsOpen = {setIsOpen} setMakeTrans = {setMakeTrans} setSearchTrans = {setSearchTrans} />
            }
            {
                makeTrans && <Transaction setMakeTrans = {setMakeTrans} setIsOpen = {setIsOpen} />
            }
            <div className={styles.home}>
                <div className={styles.barra_sup}>
                    <img src = {imgLogo} alt = 'logo' onClick={() => retHome()} />
                    <button onClick = { isMenuOpen }> 
                        {
                            ! isOpen ? <FontAwesomeIcon icon = {faBars} /> : <FontAwesomeIcon icon = {faClose} />
                        }                        
                    </button>
                </div>
                {               
                    !searchTrans &&  !makeTrans ? <General /> : ''
                }
                {               
                    searchTrans ? <Table /> : ''
                }
            </div>  
        </>
    )
    
}

export default Home;