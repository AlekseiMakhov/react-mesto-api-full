import { useContext, useState } from 'react';
import cn from 'classnames';
import PopupWithForm from './PopupWithForm';
import ValidationContext from '../contexts/ValidationContext';

const AddPlacePopup = ({
      isOpen,
      onClose,
      onAddPlace,
      noClose,
      onInput
}) => {

    const validationContext = useContext(ValidationContext);

    const [link, setLink] = useState('');
    const [name, setName] = useState('');

    const handleNameChange = e => setName(e.target.value);
    const handleLinkChange = e => setLink(e.target.value);

    function handleSubmit(e) {
        e.preventDefault();
          if (validationContext.isValid) {
            onAddPlace({
                link,
                name
            });
        }
    }

    return (
        <PopupWithForm
            name='place'
            title='Новое место'
            children={
                <>
                    <input onInput={onInput} value={name??''} onChange={handleNameChange} name="name" id="0" type="text" minLength="1" maxLength="40" className={cn('popup-form__text-input', { 'popup-form__text-input_type_error': !validationContext.validation[0] })} placeholder="Название" required />
                    <span id="image-input-error" className={cn('popup-form__error-text', { 'popup-form__error-text_show': !validationContext.validation[0] })}>{validationContext.validationText[0]}</span>
                    <input onInput={onInput} value={link??''} onChange={handleLinkChange} name="link" id="1" type="url" className={cn('popup-form__text-input', { 'popup-form__text-input_type_error': !validationContext.validation[1] })} placeholder="Ссылка на картинку" required />
                    <span id="link-input-error" className={cn('popup-form__error-text', { 'popup-form__error-text_show': !validationContext.validation[1] })}>{validationContext.validationText[1]}</span>
                </>
            }
            isOpen={isOpen}
            onClose={onClose}
            onSubmit={handleSubmit}
            noClose={noClose}
        />
    );
}

export default AddPlacePopup;
