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

export const CREATION_MODAL_ID = "creationModal";
export const CREATION_ITEM_PARAM = "item";

// reusable styles
// reusable styles
export const textShadowPink =
  "[text-shadow:-1px_-1px_0_#192855,1px_-1px_0_#192855,-1px_1px_0_#192855,1px_1px_0_#192855,0px_0px_2px_#192855,0_0_5px_#192855,0_0_10px_#192855]";

export const textShadowGreenHover =
  "hover:text-white hover:[text-shadow:-1px_-1px_0_#e3d539,1px_-1px_0_#e3d539,-1px_1px_0_#e3d539,1px_1px_0_#e3d539,0px_0px_2px_#e3d539,0_0_5px_#e3d539,0_0_10px_#e3d539]";

export const gridItemButton = [
  "flex aspect-square w-full flex-col items-center border-transparent bg-transparent p-0",
  "font-[messy-handwritten,simsun,serif] text-[3vh] font-bold text-white",
  textShadowPink,
  textShadowGreenHover,
  "[&_img]:box-border [&_img]:h-full [&_img]:w-full [&_img]:object-contain [&_img]:pb-[1vh]",
  "[&_p]:mt-[2vh] [&_p]:mb-0 [&_p]:font-[messy-handwritten,simsun,serif] [&_p]:font-bold",
  "[&_em]:m-0",
].join(" ");