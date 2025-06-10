
import LazyLoad from "vanilla-lazyload";
import { vBoxHandler } from "./utils/vBox";
import { Select } from "../../components/_UI/Select/Select";
import { initCustomSelects } from "../../components/_UI/CustomSelect/CustomSelect";
import { initCustomInputDate } from "@components/_UI/CustomInputDate/CustomInputDate";

document.addEventListener("DOMContentLoaded", () => {

  const lazyLoad = new LazyLoad({
    elements_selector: ".lazy",
  });

  lazyLoad.update();

  // Инициализация компонентов и обработчиков
  // общие


  // компоненты

  // Select.initAll("[data-select]");
  // initCustomSelects('[custom-select]');
  // initCustomInputDate();

  // Инициализация после загрузки DOM

  let lightboxElems = document.querySelectorAll('[data-lightbox]')

if (lightboxElems.length > 0) {
  
  lightbox.options.disableScrolling = true;
  lightbox.options.fitImagesInViewport = true;
  lightbox.options.wrapAround = true;
  lightbox.options.resizeDuration = 700;
}


  // <--

  // События
  document.addEventListener("click", (e) => {
    const target = e.target;
    vBoxHandler(e, target);
  });

  document.addEventListener("vBoxContentLoaded", () => {
    // lazyLoad.update();
    // Select.initAll("[data-select]");
    // initCustomSelects('[custom-select]');
    lightbox.init();
  });
});

