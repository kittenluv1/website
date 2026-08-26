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

export function getRandomPfp(data: PortfolioData): string {
  return data.profile.pfp[Math.floor(Math.random() * data.profile.pfp.length)];
}