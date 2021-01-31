import { Link } from 'react-router-dom';
import cn from 'classnames';
import logo from '../images/logo.svg';

const Header = ({ 
    isMobile, 
    email, 
    loggedIn, 
    isSignInLocation, 
    setSignInScreen, 
    resetSignInScreen, 
    handleSignOut, 
    isExpanded, 
    expand 
}) => {

    return (
        !isMobile 
        ?   <header className="header">
                <img className="header__logo" src={logo} alt="Лого" />
                <p className="header__text">{email}</p>
                {loggedIn && <Link className="header__text" onClick={handleSignOut} to='/signin'>Выйти</Link>}
                {!loggedIn && isSignInLocation && <Link className="header__text" onClick={resetSignInScreen} to='/signup'>Регистрация</Link>}
                {!loggedIn && !isSignInLocation && <Link className="header__text" onClick={setSignInScreen} to='/signin'>Войти</Link>}
            </header>
        
        :   <header className={cn('header-mobile', { 'header-mobile__expanded': isExpanded })}>
                <img className="header-mobile__logo" src={logo} alt="Лого" />
                {isExpanded && <p className="header-mobile__text header-mobile__text_type_email">{email}</p>}
                {loggedIn && isExpanded && <Link className={cn('header-mobile__text', { 'header-mobile__text_type_signout': isExpanded })} onClick={handleSignOut} to='/signin'>Выйти</Link>}
                {!loggedIn && isSignInLocation && <Link className="header-mobile__text" onClick={resetSignInScreen} to='/signup'>Регистрация</Link>}
                {!loggedIn && !isSignInLocation && <Link className="header-mobile__text" onClick={setSignInScreen} to='/signin'>Войти</Link>}
                {isExpanded && <div className='header-mobile__line'></div>}
                {loggedIn && <button className={cn('header-mobile__menu-button', { 'header-mobile__menu-button_type_close': isExpanded })} onClick={expand}></button>}
            </header>
    );
}

export default Header;
