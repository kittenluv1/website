const SIDEBAR_SELECTOR = "#creations-sidebar";
const NAV_PANEL_SELECTOR = "[data-creations-sidebar-nav]";
const ABOUT_PANEL_SELECTOR = "[data-creations-sidebar-about]";
const INIT_KEY = "creationsSidebarInit";

export type SidebarView = "nav" | "about";

function getSidebar() {
  return document.querySelector<HTMLElement>(SIDEBAR_SELECTOR);
}

function getNavPanel() {
  return document.querySelector<HTMLElement>(NAV_PANEL_SELECTOR);
}

function getAboutPanel() {
  return document.querySelector<HTMLElement>(ABOUT_PANEL_SELECTOR);
}

export function setSidebarView(view: SidebarView) {
  const sidebar = getSidebar();
  const navPanel = getNavPanel();
  const aboutPanel = getAboutPanel();
  if (!sidebar || !navPanel || !aboutPanel) return;

  sidebar.dataset.view = view;
  navPanel.hidden = view !== "nav";
  aboutPanel.hidden = view !== "about";
}

export function initCreationsSidebar() {
  const root = document.documentElement;
  if (root.dataset[INIT_KEY] !== "true") {
    root.dataset[INIT_KEY] = "true";

    document.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;

      const showTrigger = target.closest<HTMLElement>("[data-sidebar-show]");
      if (showTrigger) {
        e.preventDefault();
        const view = showTrigger.dataset.sidebarShow as SidebarView | undefined;
        if (view === "nav" || view === "about") {
          setSidebarView(view);
        }
      }
    });
  }

  setSidebarView("nav");
}
