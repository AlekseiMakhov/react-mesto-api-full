import { useContext } from 'react';
import Card from './Card';
import CurrentUserContext from '../contexts/CurrentUserContext';

const Main = ({
    onEditProfile,
    onEditAvatar,
    onAddPlace,
    onCardClick,
    onCardLike,
    onDeleteCard,
    cards
}) => {
    const currentUser = useContext(CurrentUserContext);
    
    return (
        <main className="content">
            <section className="profile">
                <div className="avatar" onClick={onEditAvatar}>
                    <img className="avatar__img" src={currentUser.avatar} alt="Аватар" />
                    <div className="avatar__edit-icon"></div>
                </div>
                <div className="profile-info">
                    <div>
                        <h1 className="profile-info__name">{currentUser.name}</h1>
                        <p className="profile-info__description">{currentUser.about}</p>
                    </div>
                    <button type="button" className="profile-info__edit-button" onClick={onEditProfile}></button>
                </div>
                <button type="button" className="add-image-button" onClick={onAddPlace}></button>
            </section>

            <section className="elements">

                {cards.map((card) => (
                        <Card
                            key={card._id}
                            card={card}
                            onCardClick={onCardClick}
                            onLikeButtonClick={onCardLike}
                            onCardDeleteClick={onDeleteCard}
                        />
                ))}

            </section>

        </main>
    );
}

export default Main;
