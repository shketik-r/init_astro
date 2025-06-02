
import LazyLoad from "vanilla-lazyload";
import { vBoxHandler } from "./utils/vBox";
import { Select } from "../../components/_UI/Select/Select";


document.addEventListener("DOMContentLoaded", () => {

  const lazyLoad = new LazyLoad({
    elements_selector: ".lazy",
  });

  lazyLoad.update();

  // Инициализация компонентов и обработчиков
  // общие


  // компоненты

  Select.initAll("[data-select]");
  // <--

  // События
  document.addEventListener("click", (e) => {
    const target = e.target;
    vBoxHandler(e, target);
  });

  document.addEventListener("vBoxContentLoaded", () => {
    // lazyLoad.update();
    Select.initAll("[data-select]");
  });
});

