import React, { useEffect, useState } from "react";

import Header from "./Header";
import Footer from "./Footer";
import Main from "./Main";
import ImagePopup from "./ImagePopup";
import PopupWithForm from "./PopupWithForm";
import apiRequest from '../utils/api'
import EditAvatarPopup from "./EditAvatarPopup";
import EditProfilePopup from "./EditProfilePopup";
import CurrentUserContext from "../contexts/CurrentUserContext";
import AddPlacePopup from "./AddPlacePopup";

function App() {
  const [editAvatarPopupOpen, setEditAvatarPopupOpen] = useState(false);
  const [editProfilePopupOpen, setEditProfilePopupOpen] = useState(false);
  const [addCardPopupOpen, setAddCardPopupOpen] = useState(false);
  const [ImagePopupOpen, setImagePopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [isRenderLoading, setIsRenderLoading] = useState(false);

  useEffect(() => {
    Promise.all([
        apiRequest.getUserInfo(),
        apiRequest.getCards()
    ]).then(([userData, cardData]) => {
        setCurrentUser(userData);
        setCards(cardData);
    }).catch(err => console.log(err));
}, []);
  

  function handleAvatarPopupClick() {
    setEditAvatarPopupOpen(true);
  }

  function handleProfilePopupClick() {
    setEditProfilePopupOpen(true);
  }

  function handleAddCardPopupClick() {
    setAddCardPopupOpen(true);
  }

  function closePopup() {
    setEditAvatarPopupOpen(false);
    setEditProfilePopupOpen(false);
    setAddCardPopupOpen(false);
    setImagePopupOpen(false);
  }

  function handleCardClick(card) {
    setImagePopupOpen(true);
    setSelectedCard({
      name: card.name,
      link: card.link,
    });
  }

  function handleCardDelete(card) {
    apiRequest
      .deleteCard(card._id)
      .then(() => {
        setCards((cardsArr) =>
          cardsArr.filter((cardItem) => cardItem._id !== card._id)
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleCardLike(card) {
    const liked = card.likes.some((user) => user._id === currentUser._id);
    apiRequest
      .changeLikeCard(card._id, !liked)
      .then((newCard) => {
        setCards((cards) =>
          cards.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleEditAvatar({ avatar }) {
    apiRequest
      .editAvatar(avatar)
      .then((res) => {
        setCurrentUser(res);
        closePopup();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleEditUser({ name, about }) {
    setIsRenderLoading(true);
    apiRequest
      .editProfile({ name, about })
      .then((res) => {
        setCurrentUser(res);
        closePopup();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleAddCard({ title, link }) {
    console.log(title, link);
    apiRequest
      .addNewCard({ title, link })
      .then((res) => {
        setCards((cards) => [res, ...cards]);
        closePopup();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <div className="page">
      <CurrentUserContext.Provider value={currentUser}>
        <Header />
        <Main
          cards={cards}
          onProfilePopup={handleProfilePopupClick}
          onAddPopup={handleAddCardPopupClick}
          onAvatarPopup={handleAvatarPopupClick}
          onCardClick={handleCardClick}
          onCardLike={handleCardLike}
          onCardDelete={handleCardDelete}
        />
        <Footer />
        <EditProfilePopup
          opened={editProfilePopupOpen}
          closed={closePopup}
          editUserInfo={handleEditUser}
          isRenderLoading={isRenderLoading}
        />
        <AddPlacePopup
          opened={addCardPopupOpen}
          closed={closePopup}
          openAddPlace={handleAddCard}
        />
        <ImagePopup
          name="fullscreen-image"
          card={selectedCard}
          closed={closePopup}
          opened={ImagePopupOpen}
        />
        <PopupWithForm
          name="delete-card"
          title="Вы уверены?"
          buttonText="Да"
          closed={closePopup}
        />
        <EditAvatarPopup
          opened={editAvatarPopupOpen}
          closed={closePopup}
          openEditAvatar={handleEditAvatar}
        />
      </CurrentUserContext.Provider>
    </div>
  );
}

export default App;
