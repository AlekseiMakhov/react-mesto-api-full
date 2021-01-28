import cn from 'classnames';

const ImagePopup = ({
    isOpen,
    onClose,
    card,
    noClose
}) => {
    return (
        <section id="view-image" className={cn('popup popup_type_dark', { popup_opened: isOpen })} onClick={onClose}>
            <div className="popup-image" onClick={noClose}>
                <button type="button" name="Закрыть" className="popup-image__close-button" onClick={onClose}></button>
                <img className="popup-image__image" src={card.link} alt={`${card.name}`.Фото} />
                <h3 className="popup-image__title">{card.name}</h3>
            </div>
        </section>
    );
}

export default ImagePopup;
