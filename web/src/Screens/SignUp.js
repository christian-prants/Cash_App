import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

import Card from '../Components/UI/Card';
import validator from 'validator';

import { api, createUser } from '../Lib/Axios';

import imgLogo from '../Assets/logo.png';
import styles from './SignUp.module.css';
   
const SignUp = () => {
    const navigate = useNavigate();
    const [inputUser, setInputUser] = useState('');
    const [inputPassword, setInputPassword] = useState('');

    const changeUser = (event) => {
        setInputUser(event.target.value);
    }
    const changePassword= (event) => {
        setInputPassword(event.target.value);
    }
    const navigateLogin = () => {
        navigate('/login');
    }

    const handleSignUp = async (event) => {
        event.preventDefault();

        if (inputUser === '' || inputPassword === ''){
            alert('O campo Username/Password não podem ser vazios.')
            return
        } 

        if (inputUser.length < 3){
            alert('O campo Username deve ser maior que dois caracteres.')
            return
        } 
        
        if ((!validator.isStrongPassword(inputPassword, { minLength: 8, minLowercase: 0, minUppercase: 1, minNumbers: 1, minSymbols: 0}))) {
            alert('O campo Password, deve conter no mínimo 8 characteres, 1 letra maiúscula, 1 número.')
            return
        } 
        
        try {
            const response = await createUser(inputUser, inputPassword);

            if (response.data) {
                alert('Usuário criado com sucesso!')
                navigateLogin();
            }
        } catch (error) {
            if (error.response?.data?.message === 'Username já está em uso, escolha outro.') {
                alert('Username já está em uso, escolha outro.')
            }
        }        

        setInputUser('');
        setInputPassword('');
    }

    return (
        <>            
            <Card className={styles.signup}> 
                <button className={styles.retornaBtn} onClick = {navigateLogin}><FaArrowLeft /></button>
                <img src = {imgLogo} alt = 'logo NG Cash' />
                <h1>Criar Conta</h1>
                <form onSubmit={ handleSignUp }>
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
                    <button className={styles.signup_btn}>Criar Conta</button>
                </form>
            </Card>
        </>
    )
}

export default SignUp;

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