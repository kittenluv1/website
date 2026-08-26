import { PORTFOLIO_MODAL_ID } from "@/lib/portfolio";
import { initModals, openModal } from "@/components/modal/modal.ts";

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

function showPanel(index: number) {
  getPanels().forEach((panel) => {
    const panelIndex = Number.parseInt(panel.dataset.portfolioPanel ?? "", 10);
    panel.classList.toggle("hidden", panelIndex !== index);
  });
}

function openProjectModal(index: number) {
  if (index < 0 || index >= getPanelCount()) return;
  showPanel(index);
  openModal(PORTFOLIO_MODAL_ID);
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
    if (!card) return;

    e.preventDefault();
    const index = Number.parseInt(card.dataset.portfolioIndex ?? "", 10);
    if (!Number.isNaN(index)) {
      openProjectModal(index);
    }
  });

  modal.addEventListener("close", () => {
    getPanels().forEach((panel) => panel.classList.add("hidden"));
  });
}
