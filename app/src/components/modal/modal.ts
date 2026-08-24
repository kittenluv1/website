declare global {
  interface Window {
    openModal: (id: string) => void;
    closeModal: (id: string) => void;
  }
}

const INIT_KEY = "modalsInit";

function getModal(id: string): HTMLDialogElement | null {
  return document.querySelector(`dialog[data-modal-id="${CSS.escape(id)}"]`);
}

function centerModal(dialog: HTMLDialogElement) {
  dialog.style.margin = "0";
  dialog.style.position = "fixed";

  const rect = dialog.getBoundingClientRect();
  dialog.style.left = `${Math.max(0, (window.innerWidth - rect.width) / 2)}px`;
  dialog.style.top = `${Math.max(0, (window.innerHeight - rect.height) / 2)}px`;
}

export function openModal(id: string) {
  const modal = getModal(id);
  if (!modal || modal.open) return;

  modal.showModal();
  if (modal.dataset.draggable === "true") {
    centerModal(modal);
  }
  document.body.style.overflow = "hidden";
}

export function closeModal(id: string) {
  const modal = getModal(id);
  if (!modal?.open) return;
  modal.close();
}

function updateBodyScroll() {
  const anyOpen = document.querySelector("dialog[data-modal][open]");
  document.body.style.overflow = anyOpen ? "hidden" : "";
}

function setupDrag(dialog: HTMLDialogElement) {
  const handle =
    dialog.querySelector<HTMLElement>("[data-modal-drag-handle]") ??
    dialog.querySelector<HTMLElement>("[data-modal-panel]");

  if (!handle) return;

  let dragStart = false;
  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;
  let startX = 0;
  let startY = 0;
  const dragThreshold = 5;

  handle.addEventListener("mousedown", (e) => {
    if (e.button !== 0) return;
    if ((e.target as HTMLElement).closest("button, a, input, textarea, select")) {
      return;
    }

    dragStart = true;
    isDragging = false;
    startX = e.clientX;
    startY = e.clientY;
    offsetX = e.clientX - dialog.offsetLeft;
    offsetY = e.clientY - dialog.offsetTop;
    document.body.style.cursor = "grabbing";
  });

  document.addEventListener("mousemove", (e) => {
    if (!dragStart) return;

    const distX = Math.abs(e.clientX - startX);
    const distY = Math.abs(e.clientY - startY);
    if (distX > dragThreshold || distY > dragThreshold) {
      isDragging = true;
    }

    if (isDragging) {
      dialog.style.left = `${e.clientX - offsetX}px`;
      dialog.style.top = `${e.clientY - offsetY}px`;
    }
  });

  document.addEventListener("mouseup", () => {
    if (!dragStart) return;
    dragStart = false;
    setTimeout(() => {
      isDragging = false;
      document.body.style.cursor = "";
    }, 0);
  });
}

function setupModal(dialog: HTMLDialogElement) {
  const closeOnBackdrop = dialog.dataset.closeOnBackdrop === "true";

  if (closeOnBackdrop) {
    dialog.addEventListener("click", (e) => {
      if (e.target === dialog) dialog.close();
    });
  }

  if (dialog.dataset.draggable === "true") {
    setupDrag(dialog);
  }

  dialog.addEventListener("close", updateBodyScroll);
}

function handleClick(e: MouseEvent) {
  const target = e.target as HTMLElement;

  const openTrigger = target.closest<HTMLElement>("[data-modal-open]");
  if (openTrigger) {
    const id = openTrigger.dataset.modalOpen;
    if (id) {
      e.preventDefault();
      openModal(id);
    }
    return;
  }

  const closeTrigger = target.closest<HTMLElement>("[data-modal-close]");
  if (closeTrigger) {
    const id = closeTrigger.dataset.modalClose;
    if (id) {
      closeModal(id);
      return;
    }

    const modal = closeTrigger.closest("dialog[data-modal]");
    if (modal instanceof HTMLDialogElement) {
      modal.close();
    }
  }
}

export function initModals() {
  if (document.documentElement.dataset[INIT_KEY]) return;
  document.documentElement.dataset[INIT_KEY] = "true";

  document.addEventListener("click", handleClick);

  document.addEventListener("modal:open", ((e: CustomEvent<{ id: string }>) => {
    if (e.detail?.id) openModal(e.detail.id);
  }) as EventListener);

  document.addEventListener("modal:close", ((e: CustomEvent<{ id: string }>) => {
    if (e.detail?.id) closeModal(e.detail.id);
  }) as EventListener);

  document.querySelectorAll("dialog[data-modal]").forEach((dialog) => {
    setupModal(dialog as HTMLDialogElement);
  });

  window.openModal = openModal;
  window.closeModal = closeModal;
}
