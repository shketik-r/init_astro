
import LazyLoad from "vanilla-lazyload";
import { vBoxHandler } from "./vBox";
import { Select } from "../../components/_UI/Select/Select";
import "../styles/style.scss";

document.addEventListener("DOMContentLoaded", () => {

  // const lazyLoad = new LazyLoad({
  //   elements_selector: ".lazy",
  // });

  // lazyLoad.update();

  // Инициализация компонентов и обработчиков
  // общие


  // компоненты


  function initSelect() {
    const selects = document.querySelectorAll("[data-select]:not([data-initialized])");
    if (selects) {
      selects.forEach((select) => {
        const selectComponent = new Select(select);
        selectComponent.init();
        select.setAttribute('data-initialized', 'true');
      });
    }
  }

  initSelect();
  // <--

  // События
  document.addEventListener("click", (e) => {
    const target = e.target;
    vBoxHandler(e, target);
  });

  document.addEventListener("vBoxContentLoaded", () => {
    // lazyLoad.update();
    initSelect();
  });
});

