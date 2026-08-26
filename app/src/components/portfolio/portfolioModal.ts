import { PORTFOLIO_MODAL_ID } from "@/lib/portfolio";
import { closeModal, initModals, openModal } from "@/components/modal/modal.ts";

function getModal() {
  return document.querySelector<HTMLDialogElement>(
    `dialog[data-modal-id="${PORTFOLIO_MODAL_ID}"]`,
  );
}

function getPanels() {
  return document.querySelectorAll<HTMLElement>("[data-portfolio-panel]");
}

function getPanelCount() {
  return getPanels().length;
}

function getActivePanel() {
  return document.querySelector<HTMLElement>(
    "[data-portfolio-panel]:not(.hidden)",
  );
}

function getPanelImageIndex(panel: HTMLElement) {
  return Number.parseInt(panel.dataset.imageIndex ?? "0", 10) || 0;
}

function setPanelImageIndex(panel: HTMLElement, index: number) {
  panel.dataset.imageIndex = String(index);
}

function updateProgress(panel: HTMLElement, index: number) {
  const urls = JSON.parse(panel.dataset.imageUrls ?? "[]") as string[];
  const progress = panel.querySelector<HTMLElement>("[data-portfolio-progress]");
  if (progress && urls.length > 1) {
    progress.style.width = `${((index + 1) / urls.length) * 100}%`;
  }
}

function setPanelImages(panel: HTMLElement, index: number) {
  const urls = JSON.parse(panel.dataset.imageUrls ?? "[]") as string[];
  if (!urls.length) return;

  const imageIndex = ((index % urls.length) + urls.length) % urls.length;
  setPanelImageIndex(panel, imageIndex);
  updateProgress(panel, imageIndex);

  const primary = panel.querySelector<HTMLImageElement>(
    "[data-portfolio-modal-image]",
  );
  const secondary = panel.querySelector<HTMLImageElement>(
    "[data-portfolio-modal-image-secondary]",
  );

  if (primary) primary.src = urls[imageIndex] ?? "";
  if (secondary) {
    const nextIndex = (imageIndex + 1) % urls.length;
    if (urls.length > 1) {
      secondary.src = urls[nextIndex] ?? "";
      secondary.parentElement?.classList.remove("hidden");
      secondary.parentElement?.classList.add("md:block");
    }
  }
}

function showPanel(index: number) {
  getPanels().forEach((panel) => {
    const panelIndex = Number.parseInt(panel.dataset.portfolioPanel ?? "", 10);
    const active = panelIndex === index;
    panel.classList.toggle("hidden", !active);
    if (active) {
      setPanelImages(panel, 0);
    }
  });
}

function openProjectModal(index: number) {
  if (index < 0 || index >= getPanelCount()) return;
  showPanel(index);
  openModal(PORTFOLIO_MODAL_ID);
}

function nextImage(panel: HTMLElement) {
  const urls = JSON.parse(panel.dataset.imageUrls ?? "[]") as string[];
  if (urls.length <= 1) return;
  setPanelImages(panel, getPanelImageIndex(panel) + 1);
}

export function initPortfolioModal() {
  initModals();

  const modal = getModal();
  if (!modal || modal.dataset.portfolioModalInit === "true") return;
  modal.dataset.portfolioModalInit = "true";

  document.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;

    if (target.closest("[data-portfolio-name-link], [data-portfolio-github-link]")) {
      return;
    }

    const card = target.closest<HTMLElement>("[data-portfolio-card]");
    if (card) {
      e.preventDefault();
      const index = Number.parseInt(card.dataset.portfolioIndex ?? "", 10);
      if (!Number.isNaN(index)) {
        openProjectModal(index);
      }
      return;
    }

    const active = getActivePanel();
    if (!active) return;

    if (target.closest("[data-portfolio-modal-image]")) {
      e.preventDefault();
      nextImage(active);
    }
  });

  modal.addEventListener("close", () => {
    getPanels().forEach((panel) => panel.classList.add("hidden"));
  });
}
