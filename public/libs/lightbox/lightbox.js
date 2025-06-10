(function (root) {
  function Lightbox(options) {
    this.album = [];
    this.currentImageIndex = undefined;
    this.options = Object.assign({}, Lightbox.defaults, options);
    console.log(options);

    this.init();
  }

  Lightbox.defaults = {
    albumLabel: 'Изображение %1 из %2',
    alwaysShowNavOnTouchDevices: false,
    fadeDuration: 600,
    fitImagesInViewport: true,
    imageFadeDuration: 600,
    positionFromTop: 0,
    resizeDuration: 700,
    showImageNumberLabel: true,
    wrapAround: false,
    disableScrolling: false,
    showDownload: false,
    sanitizeTitle: false
  };

  Lightbox.prototype.init = function () {
    document.addEventListener('DOMContentLoaded', () => {
      this.build();
      this.enable();
    });
  };

  Lightbox.prototype.enable = function () {
    document.body.addEventListener('click', (event) => {
      const target = event.target.closest('a[data-lightbox], a[rel^="lightbox"]');
      if (target) {
        event.preventDefault();
        this.start(target);
      }
    });
  };

  Lightbox.prototype.build = function () {
    if (document.getElementById('lightbox')) return;

    const overlay = document.createElement('div');
    overlay.id = 'lightboxOverlay';
    overlay.className = 'lightboxOverlay';
    overlay.tabIndex = -1;

    const lightbox = document.createElement('div');
    lightbox.id = 'lightbox';
    lightbox.className = 'lightbox';
    lightbox.tabIndex = -1;

    lightbox.innerHTML = `
        <div class="lb-outerContainer">
          <div class="lb-container">
            <img class="lb-image" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" alt=""/>
            <div class="lb-video" style="display: none;"></div>
            <div class="lb-nav">
              <a href="#" class="lb-prev" role="button" aria-label="Предыдущее изображение"></a>
              <a href="#" class="lb-next" role="button" aria-label="Следующее изображение"></a>
            </div>
            <div class="lb-loader"></div>
          </div>
        </div>
        <div class="lb-dataContainer">
              <span class="lb-caption"></span>
              <span class="lb-number"></span>
        </div>
        <div class="lb-closeContainer">
          <button type="button" class="lb-close" aria-label="Закрыть"></button>
        </div>
      `;

    document.body.appendChild(overlay);
    document.body.appendChild(lightbox);

    this.overlay = overlay;
    this.lightbox = lightbox;
    this.image = lightbox.querySelector('.lb-image');
    this.videoContainer = lightbox.querySelector('.lb-video');
    this.prev = lightbox.querySelector('.lb-prev');
    this.next = lightbox.querySelector('.lb-next');
    this.loader = lightbox.querySelector('.lb-loader');
    this.caption = lightbox.querySelector('.lb-caption');
    this.number = lightbox.querySelector('.lb-number');
    this.close = lightbox.querySelector('.lb-close');
    this.outerContainer = lightbox.querySelector('.lb-outerContainer');
    this.dataContainer = lightbox.querySelector('.lb-dataContainer');

    overlay.addEventListener('click', () => this.end());
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) this.end();
    });

    this.prev.addEventListener('click', (e) => {
      e.preventDefault();
      if (this.currentImageIndex === 0) {
        this.changeImage(this.album.length - 1);
      } else {
        this.changeImage(this.currentImageIndex - 1);
      }
    });

    this.next.addEventListener('click', (e) => {
      e.preventDefault();
      if (this.currentImageIndex === this.album.length - 1) {
        this.changeImage(0);
      } else {
        this.changeImage(this.currentImageIndex + 1);
      }
    });

    this.close.addEventListener('click', () => this.end());

    // Keyboard navigation
    this.keyDownHandler = (e) => {
      if (!this.lightbox.style.display || this.lightbox.style.display === 'none') return;
      switch (e.key) {
        case 'Escape':
          this.end();
          break;
        case 'ArrowLeft':
          if (this.currentImageIndex === 0) {
            if (this.options.wrapAround) this.changeImage(this.album.length - 1);
          } else {
            this.changeImage(this.currentImageIndex - 1);
          }
          break;
        case 'ArrowRight':
          if (this.currentImageIndex === this.album.length - 1) {
            if (this.options.wrapAround) this.changeImage(0);
          } else {
            this.changeImage(this.currentImageIndex + 1);
          }
          break;
      }
    };
    document.addEventListener('keydown', this.keyDownHandler);
  };

  Lightbox.prototype.start = function (link) {
    this.sizeOverlay();

    this.album = [];
    let imageNumber = 0;

    const addToAlbum = (ele) => {
      this.album.push({
        alt: ele.getAttribute('data-alt') || '',
        link: ele.getAttribute('href'),
        title: ele.getAttribute('data-title') || ele.getAttribute('title') || '',
        download: ele.getAttribute('data-download') || ele.getAttribute('download') || ''
      });
    };

    const dataLightboxValue = link.getAttribute('data-lightbox');
    let links;

    if (dataLightboxValue) {
      links = Array.from(document.querySelectorAll(`a[data-lightbox="${dataLightboxValue}"]`));
      links.forEach((ele, idx) => {
        addToAlbum(ele);
        if (ele === link) imageNumber = idx;
      });
    } else if (link.getAttribute('rel') === 'lightbox') {
      addToAlbum(link);
    } else {
      links = Array.from(document.querySelectorAll(`a[rel="${link.getAttribute('rel')}"]`));
      links.forEach((ele, idx) => {
        addToAlbum(ele);
        if (ele === link) imageNumber = idx;
      });
    }

    this.lightbox.style.top = window.scrollY + this.options.positionFromTop + 'px';
    this.lightbox.style.left = window.scrollX + 'px';

    this.lightbox.style.display = 'flex';
    this.overlay.style.display = 'block';

    if (this.options.disableScrolling) document.body.classList.add('lb-disable-scrolling');

    this.changeImage(imageNumber);
  };

  Lightbox.prototype.showLocalVideo = function (videoUrl) {
    this.videoContainer.style.display = 'block';
    this.videoContainer.innerHTML = `
    <video controls autoplay style="width: 100%; height: 100%;">
      <source src="${videoUrl}" type="video/${this.getVideoType(videoUrl)}">
      Ваш браузер не поддерживает воспроизведение видео.
    </video>
  `;
    this.loader.style.display = 'none';
    this.image.style.display = 'none';
    this.caption.textContent = ''; // Очистить подпись для видео
    this.number.style.display = 'none';
    this.updateNav();
  };

  Lightbox.prototype.getVideoType = function (url) {
    const ext = url.split('.').pop().toLowerCase();
    switch (ext) {
      case 'mp4': return 'mp4';
      case 'webm': return 'webm';
      case 'ogg': return 'ogg';
      default: return '';
    }
  };

  Lightbox.prototype.changeImage = function (imageNumber) {
    const imageInfo = this.album[imageNumber];
    if (!imageInfo) return;

    this.loader.style.display = 'block';
    this.image.style.display = 'none';
    this.videoContainer.style.display = 'none';

    // Проверяем тип ссылки
    if (imageInfo.link.match(/\.(mp4|webm|ogg)$/i)) {
      this.showLocalVideo(imageInfo.link);
      this.outerContainer.style.width = 80 + 'vw';
      this.outerContainer.style.height = 80 + 'vh';

    } else if (imageInfo.link.includes('youtube.com') || imageInfo.link.includes('youtu.be')) {
      this.showVideo(imageInfo.link);
      this.outerContainer.style.width = 80 + 'vw';
      this.outerContainer.style.height = 80 + 'vh';

    } else {
      this.showImage(imageInfo);
    }
  };

  Lightbox.prototype.showImage = function (imageInfo) {
    this.loader.style.display = 'block';
    this.image.style.display = 'none';

    const img = new Image();
    img.src = imageInfo.link;

    img.onload = () => {
      this.image.src = img.src;
      this.image.alt = imageInfo.alt;

      this.sizeContainer(img.width, img.height);

      this.currentImageIndex = this.album.indexOf(imageInfo);

      this.caption.textContent = imageInfo.title || '';
      if (imageInfo.title) this.caption.style.display = 'block';
      else this.caption.style.display = 'none';

      if (this.album.length > 1 && this.options.showImageNumberLabel) {
        this.number.textContent = this.options.albumLabel.replace('%1', (this.currentImageIndex + 1)).replace('%2', this.album.length);
        this.number.style.display = 'block';
      } else {
        this.number.style.display = 'none';
      }

      this.loader.style.display = 'none';
      this.image.style.display = 'block';

      this.updateNav();
    };

    img.onerror = () => {
      // Ошибка загрузки
      this.loader.style.display = 'none';
      this.image.style.display = 'block';
      this.caption.textContent = 'Ошибка загрузки изображения';
    };
  };

  Lightbox.prototype.showVideo = function (videoUrl) {
    this.videoContainer.style.display = 'block';
    this.videoContainer.innerHTML = this.createVideoIframe(videoUrl);
    this.loader.style.display = 'none';
    this.image.style.display = 'none';
    this.caption.textContent = ''; // Clear caption for video
    this.updateNav();
  };

  Lightbox.prototype.createVideoIframe = function (videoUrl) {
    const videoId = this.getYouTubeVideoId(videoUrl);
    if (videoId) {
      this.number.style.display = 'none';
      return `<iframe width="100%" height="100%" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`;
    }
    return '';
  };

  Lightbox.prototype.getYouTubeVideoId = function (url) {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^&\n]{11})/;
    const matches = url.match(regex);
    return matches ? matches[1] : null;
  };

  Lightbox.prototype.sizeOverlay = function () {
    this.overlay.style.width = Math.max(document.documentElement.scrollWidth, window.innerWidth) + 'px';
    this.overlay.style.height = Math.max(document.documentElement.scrollHeight, window.innerHeight) + 'px';
  };

  Lightbox.prototype.sizeContainer = function (imageWidth, imageHeight) {
    // Ограничиваем размеры для вьюпорта
    const maxWidth = window.innerWidth * 0.9;
    const maxHeight = window.innerHeight * 0.85;

    let displayWidth = imageWidth;
    let displayHeight = imageHeight;

    if (displayWidth > maxWidth) {
      displayWidth = maxWidth;
      displayHeight = imageHeight * (maxWidth / imageWidth);
    }
    if (displayHeight > maxHeight) {
      displayHeight = maxHeight;
      displayWidth = displayWidth * (maxHeight / displayHeight);
    }

    this.outerContainer.style.width = displayWidth + 'px';
    this.outerContainer.style.height = displayHeight + 'px';
    this.image.style.width = 'auto';
    this.image.style.height = displayHeight + 'px';
    this.dataContainer.style.width = displayWidth + 'px';
  };

  Lightbox.prototype.updateNav = function () {
    if (this.album.length > 1) {
      if (this.options.wrapAround) {
        this.prev.style.display = 'block';
        this.next.style.display = 'block';
      } else {
        this.prev.style.display = (this.currentImageIndex > 0) ? 'block' : 'none';
        this.next.style.display = (this.currentImageIndex < this.album.length - 1) ? 'block' : 'none';
      }
    } else {
      this.prev.style.display = 'none';
      this.next.style.display = 'none';
    }
  };

  Lightbox.prototype.end = function () {
    this.lightbox.style.display = 'none';
    this.overlay.style.display = 'none';
    this.videoContainer.innerHTML = ''; // Clear video on close

    if (this.options.disableScrolling) {
      document.body.classList.remove('lb-disable-scrolling');
    }
  };

  root.lightbox = new Lightbox();
})(window);

