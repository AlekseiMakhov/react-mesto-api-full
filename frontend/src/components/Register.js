import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

const Register = ({ 
    onRegister, 
    setSignInScreen 
}) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const history = useHistory();

    const handleEmailInput = (e) => setEmail(e.target.value);
    const handlePasswordInput = (e) => setPassword(e.target.value);

    const handleSubmit = (e) =>  {
        e.preventDefault();
        if (!email || !password) {
            return;
        }
        onRegister(email, password);
    }

    const onSignInClick = _ => {
        history.push('/signin');
        setSignInScreen();
    }

    return (
        <form name="login" className="sign" onSubmit={handleSubmit}>
            <h2 className="sign__title">Регистрация</h2>
            <input name="email" id="email" type="email" value={email} onChange={handleEmailInput} className='sign__input' placeholder="Email" required />
            <input name="password" id="password" type="password" minLength="6" value={password} onChange={handlePasswordInput} className='sign__input' placeholder="Пароль" required />
            <button type='submit' className='sign__button'>Зарегистрироваться</button>
            <p className="sign__text" onClick={onSignInClick}>Уже зарегистрированы? Войти</p>
        </form>
    );
}

export default Register;