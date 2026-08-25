import {
  CREATION_ITEM_PARAM,
  CREATION_MODAL_ID,
} from "@/lib/creations";
import { closeModal, initModals, openModal } from "@/components/modal/modal.ts";

const GRID_SELECTOR = "#creations-grid";
const IMAGE_FADE_MS = 200;

function getModal() {
  return document.querySelector<HTMLDialogElement>(
    `dialog[data-modal-id="${CREATION_MODAL_ID}"]`,
  );
}

function getPanels() {
  return document.querySelectorAll<HTMLElement>("[data-creation-panel]");
}

function getPanelCount() {
  return getPanels().length;
}

function getActivePanel() {
  return document.querySelector<HTMLElement>(
    `[data-creation-panel]:not(.hidden)`,
  );
}

function getPanelImageIndex(panel: HTMLElement) {
  return Number.parseInt(panel.dataset.imageIndex ?? "0", 10) || 0;
}

function setPanelImageIndex(panel: HTMLElement, index: number) {
  panel.dataset.imageIndex = String(index);
}

function dimGrid(dim: boolean) {
  const grid = document.querySelector<HTMLElement>(GRID_SELECTOR);
  if (grid) {
    grid.style.opacity = dim ? "0.6" : "1";
  }
}

function showPanel(index: number) {
  getPanels().forEach((panel) => {
    const panelIndex = Number.parseInt(panel.dataset.creationPanel ?? "", 10);
    const active = panelIndex === index;
    panel.classList.toggle("hidden", !active);
    if (active) {
      resetPanelImage(panel);
    }
  });
}

function resetPanelImage(panel: HTMLElement) {
  setPanelImageIndex(panel, 0);
  setPanelImage(panel, 0, false);
}

function updateImageDots(panel: HTMLElement, activeIndex: number) {
  panel.querySelectorAll<HTMLElement>("[data-creation-dot]").forEach((dot) => {
    const dotIndex = Number.parseInt(dot.dataset.creationDot ?? "", 10);
    const active = dotIndex === activeIndex;
    dot.classList.toggle("opacity-100", active);
    dot.classList.toggle("opacity-40", !active);
  });
}

function setPanelImage(panel: HTMLElement, index: number, animate: boolean) {
  const urls = JSON.parse(panel.dataset.imageUrls ?? "[]") as string[];
  const captions = JSON.parse(panel.dataset.captions ?? "[]") as string[];
  if (!urls.length) return;

  const imageIndex = ((index % urls.length) + urls.length) % urls.length;
  setPanelImageIndex(panel, imageIndex);
  updateImageDots(panel, imageIndex);

  const img = panel.querySelector<HTMLImageElement>("[data-creation-image]");
  const caption = panel.querySelector<HTMLElement>("[data-creation-caption]");

  const showImageNav = urls.length > 1;

  if (!img) return;

  const applyImage = () => {
    img.src = urls[imageIndex] ?? "";
    if (caption) {
      const text = captions[imageIndex];
      if (text) {
        caption.innerHTML = text;
        caption.classList.remove("hidden");
      } else {
        caption.innerHTML = "";
        caption.classList.add("hidden");
      }
    }
    updateImageDots(panel, imageIndex);
  };

  if (!animate) {
    img.style.opacity = "1";
    applyImage();
    return;
  }

  let loading = panel.dataset.imageLoading === "true";
  if (loading) return;

  panel.dataset.imageLoading = "true";
  const preload = new Image();
  preload.src = urls[imageIndex] ?? "";
  preload.onload = () => {
    img.style.opacity = "0.2";
    window.setTimeout(() => {
      applyImage();
      img.style.opacity = "1";
      panel.dataset.imageLoading = "false";
    }, IMAGE_FADE_MS);
  };
  preload.onerror = () => {
    applyImage();
    panel.dataset.imageLoading = "false";
  };
}

function setItemParam(index: number | null, replace = false) {
  const url = new URL(window.location.href);
  if (index === null) {
    url.searchParams.delete(CREATION_ITEM_PARAM);
  } else {
    url.searchParams.set(CREATION_ITEM_PARAM, String(index));
  }

  const next = `${url.pathname}${url.search}${url.hash}`;
  if (replace) {
    window.history.replaceState({ creationItem: index }, "", next);
  } else {
    window.history.pushState({ creationItem: index }, "", next);
  }
}

function openItemModal(index: number, replace = false) {
  if (index < 0 || index >= getPanelCount()) return;

  showPanel(index);
  openModal(CREATION_MODAL_ID);
  dimGrid(true);
  setItemParam(index, replace);
}

function nextImage(panel: HTMLElement) {
  const urls = JSON.parse(panel.dataset.imageUrls ?? "[]") as string[];
  if (urls.length <= 1) return;
  const nextIndex = getPanelImageIndex(panel) + 1;
  setPanelImage(panel, nextIndex, true);
}

function navigateWork(delta: number) {
  const active = getActivePanel();
  if (!active) return;

  const current = Number.parseInt(active.dataset.creationPanel ?? "0", 10);
  const count = getPanelCount();
  const next = (current + delta + count) % count;
  openItemModal(next);
}

function syncFromUrl(replace = false) {
  const raw = new URLSearchParams(window.location.search).get(CREATION_ITEM_PARAM);
  if (raw === null) {
    closeModal(CREATION_MODAL_ID);
    dimGrid(false);
    return;
  }

  const index = Number.parseInt(raw, 10);
  if (Number.isNaN(index) || index < 0) return;

  openItemModal(index, replace);
}

export function initCreationModal() {
  initModals();

  const modal = getModal();
  if (!modal || modal.dataset.creationModalInit === "true") return;
  modal.dataset.creationModalInit = "true";

  document.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;

    const trigger = target.closest<HTMLElement>("[data-creation-item]");
    if (trigger) {
      e.preventDefault();
      const index = Number.parseInt(trigger.dataset.creationItem ?? "", 10);
      if (!Number.isNaN(index)) {
        openItemModal(index);
      }
      return;
    }

    const active = getActivePanel();
    if (!active) return;

    if (target.closest("[data-creation-prev-work]")) {
      e.preventDefault();
      navigateWork(-1);
      return;
    }

    if (target.closest("[data-creation-next-work]")) {
      e.preventDefault();
      navigateWork(1);
      return;
    }

    if (target.closest("[data-creation-image]")) {
      e.preventDefault();
      nextImage(active);
      return;
    }
  });

  modal.addEventListener("close", () => {
    dimGrid(false);
    getPanels().forEach((panel) => panel.classList.add("hidden"));
    if (new URLSearchParams(window.location.search).has(CREATION_ITEM_PARAM)) {
      setItemParam(null, true);
    }
  });

  window.addEventListener("popstate", () => syncFromUrl(true));
  syncFromUrl(true);
}
