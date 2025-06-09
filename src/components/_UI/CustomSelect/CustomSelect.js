class CustomSelect {
  constructor(root) {
    this.root = root;
    this._toggleDropdownBind = this._toggleDropdown.bind(this);
    this._optionClickHandlerBind = this._optionClickHandler.bind(this);
    this._outsideClickHandlerBind = this._outsideClickHandler.bind(this);
    this._blurHandlerBind = this._blurHandler.bind(this);
  }

  init() {
    this._getElements();
    this.options = Array.from(this.selectElement.options);
    this._createDropdown();
    this._renderOptions();
    this._setSelectedIndex(this.selectElement.selectedIndex || 0);
    this._setupEvents();
  }
  _getElements() {
    this.selectElement = this.root.querySelector('select');
    this.box = this.root.querySelector('[custom-select-box]');
    this.value = this.box.querySelector('[custom-select-value]');
  }
  _createDropdown() {
    this.dropdown = document.createElement('div');
    this.dropdown.className = 'select__options';
    this.root.appendChild(this.dropdown);
  }
  _renderOptions() {
    this.dropdown.innerHTML = '';
    this.options.forEach((option, index) => {
      const optDiv = document.createElement('div');
      optDiv.className = 'select__option';
      optDiv.textContent = option.textContent;
      optDiv.dataset.value = option.value;
      optDiv.dataset.index = index;
      if (option.disabled) optDiv.classList.add('disabled');
      if (option.hidden) optDiv.classList.add('hidden');
      this.dropdown.appendChild(optDiv);
    });
  }
  _setSelectedIndex(index) {
    this.selectedIndex = index;
    const selectedOption = this.options[index];
    this.value.textContent = selectedOption.textContent;
    this._highlightOption(index);
    this.selectElement.selectedIndex = index;
    this.selectElement.dispatchEvent(new Event('change'));
  }
  _highlightOption(index) {
    const optionDivs = this.dropdown.querySelectorAll('.select__option');
    optionDivs.forEach((opt, i) => {
      if (i === index) {
        opt.classList.add('active');
        opt.scrollIntoView({ block: 'nearest' });
      } else {
        opt.classList.remove('active');
      }
    });
  }
  _toggleDropdown(e) {
    e.stopPropagation();
    this.root.classList.toggle('open');
  }
  _closeDropdown() {
    this.root.classList.remove('open');
  }

  _setupEvents() {
    this.box.addEventListener('click', this._toggleDropdownBind);
    this.dropdown.addEventListener('click', this._optionClickHandlerBind);
    document.addEventListener('click', this._outsideClickHandlerBind);
    this.box.addEventListener('blur', this._blurHandlerBind);
  }

  _optionClickHandler(e) {
    if (e.target.classList.contains('select__option')) {
      if (e.target.classList.contains('disabled')) return;
      const idx = parseInt(e.target.dataset.index, 10);
      this._setSelectedIndex(idx);
      this._closeDropdown();
      this.box.focus();
    }
  }

  _outsideClickHandler(e) {
    if (this.root.classList.contains('open')) {
      if (e.target.classList.contains('disabled')) return;
      this._closeDropdown();
    }
  }
  _blurHandler() {
    setTimeout(() => {
      if (!this.root.contains(document.activeElement)) {
        this._closeDropdown();
      }
    }, 150);
  }

  _openDropdown() {
    this.root.classList.add('open');
    this._highlightOption(this.selectedIndex);
  }

  _destroy() {
    this.box.removeEventListener('click', this._toggleDropdownBind);
    this.dropdown.removeEventListener('click', this._optionClickHandlerBind);
    document.removeEventListener('click', this._outsideClickHandlerBind);
    this.box.removeEventListener('blur', this._blurHandlerBind);
    if (this.dropdown) {
      this.dropdown.remove();
    }
    this.selectElement = null;
    this.box = null;
    this.value = null;
    this.dropdown = null;
    this.options = null;
  }
}


export const initCustomSelects = (root) => {
  const selects = document.querySelectorAll(root);
  if (selects.length === 0) return;
  selects.forEach(selectElement => {
    // Если селект уже инициализирован, сначала уничтожаем старый экземпляр
    if (selectElement._selectInstance) {
      selectElement._selectInstance._destroy();
    }
    // Создаем новый экземпляр и инициализируем
    const instance = new CustomSelect(selectElement);
    instance.init();
    // Сохраняем экземпляр для повторного управления
    selectElement._selectInstance = instance;
  });
};
