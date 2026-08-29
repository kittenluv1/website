// ================ DATA - TYPES & HELPERS ================
export type Creation = {
  title: string;
  images: string[];
  captions?: string[];
  date: string;
  description: string;
  comments?: string;
};

export type CreationsData = Record<string, Creation[]>;

function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function getCategories(data: CreationsData) {
  return Object.entries(data).map(([name, items]) => ({
    name,
    slug: slugify(name),
    preview: items[0]?.images?.[0],
  }));
}

export function getCategorySlug(name: string) {
  return slugify(name);
}

export type FlatCreation = Creation & {
  categoryName: string;
  categorySlug: string;
  categoryIndex: number;
};

export function getAllCreations(data: CreationsData): FlatCreation[] {
  return Object.entries(data).flatMap(([name, items]) => {
    const slug = slugify(name);
    return items.map((item, categoryIndex) => ({
      ...item,
      categoryName: name,
      categorySlug: slug,
      categoryIndex,
    }));
  });
}

export const ALL_CATEGORY_SLUG = "all";

export const CREATIONS_ABOUT_TEXT =
  "welcome to my creations archive! intended to be a hoarding spot for me to put everything i've ever made in my whole life. crochet, scrapbooking, trinkets... the 'archive' section even has stuff that i made in my childhood. i had a lot of fun putting this together - hope you enjoy looking around and also have some fun!";

export const CREATION_MODAL_ID = "creationModal";
export const CREATION_ITEM_PARAM = "item";

// ================ IMAGE HELPERS ================
// all creations images must live under this directory
export const CREATIONS_IMAGE_PATH = "/src/images/creations";

const creationImageModules = import.meta.glob<{ default: ImageMetadata }>(
  "/src/images/creations/**/*.{png,jpg,jpeg,JPEG,webp,gif}",
  { eager: true },
);

/** Resolve a JSON image path to the glob key under CREATIONS_IMAGE_PATH. */
export function resolveCreationImagePath(path: string): string {
  if (path.startsWith(`${CREATIONS_IMAGE_PATH}/`)) return path;
  if (path.startsWith("/")) {
    console.warn(
      `[creations] image must live under ${CREATIONS_IMAGE_PATH}: ${path}`,
    );
    return path;
  }
  return `${CREATIONS_IMAGE_PATH}/${path.replace(/^\//, "")}`;
}

export function getCreationImage(path: string | undefined) {
  if (!path) return undefined;
  const key = resolveCreationImagePath(path);
  if (!key.startsWith(`${CREATIONS_IMAGE_PATH}/`)) return undefined;
  return creationImageModules[key]?.default;
}

export function getCreationImageUrl(path: string): string {
  return getCreationImage(path)?.src ?? resolveCreationImagePath(path);
}


// ================ STYLES - VARIABLES & HELPERS ================
export const shortStackFont = "font-[short-stack-regular,simsun,serif]";

const textShadowPink =
  "[text-shadow:-1px_-1px_0_#98455d,1px_-1px_0_#98455d,-1px_1px_0_#98455d,1px_1px_0_#98455d,0px_0px_2px_#98455d,0_0_5px_#98455d,0_0_10px_#98455d]";

export const textShadowGreen =
  "[text-shadow:-1px_-1px_0_#AEC873,1px_-1px_0_#AEC873,-1px_1px_0_#AEC873,1px_1px_0_#AEC873,0px_0px_2px_#AEC873,0_0_5px_#AEC873,0_0_10px_#AEC873]";

export const textShadowGreenHover =
  "hover:text-white hover:[text-shadow:-1px_-1px_0_#AEC873,1px_-1px_0_#AEC873,-1px_1px_0_#AEC873,1px_1px_0_#AEC873,0px_0px_2px_#AEC873,0_0_5px_#AEC873,0_0_10px_#AEC873]";

const creationTiltBase =
  "origin-center transition-transform duration-200 ease-out will-change-transform";

export type CreationTiltDirection = "left" | "right";

// Pass `"left"` / `"right"`, or a numeric index (even → left, odd → right).
export function creationTilt(direction: CreationTiltDirection | number): string {
  const side: CreationTiltDirection =
    typeof direction === "number"
      ? direction % 2 === 0
        ? "left"
        : "right"
      : direction;
  const hover =
    side === "left" ? "hover:-rotate-[15deg]" : "hover:rotate-[15deg]";
  return `${creationTiltBase} ${hover}`;
}

const creationsButtonReset =
  "cursor-pointer border-transparent bg-transparent p-0";

const creationsClickableText = [
  shortStackFont,
  "font-normal text-white underline underline-offset-4",
  textShadowPink,
  textShadowGreenHover,
].join(" ");

export const creationsClickableTextButton = [
  creationsClickableText,
  creationsButtonReset,
].join(" ");

export const creationsNavCrumbText = [
  shortStackFont,
  "text-lg text-white sm:text-xl",
  textShadowPink,
].join(" ");

export const creationsNavCrumbLink = [
  creationsNavCrumbText,
  "underline underline-offset-4",
  textShadowGreenHover,
].join(" ");

export const creationsStickerLabel = [
  shortStackFont,
  "relative z-[1] px-2 text-center text-base font-normal text-white underline underline-offset-2 text-shadow-inherit",
].join(" ");

export const creationsStickerButton = [
  "absolute flex items-center justify-center no-underline",
  creationsButtonReset,
  textShadowPink,
  textShadowGreenHover,
].join(" ");

export const gridItemButton = [
  "flex aspect-square w-full flex-col items-center border-transparent bg-transparent p-0",
  "font-[messy-handwritten,simsun,serif] text-[3vh] font-bold text-white",
  textShadowPink,
  textShadowGreenHover,
  "[&_img]:box-border [&_img]:h-full [&_img]:w-full [&_img]:object-contain [&_img]:pb-[1vh]",
  "[&_p]:mt-[2vh] [&_p]:mb-0 [&_p]:font-[messy-handwritten,simsun,serif] [&_p]:font-bold",
  "[&_em]:m-0",
].join(" ");

// text shadow colors 4 reference: 
// - pink: #98455d
// - yellow-green: #58e8e8
// - turquoise: #58e8e8
// - green: #AEC873