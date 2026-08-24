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

export const CREATION_MODAL_ID = "creationModal";
export const CREATION_ITEM_PARAM = "item";