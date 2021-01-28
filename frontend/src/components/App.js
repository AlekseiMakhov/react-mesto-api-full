import { 
    useState,
    useEffect 
} from 'react';
import { 
    Route, 
    Switch, 
    Redirect, 
    useHistory 
} from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import AddPlacePopup from './AddPlacePopup';
import EditAvatarPopup from './EditAvatarPopup';
import EditProfilePopup from './EditProfilePopup';
import ConfirmationPopup from './ConfirmationPopup';
import CurrentUserContext from '../contexts/CurrentUserContext';
import ValidationContext from '../contexts/ValidationContext';
import LoadingState from '../contexts/LoadingState';
import api from '../utils/api';
import Login from './Login';
import Register from './Register';
import ProtectedRoute from './ProtectedRoute';
import InfoTooltip from './InfoTooltip';
import ImagePopup from './ImagePopup';
import { authorize, register, tokenCheck } from '../utils/auth';

function App() {
    const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
    const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
    const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
    const [isPopupWithSubmitOpen, setIsPopupWithSubmitOpen] = useState(false);
    const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);
    const [selectedCard, setSelectedCard] = useState(false);
    const [loadingText, setLoadingText] = useState('');
    const [card, setCard] = useState({});
    const [cards, setCards] = useState([]);
    const [currentUser, setCurrentUser] = useState({});
    const [isSignInLocation, setIsSignInLocation] = useState(true);
    const [email, setEmail] = useState('');
    const [validationContext, setvalidationContext] = useState({ validation: [true, true], validationText: ['', ''], isValid: false });
    const history = useHistory();
    const [success, setSuccess] = useState(false);
    const isMobile = useMediaQuery({ query: '(max-width: 620px)' });
    const [isExpanded, setIsExpanded] = useState(false);

    // Элементам, которые требуется валидировать, нужно выставить уникальные id, которые заканчиваются на цифру от 0 до 9
    function handleInput(e) {
        const validArr = validationContext.validation;
        const textArr = validationContext.validationText;
        const index = Number(e.target.id[e.target.id.length-1]);
        let resValid = 0;

        validArr[index] = e.target.validity.valid;
        textArr[index] = e.target.validationMessage;

        for (let i = 0; i < validArr.length; i++) {
          resValid += Number(validArr[i]);
        }

        setvalidationContext({ 
            validation: validArr, 
            validationText: textArr, 
            isValid: (resValid === validArr.length) 
        });
    }

    // Закрытие модальных окон по Escape
    function handleEscButton(e) {
        if (e.key === 'Escape') {
            closeAllPopups();
        }
    }

    // Открытие формы редактирования аватара
    function handleEditAvatarClick() {
        setIsEditAvatarPopupOpen(true);
        setLoadingText('Изменить');
        // Устанавливаем параметры контекста для валидации текущей формы
        // validation - массив содержит число элементов = числу валидируемых элементов формы, принимает значение validity.valid
        // validationText - массив содержит число элементов = числу валидируемых элементов формы, принимает значение validationMessage
        // isValid - булева величина, содержит результат валидации всех полей, true - если все поля валидны
        setvalidationContext({ validation: [true], validationText: [''], isValid: false });
        document.addEventListener('keydown', handleEscButton);
    }

    // Открытие формы редактирования профиля
    function handleEditProfileClick() {
        setIsEditProfilePopupOpen(true);
        setLoadingText('Сохранить');
        // Устанавливаем параметры контекста для валидации текущей формы
        setvalidationContext({ validation: [true, true], validationText: ['', ''], isValid: true });
        document.addEventListener('keydown', handleEscButton);
    }

    // Открытие формы добавления карточки
    function handleAddPlaceClick() {
        setIsAddPlacePopupOpen(true);
        setLoadingText('Создать');
        // Устанавливаем параметры контекста для валидации текущей формы
        setvalidationContext({ validation: [true, true], validationText: ['', ''], isValid: false });
        document.addEventListener('keydown', handleEscButton);
    }
    
    // Отмена всплытия для закрытия по клику по оверлею
    function noClose(e) {
        e.stopPropagation();
    }

    // Клик по картинке, открытие увеличенной картинки
    function handleCardClick(card) {
        setSelectedCard(true);
        setCard(card);
        document.addEventListener('keydown', handleEscButton);
    }

    // Нажатие на кнопку удаления, открытие окна с подтверждением
    function handleDeleteCardClick(card) {
        setIsPopupWithSubmitOpen(true);
        setLoadingText('Да');
        setvalidationContext({ validation: [], validationText: [], isValid: true });
        setCard(card);
        document.addEventListener('keydown', handleEscButton);
    }

    // Чтение с сервера инфо пользователя, данных карточки
    useEffect(() => {
        Promise.all([
            api.getProfileInfo(),
            api.getInitialCards(),
        ])
            .then(([profileInfo, cardList]) => {
                setCurrentUser(profileInfo);
                setCards(cardList);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    // Убрать/поставить лайк карточке
    function handleCardLike(card) {
        const isLiked = card.likes.some((i) => i._id === currentUser._id);
          api.changeLikeStatus(card._id, !isLiked)
            .then((newCard) => {
                const newCards = cards.map((c) => (c._id === card._id ? newCard : c));
                setCards(newCards);
            })
            .catch((err) => {
                console.log(err);
            });
    }
    // Удаление карточки
    function handleDeleteCard(card) {
        setLoadingText('Удаление...');
        api.deleteCard(card._id)
            .then(() => {
                const newCards = cards.filter((c) => c._id !== card._id);
                setCards(newCards);
                closeAllPopups();
            })
            .catch((err) => {
                console.log(err);
            });
    }
    // Смена инфо пользователя
    function handleUpdateUser(userInfo) {
        setLoadingText('Сохранение...');
        api.editProfileInfo(userInfo)
            .then((userInfo) => {
                setCurrentUser(userInfo);
                closeAllPopups();
            })
            .catch((err) => {
                console.log(err);
            });
    }
    // Смена аватара
    function handleUpdateAvatar(user) {
        setLoadingText('Сохранение...');
        api.editAvatar(user.avatar)
            .then((userInfo) => {
                setCurrentUser(userInfo);
                closeAllPopups();
            })
            .catch((err) => {
                console.log(err);
            });
    }
    // Добавление карточки
    function handleAddPlace(newCard) {
        setLoadingText('Загрузка...');
        api.createNewCard(newCard)
            .then((newCard) => {
                setCards([newCard, ...cards]);
                closeAllPopups();
            })
            .catch((err) => {
                console.log(err);
            });
    }

    // Закрытие модальных окон, снятие слушателя Escape
    function closeAllPopups() {
        setIsEditAvatarPopupOpen(false);
        setIsEditProfilePopupOpen(false);
        setIsAddPlacePopupOpen(false);
        setIsPopupWithSubmitOpen(false);
        setSelectedCard(false);
        setIsInfoTooltipOpen(false);
        document.removeEventListener('keydown', handleEscButton);
        setvalidationContext({ validation: [], validationText: [], isValid: false });
        setCard({});
    }

    // Вход в систему  
    const handleLogin = _ => {
        setLoggedIn(true);
        history.push("/cards");
    }

    // Выход из системы  
    const handleSignOut = () => {
        localStorage.removeItem('token');
        setEmail('');
        setLoggedIn(false);
        setIsExpanded(false);
        setIsSignInLocation(true);
    }

    // Проверяем токен при загрузке страницы
    useEffect(()=>{
        checkToken();
    },[]);

    // Открываем всплывающее окошко
    const infoToolTipOpen = (type) => {
        setSuccess(type);
        setIsInfoTooltipOpen(true);
    }

    // Обработка запроса авторизации
    const onLogin = (email, password) => {
        authorize(email, password)   
            .then((data) => {
                if (data.token) {
                    localStorage.setItem('token', data.token);
                    handleLogin();
                    setEmail(email);
                }
            })  
            .catch(err => {
                console.log(err);
                infoToolTipOpen(false);
            });
    };

    // Обработка запроса регистрации
    const onRegister = (email, password) => {
        register(email, password)
        .then((res) => {
            if (res.data?._id) {
                infoToolTipOpen(true);
                history.push('/signin');
                setIsSignInLocation();
            }                   
        })
        .catch((err) => {
            console.log(err)
            infoToolTipOpen(false);
        });
    };

    // Проверка токена  
    const checkToken = () => {
        if (localStorage.getItem('token')) {
            const token = localStorage.getItem('token');
            tokenCheck(token)
            .then(res => {
                if (res.data?.email) {
                    setEmail(res.data.email);
                    handleLogin();
                }
            })
            .catch(err => console.log(err));
        }    
    }

    return (
        // Оборачиваем в контекст текущего пользователя
        <CurrentUserContext.Provider value={currentUser}>
            <Header 
                  isMobile={isMobile}
                  isExpanded={isExpanded}
                  email={email} 
                  loggedIn={loggedIn}
                  isSignInLocation={isSignInLocation}
                  setSignInScreen={()=>setIsSignInLocation(true)}
                  resetSignInScreen={()=>setIsSignInLocation(false)}
                  handleSignOut={handleSignOut}
                  resetEmail={()=>setEmail('')}
                  expand={()=>setIsExpanded(!isExpanded)}
            />
            {/* Оборачиваем в контекст стейта валидации */}
            <ValidationContext.Provider value={validationContext}>

                <Switch>
                    <ProtectedRoute 
                        path="/cards" 
                        loggedIn={loggedIn}  
                        component={Main} 
                        onEditProfile={handleEditProfileClick}
                        onEditAvatar={handleEditAvatarClick}
                        onAddPlace={handleAddPlaceClick}
                        onCardClick={handleCardClick}
                        onCardLike={handleCardLike}
                        onDeleteCard={handleDeleteCardClick}
                        cards={cards}
                    />
                      
                    <Route path="/signup">
                        <Register                             
                            // setOpen={infoToolTipOpen}
                            setSignInScreen={()=>setIsSignInLocation(true)}
                            onRegister={onRegister}
                        />

                    </Route>

                    <Route path="/signin">
                        <Login 
                            // setOpen={infoToolTipOpen}
                            onLogin={onLogin}
                        />
                    </Route>

                    <Route path="/">
                        {loggedIn ? <Redirect to="/cards" /> : <Redirect to="/signin" />}
                    </Route>
                </Switch>   
            
                <Footer />
          
                <LoadingState.Provider value={loadingText}>
                    <EditProfilePopup
                        isOpen={isEditProfilePopupOpen}
                        onClose={closeAllPopups}
                        onUpdateUser={handleUpdateUser}
                        noClose={noClose}
                        onInput={handleInput}
                    />

                    <EditAvatarPopup
                        isOpen={isEditAvatarPopupOpen}
                        onClose={closeAllPopups}
                        onUpdateAvatar={handleUpdateAvatar}
                        noClose={noClose}
                        onInput={handleInput}
                    />

                    <AddPlacePopup
                        isOpen={isAddPlacePopupOpen}
                        onClose={closeAllPopups}
                        onAddPlace={handleAddPlace}
                        noClose={noClose}
                        onInput={handleInput}
                    />

                    <ConfirmationPopup
                        isOpen={isPopupWithSubmitOpen}
                        onClose={closeAllPopups}
                        noClose={noClose}
                        onDeleteCard={handleDeleteCard}
                        card={card}
                    />
                  </LoadingState.Provider>
              </ValidationContext.Provider>

              <ImagePopup
                  isOpen={selectedCard}
                  onClose={closeAllPopups}
                  card={card}
                  noClose={noClose}
              />

              <InfoTooltip
                  success={success}
                  isOpen={isInfoTooltipOpen}
                  onClose={closeAllPopups}
                  noClose={noClose}
              />
        </CurrentUserContext.Provider>
    );
}

export default App;