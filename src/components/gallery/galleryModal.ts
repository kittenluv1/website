import { closeModal, initModals, openModal } from "@/components/modal/modal.ts";

export const GALLERY_MODAL_ID = "galleryModal";
export const GALLERY_IMAGE_PARAM = "image";

const INIT_KEY = "galleryModalInit";

function getModal() {
  return document.querySelector<HTMLDialogElement>(
    `dialog[data-modal-id="${GALLERY_MODAL_ID}"]`,
  );
}

function getModalImage() {
  return document.getElementById("gallery-modal-image") as HTMLImageElement | null;
}

function getModalCaption() {
  return document.getElementById("gallery-modal-caption") as HTMLElement | null;
}

function getGalleryItem(index: number) {
  const button = document.querySelector<HTMLElement>(
    `[data-gallery-item="${index}"]`,
  );
  if (!button) return null;

  const img = button.querySelector("img");
  if (!img) return null;

  return {
    src: img.currentSrc || img.src,
    caption: button.querySelector(".caption")?.textContent?.trim() || img.alt || "",
  };
}

function getGalleryItemCount() {
  return document.querySelectorAll("[data-gallery-item]").length;
}

function setItemParam(index: number | null, replace = false) {
  const url = new URL(window.location.href);
  if (index === null) {
    url.searchParams.delete(GALLERY_IMAGE_PARAM);
  } else {
    url.searchParams.set(GALLERY_IMAGE_PARAM, String(index));
  }

  const next = `${url.pathname}${url.search}${url.hash}`;
  if (replace) {
    window.history.replaceState({ galleryImage: index }, "", next);
  } else {
    window.history.pushState({ galleryImage: index }, "", next);
  }
}

function showImage(index: number) {
  const item = getGalleryItem(index);
  if (!item) return;

  const img = getModalImage();
  const caption = getModalCaption();
  if (!img) return;

  img.src = item.src;
  img.alt = item.caption;

  if (caption) {
    if (item.caption) {
      caption.textContent = item.caption;
      caption.hidden = false;
    } else {
      caption.textContent = "";
      caption.hidden = true;
    }
  }
}

function openGalleryModal(index: number, replace = false) {
  const count = getGalleryItemCount();
  if (index < 0 || index >= count) return;
  if (!getGalleryItem(index)) return;

  bindModalCloseListener();
  showImage(index);
  openModal(GALLERY_MODAL_ID);
  setItemParam(index, replace);
}

function syncFromUrl(replace = false) {
  const raw = new URLSearchParams(window.location.search).get(GALLERY_IMAGE_PARAM);
  if (raw === null) {
    if (getModal()?.open) {
      closeModal(GALLERY_MODAL_ID);
    }
    return;
  }

  const index = Number.parseInt(raw, 10);
  if (Number.isNaN(index)) return;

  openGalleryModal(index, replace);
}

function handleGalleryModalClose() {
  if (new URLSearchParams(window.location.search).has(GALLERY_IMAGE_PARAM)) {
    setItemParam(null, true);
  }
}

function bindModalCloseListener() {
  const modal = getModal();
  if (!modal || modal.dataset.galleryCloseBound === "true") return;

  modal.dataset.galleryCloseBound = "true";
  modal.addEventListener("close", handleGalleryModalClose);
}

function handleDocumentClick(e: MouseEvent) {
  const trigger = (e.target as HTMLElement).closest<HTMLElement>(
    "[data-gallery-item]",
  );
  if (!trigger) return;

  const index = Number.parseInt(trigger.dataset.galleryItem ?? "", 10);
  if (Number.isNaN(index)) return;

  openGalleryModal(index);
}

export function initGalleryModal() {
  if (document.documentElement.dataset[INIT_KEY]) return;
  document.documentElement.dataset[INIT_KEY] = "true";

  initModals();

  document.addEventListener("click", handleDocumentClick);
  window.addEventListener("popstate", () => syncFromUrl(true));

  syncFromUrl(true);
}
