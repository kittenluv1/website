import {
  CREATION_ITEM_PARAM,
  CREATION_MODAL_ID,
} from "@/lib/creations";
import { closeModal, initModals, openModal } from "@/components/modal/modal.ts";

const BACKDROP_SELECTOR = "#creation-modal-backdrop";
const GRID_SELECTOR = "#creations-grid";
const SCROLL_SELECTOR = "#creations-scroll";
const BREADCRUMB_SELECTOR = "#creation-breadcrumb";
const BREADCRUMB_PIECE_LI_SELECTOR = "#creation-breadcrumb-piece-li";
const BREADCRUMB_PIECE_LINK_SELECTOR = "#creation-breadcrumb-piece-link";
const BREADCRUMB_SEP_SELECTOR = "#creation-breadcrumb-sep";
const INIT_KEY = "creationModalInit";
const IMAGE_FADE_MS = 200;

function getModal() {
  return document.querySelector<HTMLDialogElement>(
    `dialog[data-modal-id="${CREATION_MODAL_ID}"]`,
  );
}

function getBackdrop() {
  return document.querySelector<HTMLButtonElement>(BACKDROP_SELECTOR);
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

function getScrollArea() {
  return document.querySelector<HTMLElement>(SCROLL_SELECTOR);
}

function getItemHref(index: number) {
  const url = new URL(window.location.href);
  url.searchParams.set(CREATION_ITEM_PARAM, String(index));
  return `${url.pathname}${url.search}${url.hash}`;
}

function updateBreadcrumb() {
  const modal = getModal();
  const crumbList = document.querySelector(BREADCRUMB_SELECTOR);
  const pieceLi = document.querySelector<HTMLElement>(BREADCRUMB_PIECE_LI_SELECTOR);
  const pieceLink = document.querySelector<HTMLAnchorElement>(
    BREADCRUMB_PIECE_LINK_SELECTOR,
  );
  const sepEl = document.querySelector<HTMLElement>(BREADCRUMB_SEP_SELECTOR);
  if (!crumbList || !pieceLi || !pieceLink || !sepEl) return;

  crumbList
    .querySelectorAll("[aria-current='page']")
    .forEach((el) => el.removeAttribute("aria-current"));

  if (modal?.open) {
    const active = getActivePanel();
    const title = active?.querySelector("h1")?.textContent?.trim() ?? "";
    const index = Number.parseInt(active?.dataset.creationPanel ?? "", 10);

    pieceLink.textContent = title;
    pieceLink.href = Number.isNaN(index) ? window.location.href : getItemHref(index);
    pieceLi.classList.remove("hidden");
    sepEl.classList.remove("hidden");
    pieceLink.setAttribute("aria-current", "page");
    return;
  }

  pieceLink.textContent = "";
  pieceLink.removeAttribute("href");
  pieceLi.classList.add("hidden");
  sepEl.classList.add("hidden");

  const rootLink = crumbList.querySelector<HTMLElement>(
    "[data-creation-breadcrumb-root]",
  );
  rootLink?.setAttribute("aria-current", "page");
}

function positionBackdrop() {
  const backdrop = getBackdrop();
  const scrollArea = getScrollArea();
  if (!backdrop || !scrollArea) return;

  const scrollRect = scrollArea.getBoundingClientRect();
  const nav = scrollArea.querySelector("nav");
  const navBottom = nav?.getBoundingClientRect().bottom ?? scrollRect.top;

  backdrop.style.top = `${navBottom}px`;
  backdrop.style.left = `${scrollRect.left}px`;
  backdrop.style.width = `${scrollRect.width}px`;
  backdrop.style.height = `${Math.max(0, scrollRect.bottom - navBottom)}px`;
}

function showMainBackdrop() {
  const backdrop = getBackdrop();
  if (!backdrop) return;

  backdrop.removeAttribute("hidden");
  positionBackdrop();
  backdrop.setAttribute("data-open", "");
  backdrop.setAttribute("aria-hidden", "false");
  document.querySelector<HTMLElement>(GRID_SELECTOR)?.setAttribute("inert", "");

  const scrollArea = getScrollArea();
  if (scrollArea) scrollArea.style.overflow = "hidden";

  window.addEventListener("resize", positionBackdrop);
}

function hideMainBackdrop() {
  const backdrop = getBackdrop();
  if (!backdrop) return;

  backdrop.removeAttribute("data-open");
  backdrop.setAttribute("hidden", "");
  backdrop.setAttribute("aria-hidden", "true");
  backdrop.style.top = "";
  backdrop.style.left = "";
  backdrop.style.width = "";
  backdrop.style.height = "";
  document.querySelector<HTMLElement>(GRID_SELECTOR)?.removeAttribute("inert");

  const scrollArea = getScrollArea();
  if (scrollArea) scrollArea.style.overflow = "";

  window.removeEventListener("resize", positionBackdrop);
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

  bindModalCloseListener();
  showPanel(index);
  openModal(CREATION_MODAL_ID);
  showMainBackdrop();
  setItemParam(index, replace);
  updateBreadcrumb();
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
    if (getModal()?.open) {
      closeModal(CREATION_MODAL_ID);
    } else {
      hideMainBackdrop();
      updateBreadcrumb();
    }
    return;
  }

  const index = Number.parseInt(raw, 10);
  if (Number.isNaN(index) || index < 0) return;

  openItemModal(index, replace);
}

function handleCreationModalClose() {
  hideMainBackdrop();
  getPanels().forEach((panel) => panel.classList.add("hidden"));
  if (new URLSearchParams(window.location.search).has(CREATION_ITEM_PARAM)) {
    setItemParam(null, true);
  }
  updateBreadcrumb();
}

function bindModalCloseListener() {
  const modal = getModal();
  if (!modal || modal.dataset.creationCloseBound === "true") return;

  modal.dataset.creationCloseBound = "true";
  modal.addEventListener("close", handleCreationModalClose);
}

function handleDocumentClick(e: MouseEvent) {
  const target = e.target as HTMLElement;

  const backdrop = target.closest<HTMLElement>(BACKDROP_SELECTOR);
  if (backdrop?.hasAttribute("data-open")) {
    e.preventDefault();
    closeModal(CREATION_MODAL_ID);
    return;
  }

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
  }
}

export function initCreationModal() {
  initModals();

  const root = document.documentElement;
  if (root.dataset[INIT_KEY] !== "true") {
    root.dataset[INIT_KEY] = "true";
    document.addEventListener("click", handleDocumentClick);
    window.addEventListener("popstate", () => syncFromUrl(true));
    document.addEventListener("astro:page-load", () => {
      bindModalCloseListener();
      syncFromUrl(true);
    });
  }

  bindModalCloseListener();
  syncFromUrl(true);
}
