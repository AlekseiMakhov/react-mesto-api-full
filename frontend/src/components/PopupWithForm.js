import cn from 'classnames';
import { useContext } from 'react';
import LoadingState from '../contexts/LoadingState';
import ValidationContext from '../contexts/ValidationContext';

const PopupWithForm = ({
    name,
    title,
    children,
    isOpen,
    onClose,
    onSubmit,
    noClose
}) => {
    const validationContext = useContext(ValidationContext);
    const loadingText = useContext(LoadingState);

    return (
        <>
            <section className={cn(`popup popup_type_${name}`, { popup_opened: isOpen })} onClick={onClose}>
                <form className="popup-form" name={name} onSubmit={onSubmit} onClick={noClose}>
                    <button type="button" name="Закрыть" className="popup-form__close-button" onClick={onClose}></button>
                    <h3 className="popup-form__title">{title}</h3>
                    {children}
                    <button className={cn('popup-form__submit-button', { 'popup-form__submit-button_disabled': !validationContext.isValid })} >{loadingText}</button>
                </form>
            </section>
        </>
    );
}

export default PopupWithForm;
