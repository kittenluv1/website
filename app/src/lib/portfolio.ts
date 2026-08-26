export type PortfolioProject = {
  name: string;
  tagline: string;
  role: string;
  images: string[];
  link?: string;
  github?: string;
  stack?: string;
  details?: string;
  customComponent?: string;
};

export type PortfolioData = {
  profile: {
    name: string;
    pronouns: string;
    bio: string;
    pfp: string[];
    askMeAbout: string;
  };
  contact: {
    email: string;
    github: string;
    linkedin: string;
    resume: string;
  };
  projects: PortfolioProject[];
  playground: PortfolioProject[];
};

export const PORTFOLIO_MODAL_ID = "portfolioModal";

export type FlatPortfolioProject = PortfolioProject & {
  section: "projects" | "playground";
  index: number;
};

export function getAllPortfolioItems(data: PortfolioData): FlatPortfolioProject[] {
  return [
    ...data.projects.map((item, index) => ({ ...item, section: "projects" as const, index })),
    ...data.playground.map((item, index) => ({
      ...item,
      section: "playground" as const,
      index: data.projects.length + index,
    })),
  ];
}

// DARK MODE
const THEME_KEY = "portfolio-theme";
const TRANSITION_MS = 200;

function withThemeTransition(action: () => void) {
  document.documentElement.classList.add("theme-transition");
  action();
  window.setTimeout(() => {
    document.documentElement.classList.remove("theme-transition");
  }, TRANSITION_MS);
}

export function initPortfolioTheme() {
  const toggle = document.querySelector<HTMLButtonElement>("[data-theme-toggle]");
  if (!toggle || toggle.dataset.themeInit === "true") return;
  toggle.dataset.themeInit = "true";

  toggle.addEventListener("click", () => {
    withThemeTransition(() => {
      const isDark = document.documentElement.classList.toggle("dark");
      localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
    });
  });
}
