export class Select {
  constructor(select) {
    this.options = {};
    this.select = select;
    this.arrSelectedValue = [];
  }

  init() {
    this.selectContainer = typeof this.select === "string" ? document.querySelector(this.select) : this.select;;
    this.getElements();
    this.getOptions();
    this.button.addEventListener('click', () => this.toggleOptions());
    this.populateOptions();
    document.addEventListener('click', (event) => this.handleClickOutside(event));
  }
  getElements() {
    this.selectedValue = this.selectContainer.querySelector('[data-select-value]');
    this.optionsContainer = this.selectContainer.querySelector('[data-select-options]');
    this.button = this.selectContainer.querySelector('[data-select-btn]');
    this.inputAll = this.selectContainer.querySelectorAll('[data-select-option]');
    this.placeholder = this.selectedValue.dataset.selectPlaceholder;
  }

  getOptions() {
    this.options = {
      // закрыть после выбора (по умолчанию false)
      closeAfterSelection: this.selectContainer.dataset.closeSelection ? JSON.parse(this.selectContainer.dataset.closeSelection) : false,
      // показывать выбранные значения (по умолчанию true)
      showSelectedValue: this.selectContainer.dataset.showValue ? JSON.parse(this.selectContainer.dataset.showValue) : true,
    }
  }

  populateOptions() {
    if (this.inputAll.length < 0) {
      this.selectedValue.textContent = this.placeholder ? this.placeholder : "пустой селект!";
      return;
    }
    this.inputAll.forEach(input => {
      input.checked && this.arrSelectedValue.push(input.value);
      input.addEventListener('change', () => this.addValue())
    });
    // Показываем выбранные значения
    this.selectOption();
  }

  toggleOptions() {
    this.selectContainer.classList.toggle('_show');
  }

  addValue() {
    this.arrSelectedValue = [];
    // Добавляем в массив выбранные значения
    this.inputAll.forEach(input => input.checked && this.arrSelectedValue.push(input.value));
    // Показываем выбранные значения
    this.selectOption();
  }

  selectOption() {
    // Если ничего не выбрано
    if (this.arrSelectedValue.length === 0) {
      // Устанавливаем значение по умолчанию     
      this.selectedValue.textContent = this.placeholder ? this.placeholder : 'Выберите';
      return;
    };
    // Показываем выбранные значения 
    if (this.options.showSelectedValue) {
      this.selectedValue.textContent = this.arrSelectedValue.join(', ');
      this.selectedValue.title = this.selectedValue.textContent;
    }else{
      this.selectedValue.textContent = this.placeholder ? this.placeholder : 'Выберите';
       this.selectedValue.title = this.selectedValue.textContent;
    }

    // если closeAfterSelection = true - закрыть после выбора
    this.options.closeAfterSelection && this.selectContainer.classList.remove('_show');
  }

  handleClickOutside(event) {
    if (!this.selectContainer.contains(event.target)) {
      this.selectContainer.classList.remove('_show');
    }
  }
}


