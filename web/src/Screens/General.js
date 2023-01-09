import React, { useContext, useState } from 'react';

import { AuthContext } from '../Context/Auth';

import Chart from '../Components/UI/Chart';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faReceipt, faArrowRightArrowLeft, faMoneyBill } from '@fortawesome/free-solid-svg-icons';
import styles from './General.module.css';

const General = () => {
    const { balance, sumTransfer, sumReceived } = useContext(AuthContext);
    const [isShown, setIsShown] = useState(false);

    return (
        <>  
            <div className = {styles.general}>
                <div className = {styles.boxes}>
                    <div className = {styles.icon}>
                        <FontAwesomeIcon icon = {faReceipt} />
                    </div>
                    
                    <div>
                        <h1>Saldo Atual:</h1> 
                        <p>${ Number(balance).toFixed(2) }</p> 
                    </div>
                </div>

                <div className = {styles.boxes}>
                    <div className = {styles.icon}>
                        <FontAwesomeIcon icon = {faArrowRightArrowLeft} />
                    </div>
                    
                    <div className = {styles.debit}>
                        <h1>Total Transferido:</h1> 
                        <p>${ Number(sumTransfer).toFixed(2) }</p> 
                    </div>
                </div>

                <div className = {styles.boxes}>
                    <div className = {styles.icon}>
                        <FontAwesomeIcon icon = {faMoneyBill} />
                    </div>
                    
                    <div className = {styles.credit}>
                        <h1>Total Recebido:</h1> 
                        <p>${ Number(sumReceived).toFixed(2) }</p> 
                    </div>
                </div>
            </div>

            <div className = {styles.chart}>
                <Chart isShown = {isShown} />          
            </div>
        </>
    )
    
}

export default General;