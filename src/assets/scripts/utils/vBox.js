import VenoBox from "venobox/dist/venobox";

const vboxOptions = {
  overlayColor: "rgba(22, 22, 22, 0.45)",
  bgcolor: null,
  spinner: "grid",
  onContentLoadedEvent: new Event("vBoxContentLoaded", { bubbles: true }),
  onContentLoaded: () => {
    document.dispatchEvent(vboxOptions.onContentLoadedEvent);
  },
  onPreOpen: () => {
    vBox.isOpen = true;
  },
  onPreClose: () => {
    vBox.isOpen = false;
  },
};

const vBox = new VenoBox(vboxOptions);

(window).vBox = vBox;
(window).openVBox = openVBox;

function openVBox(src, vbtype) {
  const link = document.createElement("a");
  link.href = src;
  link.setAttribute("data-vbtype", vbtype ? vbtype : "ajax");
  (link).settings = vBox.settings;

  vBox.close();
  setTimeout(() => {
    vBox.open(link);
  }, 500);
}

export function vBoxHandler(e, target) {
  const closePopup = target.closest("[data-vclose]");
  const vBoxLink = target.closest("[data-vbox]");

  if (vBoxLink) {
    e.preventDefault();

    if (!(vBoxLink).settings) {
      (vBoxLink).settings = vBox.settings;
    }

    const videoSrc = vBoxLink.getAttribute("data-video");

    if (videoSrc) {
      setVBoxCallback(() => setVideoSrc(videoSrc));
    }

    if (vBox.isOpen) {
      vBox.close();
      setTimeout(() => {
        vBox.open(vBoxLink);
      }, 500);
    } else {
      vBox.open(vBoxLink);
    }
  }

  if (closePopup) {
    vBox.close();
  }
}

export function setVBoxCallback(callback) {
  const vBoxCallback = () => {
    callback();
    document.removeEventListener("vBoxContentLoaded", vBoxCallback);
  };

  document.addEventListener("vBoxContentLoaded", vBoxCallback);
}

export function setVideoSrc(src) {
  const iframe = document.querySelector(
    ".vbox-content iframe[data-iframe]",
  );
  if (iframe) {
    iframe.setAttribute("src", src);
  }
}
