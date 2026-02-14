import Fuse from "fuse.js";
import { BookItem } from "../data/data";

const fuseOptions = {
  keys: ["name", "author"],
  threshold: 0.3,
  minMatchCharLength: 1,
};

const fuse = new Fuse(BookItem, fuseOptions);

export interface SearchFilters {
  tags: string[];
  priceMin: number;
  priceMax: number;
  pagesMin: number;
  pagesMax: number;
  discount: boolean | null;
  sortBy: "relevance" | "price-asc" | "price-desc" | null;
}

export const searchBooks = (
  query: string,
  filters: SearchFilters
) => {
  let results = query.trim() ? fuse.search(query).map(r => r.item) : BookItem;

  // Apply filters
  results = results.filter((book) => {
    if (filters.tags.length > 0 && !book.tags?.some(tag => filters.tags.includes(tag))) {
      return false;
    }

    const bookPrice = book.discount ?? book.price;
    if (bookPrice < filters.priceMin || bookPrice > filters.priceMax) {
      return false;
    }

    if (book.pages && (book.pages < filters.pagesMin || book.pages > filters.pagesMax)) {
      return false;
    }

    if (filters.discount === true && (book.discount == null || book.discount >= book.price)) {
      return false;
    }

    if (filters.discount === false && (book.discount != null && book.discount < book.price)) {
      return false;
    }

    return true;
  });

  // Apply sorting
  if (filters.sortBy === "price-asc") {
    results.sort((a, b) => (a.discount ?? a.price) - (b.discount ?? b.price));
  } else if (filters.sortBy === "price-desc") {
    results.sort((a, b) => (b.discount ?? b.price) - (a.discount ?? a.price));
  }

  return results;
};

export const getAllTags = () => {
  const tagSet = new Set<string>();
  BookItem.forEach(book => {
    book.tags?.forEach(tag => tagSet.add(tag));
  });
  return Array.from(tagSet).sort();
};

export const encodeFiltersToParams = (filters: SearchFilters): URLSearchParams => {
  const params = new URLSearchParams();
  
  if (filters.tags.length > 0) {
    params.set("tags", filters.tags.join(","));
  }
  if (filters.priceMin !== 0) {
    params.set("priceMin", filters.priceMin.toString());
  }
  if (filters.priceMax !== 1000) {
    params.set("priceMax", filters.priceMax.toString());
  }
  if (filters.pagesMin !== 0) {
    params.set("pagesMin", filters.pagesMin.toString());
  }
  if (filters.pagesMax !== 520) {
    params.set("pagesMax", filters.pagesMax.toString());
  }
  if (filters.discount === true) {
    params.set("discount", "true");
  }
  if (filters.sortBy && filters.sortBy !== "relevance") {
    params.set("sortBy", filters.sortBy);
  }
  
  return params;
};

export const decodeFiltersFromParams = (params: URLSearchParams): SearchFilters => {
  return {
    tags: params.get("tags")?.split(",").filter(t => t) || [],
    priceMin: Number(params.get("priceMin")) || 0,
    priceMax: Number(params.get("priceMax")) || 1000,
    pagesMin: Number(params.get("pagesMin")) || 0,
    pagesMax: Number(params.get("pagesMax")) || 520,
    discount: params.get("discount") === "true" ? true : null,
    sortBy: (params.get("sortBy") as "relevance" | "price-asc" | "price-desc" | null) || "relevance",
  };
};
