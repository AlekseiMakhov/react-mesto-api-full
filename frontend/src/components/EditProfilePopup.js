import { 
    useContext, 
    useEffect, 
    useState 
} from 'react';
import cn from 'classnames';
import PopupWithForm from './PopupWithForm';
import CurrentUserContext from '../contexts/CurrentUserContext';
import ValidationContext from '../contexts/ValidationContext';

const EditProfilePopup = ({
    isOpen,
    onClose,
    onUpdateUser,
    noClose,
    onInput
}) => {
    const currentUser = useContext(CurrentUserContext);
    const validationContext = useContext(ValidationContext);

    const [name, setName] = useState(currentUser.name);
    const [about, setAbout] = useState(currentUser.about);

    useEffect((_) => {
        setName(currentUser.name);
        setAbout(currentUser.about);
    }, [currentUser]);

    function handleSubmit(e) {
        e.preventDefault();
        if (validationContext.isValid) {
            onUpdateUser({
                name,
                about
            });
        }
    }

    return (
        <PopupWithForm
            name='profile'
            title='Редактировать профиль'
            children={
            <>
                <input onInput={onInput} name="name" id="name0" type="text" minLength="2" maxLength="40" value={name??''} onChange={(e) => setName(e.target.value)} className={cn('popup-form__text-input', { 'popup-form__text-input_type_error': !validationContext.validation[0] })} placeholder="Имя" required />
                <span id="name-input-error" className={cn('popup-form__error-text', { 'popup-form__error-text_show': !validationContext.validation[0] })}>{validationContext.validationText[0]}</span>
                <input onInput={onInput} name="about" id="about1" type="text" minLength="2" maxLength="200" value={about??''} onChange={(e) => setAbout(e.target.value)} className={cn('popup-form__text-input', { 'popup-form__text-input_type_error': !validationContext.validation[1] })} placeholder="О себе" required />
                <span id="about-input-error" className={cn('popup-form__error-text', { 'popup-form__error-text_show': !validationContext.validation[1] })}>{validationContext.validationText[1]}</span>
            </>
            }
            isOpen={isOpen}
            onClose={onClose}
            onSubmit={handleSubmit}
            noClose={noClose}
        />
    );
}

export default EditProfilePopup;
