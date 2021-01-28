import cn from 'classnames';
import { 
    useContext, 
    useState 
} from 'react';
import ValidationContext from '../contexts/ValidationContext';
import PopupWithForm from './PopupWithForm';

const EditAvatarPopup = ({
    isOpen,
    onClose,
    onUpdateAvatar,
    noClose,
    onInput
}) => {
    const validationContext = useContext(ValidationContext);

    const [avatar, setAvatar] = useState('');

    function handleSubmit(e) {
        e.preventDefault();
        if (validationContext.isValid) {
            onUpdateAvatar({ avatar });
            setAvatar('');
        }
    }

    const handleAvatarChange = e => setAvatar(e.target.value);

    return (
        <PopupWithForm
            name='avatar'
            title='Обновить аватар'
            children={
                <>
                    <input onInput={onInput} name="avatar" value={avatar??''} onChange={handleAvatarChange} id="avatar0" type="url" className={cn('popup-form__text-input', { 'popup-form__text-input_type_error': !validationContext.validation[0] })} placeholder="Ссылка на картинку" required />
                    <span id="avatar-error" className={cn('popup-form__error-text', { 'popup-form__error-text_show': !validationContext.validation[0] })}>{validationContext.validationText[0]}</span>
                </>
            }
            isOpen={isOpen}
            onClose={onClose}
            onSubmit={handleSubmit}
            noClose={noClose}
        />
    );
}

export default EditAvatarPopup;
