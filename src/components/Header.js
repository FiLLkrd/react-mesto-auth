import React from "react";
import HeaderLogo from "../images/header-logo.svg";

export default function Header() {
  return (
    <div className="header">
      <div>
      <img src={HeaderLogo} alt="Логотип" className="header__logo" />
      </div>
      <div className="header__user">
      <p className="header__email">email@yandex.ru</p>
      <a href="" className="header__link">Выйти</a>
      </div>
    </div>
  );
}
