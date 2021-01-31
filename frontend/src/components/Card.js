import { useContext } from 'react';
import CurrentUserContext from '../contexts/CurrentUserContext';

const Card = ({
    card,
    onCardClick,
    onLikeButtonClick,
    onCardDeleteClick
}) => {
    const currentUser = useContext(CurrentUserContext);
    const isOwn = card.owner === currentUser._id;
    function handleCardClick() {
      onCardClick(card);
    }

    const cardDeleteButtonClassName = `element__trash-button ${isOwn ? 'element__trash-button_visible' : ''}`;
    const isLiked = card.likes.some((i) => i === currentUser._id);
    const cardLikeButtonClassName = `like__button ${isLiked ? 'like__button_pressed' : ''}`;

    return (
        <div className="element" id={card.id}>
            <img className="element__image" src={card.link} alt={`${card.name}.Фото`} onClick={handleCardClick} />
            <button type="button" className={cardDeleteButtonClassName} onClick={() => onCardDeleteClick(card)}></button>
            <h3 className="element__text">{card.name}</h3>
            <div className="like">
                <button type="button" className={cardLikeButtonClassName} onClick={() => onLikeButtonClick(card)}></button>
                <p className="like__count">{card.likes.length}</p>
            </div>
        </div>
    );
}

export default Card;
