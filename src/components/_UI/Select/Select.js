export class Select {
  
  constructor(select) {
    this.options = {};
    this.select = select;
    this.arrSelectedValue = [];
    // Биндим методы для корректного удаления и добавления слушателей
    this._onButtonClick = this._toggleOptions.bind(this);
    this._onDocumentClick = this._handleClickOutside.bind(this);
    this._onInputChange = this._addValue.bind(this);
  }

_init() {
    this.selectContainer =  this.select;
    this._getElements();
    this._getOptions();
    this._populateOptions();
    this.button.addEventListener('click', this._onButtonClick);
    document.addEventListener('click', this._onDocumentClick);
  }

  _destroy() {
    if (!this.button || !this.selectContainer) return;
    this.button.removeEventListener('click', this._onButtonClick);
    document.removeEventListener('click', this._onDocumentClick);
    // Удаляем обработчики change с инпутов
    this.inputAll.forEach(input => {
      input.removeEventListener('change', this._onInputChange);
    });
    this.arrSelectedValue = [];
    this.selectContainer.classList.remove('_show');
  }


  _getElements() {
    this.selectedValue = this.selectContainer.querySelector('[data-select-value]');
    this.optionsContainer = this.selectContainer.querySelector('[data-select-options]');
    this.button = this.selectContainer.querySelector('[data-select-btn]');
    this.inputAll = this.selectContainer.querySelectorAll('[data-select-option]');
    this.placeholder = this.selectedValue.dataset.selectPlaceholder;
  }

  _getOptions() {
    this.options = {
      closeAfterSelection: this.selectContainer.dataset.closeSelection ? JSON.parse(this.selectContainer.dataset.closeSelection) : false,
      showSelectedValue: this.selectContainer.dataset.showValue ? JSON.parse(this.selectContainer.dataset.showValue) : true,
    };
  }

  _populateOptions() {
    if (this.inputAll.length <= 0) {
      this.selectedValue.textContent = this.placeholder ? this.placeholder : "пустой селект!";
      return;
    }
    this.arrSelectedValue = [];

    this.inputAll.forEach(input => {
      if (input.checked) this.arrSelectedValue.push(input.value);
      input.addEventListener('change', this._onInputChange);
    });
    this._selectOption();
  }

  _toggleOptions() {
    this.selectContainer.classList.toggle('_show');
  }

  _addValue() {
    this.arrSelectedValue = [];
    this.inputAll.forEach(input => {
      if (input.checked) this.arrSelectedValue.push(input.value);
    });
    this._selectOption();
  }

  _selectOption() {
    if (this.arrSelectedValue.length === 0) {
      this.selectedValue.textContent = this.placeholder ? this.placeholder : 'Выберите';
      return;
    }

    if (this.options.showSelectedValue) {
      this.selectedValue.textContent = this.arrSelectedValue.join(', ');
      this.selectedValue.title = this.selectedValue.textContent;
    } else {
      this.selectedValue.textContent = this.placeholder ? this.placeholder : 'Выберите';
      this.selectedValue.title = this.selectedValue.textContent;
    }

    this.options.closeAfterSelection && this.selectContainer.classList.remove('_show');
  }

  _handleClickOutside(event) {
    if (!this.selectContainer.contains(event.target)) {
      this.selectContainer.classList.remove('_show');
    }
  }


 static initAll(target = '[data-select]') {
    const selects = document.querySelectorAll(target);
    console.log('initSelect');
    
    if(selects.length === 0) return;
    selects.forEach(selectElement => {
      // Если селект уже инициализирован, сначала уничтожаем старый экземпляр
      if (selectElement._selectInstance) {
        selectElement._selectInstance._destroy();
      }
      // Создаем новый экземпляр и инициализируем
      const instance = new Select(selectElement);
      instance._init();
      // Сохраняем экземпляр для повторного управления
      selectElement._selectInstance = instance;
    });
  }
}



