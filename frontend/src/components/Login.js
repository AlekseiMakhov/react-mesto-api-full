import React, { useState } from 'react';

const Login = ({ onLogin }) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleEmailInput = (e) => setEmail(e.target.value);
    const handlePasswordInput = (e) => setPassword(e.target.value);

    const handleSubmit = (e) =>  {
        e.preventDefault();
        if (!email || !password) {
            return;
        }
        onLogin(email, password);
    } 

    return (
        <form name="login" className="sign" onSubmit={handleSubmit}>
            <h2 className="sign__title">Вход</h2>
            <input name="email" id="email" type="email" value={email} onChange={handleEmailInput} className='sign__input' placeholder="Email" required />
            <input name="password" id="password" type="password" minLength="6" value={password} onChange={handlePasswordInput} className='sign__input' placeholder="Пароль" required />
            <button type='submit' className='sign__button'>Войти</button>
        </form>
    );
}

export default Login;