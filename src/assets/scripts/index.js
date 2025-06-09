
import LazyLoad from "vanilla-lazyload";
import { vBoxHandler } from "./utils/vBox";
import { Select } from "../../components/_UI/Select/Select";
import { initCustomSelects } from "../../components/_UI/CustomSelect/CustomSelect";
import { initCustomInputDate } from "@components/_UI/CustomInputDate/CustomInputDate";
import { GlanceBox } from "@components/_UI/GlanceBox/GlanceBox";


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

  window.lumobox = new GlanceBox('[data-glancebox]');


  // <--

  // События
  document.addEventListener("click", (e) => {
    const target = e.target;
    vBoxHandler(e, target);
  });

  document.addEventListener("vBoxContentLoaded", () => {
    // lazyLoad.update();
    // Select.initAll("[data-select]");
    //  initCustomSelects('[custom-select]');
  });
});

