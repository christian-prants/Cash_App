import React, { useState, useContext } from 'react'

import Card from '../Components/UI/Card';

import { api } from '../Lib/Axios';
import { AuthContext } from '../Context/Auth';

import imgLogo from '../Assets/logo.png';
import styles from './Login.module.css';
import { Link } from 'react-router-dom';

const Login = () => {
    const { login } = useContext(AuthContext);

    const [inputUser, setInputUser] = useState('');
    const [inputPassword, setInputPassword] = useState('');

    const changeUser = (event) => {
        setInputUser(event.target.value);
    }
    const changePassword= (event) => {
        setInputPassword(event.target.value);
    }

    const handleLogin = async (event) => {
        event.preventDefault();

        if (inputUser === '' || inputPassword === ''){
            alert('O campo Username/Password não podem ser vazios.')
        } else { 
            login(inputUser, inputPassword);
        }   

        setInputUser('');
        setInputPassword('');
    }

    return (
        <>     
            <Card className={styles.login}> 
                <img src = {imgLogo} alt = 'logo NG Cash' />
                <form onSubmit={ handleLogin }>
                    <label htmlFor="username">Username</label>
                    <input 
                        id="username" 
                        type="text" 
                        value={inputUser} 
                        onChange={ changeUser } 
                    />
                    
                    <label htmlFor="userpassword">Password</label>
                    <input 
                        id="userpassword" 
                        type="text" 
                        value={inputPassword} 
                        onChange={ changePassword } 
                    />
                    <div className={styles.login_cc }>
                        <a>Não possui uma conta ainda? </a>
                        <Link to='/signup' className={styles.login_cc_link}>Clique aqui para criar!</Link>
                    </div>                    
                    <button className={styles.login_btn}>Login</button>
                </form>
            </Card>
        </>
    )
}

export default Login;

export const getServerSideProps = async() => {
    const [usersCountResponse, accountsCountResponse, transactionsCountResponse] = await Promise.all([
      api.get('users/count'),
      api.get('accounts/count'),
      api.get('transactions/count')
    ])
  
    return {
      props: {
        usersCount: usersCountResponse.data.count,
        accountsCount: accountsCountResponse.data.count,
        transactionsCount: transactionsCountResponse.data.count,
      }
    }
  }