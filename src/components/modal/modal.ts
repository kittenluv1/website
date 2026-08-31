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

function isDraggable(modal: HTMLDialogElement) {
  return modal.dataset.draggable === "true";
}

function dimsBackdrop(modal: HTMLDialogElement) {
  return modal.dataset.dimBackdrop === "true";
}

// use native dialog backdrop functionality
function usesNativeBackdrop(modal: HTMLDialogElement) {
  return dimsBackdrop(modal) && !isDraggable(modal);
}

// custom backdrop for draggable and dimmable modals
function getCustomBackdrop(id: string) {
  // find the custom backdrop button by data-modal-backdrop attribute
  // clicking this button will close the modal
  return document.querySelector<HTMLButtonElement>(
    `[data-modal-backdrop="${CSS.escape(id)}"]`,
  );
}

function showCustomBackdrop(id: string) {
  const modal = getModal(id);
  if (!modal) return;

  let backdrop = getCustomBackdrop(id);
  // if no custom backdrop button found, create a new one
  if (!backdrop) {
    backdrop = document.createElement("button");
    backdrop.type = "button";
    backdrop.dataset.modalBackdrop = id;
    backdrop.className = "modal-custom-backdrop";
    backdrop.setAttribute("aria-label", "Close dialog");
    backdrop.addEventListener("click", () => {
      if (modal.dataset.closeOnBackdrop === "true") {
        closeModal(id);
      }
    });
    document.body.appendChild(backdrop);
  }

  backdrop.hidden = false;
}

function hideCustomBackdrop(id: string) {
  getCustomBackdrop(id)?.remove();
}

function centerModal(dialog: HTMLDialogElement) {
  dialog.style.margin = "0";
  dialog.style.position = "fixed";
  dialog.style.right = "auto";
  dialog.style.bottom = "auto";
  dialog.style.transform = "none";

  const rect = dialog.getBoundingClientRect();
  dialog.style.left = `${Math.max(0, (window.innerWidth - rect.width) / 2)}px`;
  dialog.style.top = `${Math.max(0, (window.innerHeight - rect.height) / 2)}px`;
}

export function openModal(id: string) {
  const modal = getModal(id);
  if (!modal || modal.open) return;

  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }

  if (usesNativeBackdrop(modal)) {
    modal.showModal();
    document.body.style.overflow = "hidden";
    return;
  }

  modal.style.position = "fixed";
  modal.style.margin = "0";
  modal.show();

  if (isDraggable(modal)) {
    requestAnimationFrame(() => centerModal(modal));
  }

  if (dimsBackdrop(modal)) {
    showCustomBackdrop(id);
    document.body.style.overflow = "hidden";
  }
}

export function closeModal(id: string) {
  const modal = getModal(id);
  if (!modal?.open) return;

  hideCustomBackdrop(id);
  modal.close();
  updateBodyScroll();
}

function updateBodyScroll() {
  const anyBlockingModal = document.querySelector(
    'dialog[data-modal][open][data-dim-backdrop="true"]',
  );
  document.body.style.overflow = anyBlockingModal ? "hidden" : "";
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
    dialog.dataset.modalDragging = "false";
  });

  document.addEventListener("mousemove", (e) => {
    if (!dragStart) return;

    const distX = Math.abs(e.clientX - startX);
    const distY = Math.abs(e.clientY - startY);
    if (distX > dragThreshold || distY > dragThreshold) {
      isDragging = true;
      dialog.dataset.modalDragging = "true";
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
      dialog.dataset.modalDragging = "false";
      document.body.style.cursor = "";
    }, 0);
  });
}

function setupModal(dialog: HTMLDialogElement) {
  const id = dialog.dataset.modalId;
  if (!id) return;

  if (dialog.dataset.closeOnBackdrop === "true" && usesNativeBackdrop(dialog)) {
    dialog.addEventListener("click", (e) => {
      if (e.target === dialog) closeModal(id);
    });
  }

  if (isDraggable(dialog)) {
    setupDrag(dialog);
  }

  dialog.addEventListener("close", () => {
    hideCustomBackdrop(id);
    updateBodyScroll();
  });
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
    if (modal instanceof HTMLDialogElement && modal.dataset.modalId) {
      closeModal(modal.dataset.modalId);
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

export function isModalDragging(id: string) {
  const modal = getModal(id);
  return modal?.dataset.modalDragging === "true";
}
