export class GlanceBox {
  constructor(selector) {
    this.items = [...document.querySelectorAll(selector)];
    this.init();
    this.targetKey = 0;
    this.saveContentElement = 0;
  }

  init() {
    this.eventsBox();
  }

  eventsBox() {
    this.items.forEach((el) => {
      el.addEventListener('click', (event) => {
        event.preventDefault();
        const targetEvent = event.currentTarget;

        const type = targetEvent.dataset.glancebox;

        const options = {
          title: targetEvent.dataset.glanceboxTitle
        };

        let indexElement = 0;

        this.items.forEach((item) => {
          if (type === item.dataset.glancebox) {
            item.setAttribute("data-key", indexElement++);
            this.saveContentElement++;
          }
        });

        this.targetKey = Number(targetEvent.dataset.key);
        this.renderWindow(targetEvent, options);
      });
    });
  }

  renderWindow(targetEl, options) {
    const glanceContainer = document.createElement('div');
    glanceContainer.className = 'glancebox';
    glanceContainer.innerHTML = `
      <div class="glancebox-controls">
        <button class="glancebox-button glancebox-close">&times;</button>
        <button class="glancebox-button glancebox-prev">&#8592;</button>
        <button class="glancebox-button glancebox-next">&#8594;</button>
      </div>
      <div class="glancebox-wrap">
        <div class="glancebox-content"></div>
        <div class="glancebox-details">
          <span>${this.targetKey + 1} / ${this.saveContentElement}</span> 
          <span>${options.title? options.title : ''}</span>
        </div>
      </div>
      
    `;
    document.body.appendChild(glanceContainer);
    const content = glanceContainer.querySelector('.glancebox-content');

    this.updateContent(content, targetEl)

    this.addControls(glanceContainer);
  }

  addControls(glance) {
    const btnClose = glance.querySelector('.glancebox-close');
    const btnPrev = glance.querySelector('.glancebox-prev');
    const btnNext = glance.querySelector('.glancebox-next');

    btnClose.addEventListener('click', () => this.close(glance));
    btnPrev.addEventListener('click', () => this.prev());
    btnNext.addEventListener('click', () => this.next());

    glance.addEventListener("click", (event) => {
      if (event.target === glance) {
        this.close(glance);
      }

    });
  }

  close(div) {
    document.body.removeChild(div);
    this.resetKeys();
  }

  resetKeys() {
    this.targetKey = 0;
    this.saveContentElement = 0;
    document.querySelectorAll('[data-key]').forEach(el => el.removeAttribute('data-key'));
  }

  prev() {
    this.targetKey = (this.targetKey <= 0) ? this.saveContentElement - 1 : this.targetKey - 1;
    this.updateContentInLightbox();
  }

  next() {
    this.targetKey = (this.targetKey >= this.saveContentElement - 1) ? 0 : this.targetKey + 1;
    console.log(this.targetKey);
    
    this.updateContentInLightbox();
  }

  updateContentInLightbox() {
    const content = document.querySelector('.glancebox-content');
    const targetEl = document.querySelector(`[data-key="${this.targetKey}"]`);
    if (targetEl) {
      this.updateContent(content, targetEl);
    }
  }

  updateContent(content, targetEl) {
    content.innerHTML = ''; // Очищаем предыдущее содержимое
    const imgSrc = targetEl.src || targetEl.getAttribute('href');
    if (imgSrc) {
      const img = document.createElement('img');
      img.src = imgSrc;
      content.appendChild(img);
    }
  }

}
