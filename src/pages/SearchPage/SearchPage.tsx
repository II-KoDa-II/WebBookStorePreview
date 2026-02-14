import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import FilterOptions from "../../components/FilterOptions/FilterOptions";
import CatalogueCard from "../../components/CatalogueCard/CatalogueCard";
import { searchBooks, encodeFiltersToParams, decodeFiltersFromParams } from "../../utils/searchUtils";
import type { SearchFilters } from "../../utils/searchUtils";
import { BookItem } from "../../data/data";
import styles from "./SearchPage.module.css";

const ITEMS_PER_PAGE = 12;

interface SearchState {
  allResults: typeof BookItem;
  displayedResults: typeof BookItem;
  itemsLoaded: number;
  hasMore: boolean;
}

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q") || "";
  const hasQueryParam = searchParams.has("q");

  const defaultFilters: SearchFilters = {
    tags: [],
    priceMin: 0,
    priceMax: 1000,
    pagesMin: 0,
    pagesMax: 520,
    discount: null,
    sortBy: "relevance",
  };

  const [activeFilters, setActiveFilters] = useState<SearchFilters>(() => {
    const filterParams = new URLSearchParams(searchParams.toString());
    filterParams.delete("q");
    return decodeFiltersFromParams(filterParams);
  });
  const [pendingFilters, setPendingFilters] = useState<SearchFilters>(() => {
    const filterParams = new URLSearchParams(searchParams.toString());
    filterParams.delete("q");
    return decodeFiltersFromParams(filterParams);
  });

  // Sync activeFilters and pendingFilters from URL whenever searchParams change
  useEffect(() => {
    const filterParams = new URLSearchParams(searchParams.toString());
    filterParams.delete("q");
    const filtersFromUrl = decodeFiltersFromParams(filterParams);
    setActiveFilters(filtersFromUrl);
    setPendingFilters(filtersFromUrl); // Also reset pending to match active
  }, [searchParams]);

  // Keep a ref of the header's current query so Apply can use it even if header wasn't submitted
  const headerQueryRef = useRef<string>(query || "");

  useEffect(() => {
    headerQueryRef.current = query || "";
  }, [query]);

  // Listen for header input changes (so Apply can pick up current typed value)
  useEffect(() => {
    const onHeaderQuery = (e: Event) => {
      // @ts-ignore - CustomEvent detail
      const q = e?.detail?.q ?? "";
      headerQueryRef.current = q;
    };
    window.addEventListener("headerQueryChanged", onHeaderQuery as EventListener);
    return () => window.removeEventListener("headerQueryChanged", onHeaderQuery as EventListener);
  }, []);

  // Handle header search button pressed while on search page: apply pending filters + query
  useEffect(() => {
    const onHeaderSearch = (e: Event) => {
      // @ts-ignore
      const q = e?.detail?.q ?? headerQueryRef.current;
      // Apply pending filters and navigate with q
      setActiveFilters(pendingFilters);
      const filterParams = encodeFiltersToParams(pendingFilters);
      if (q && q.trim()) {
        filterParams.set("q", q.trim());
      }
      navigate(`/search?${filterParams.toString()}`);
    };
    window.addEventListener("headerSearch", onHeaderSearch as EventListener);
    return () => window.removeEventListener("headerSearch", onHeaderSearch as EventListener);
  }, [pendingFilters, navigate]);

  const [searchState, setSearchState] = useState<SearchState>({
    allResults: [],
    displayedResults: [],
    itemsLoaded: ITEMS_PER_PAGE,
    hasMore: true,
  });

  useEffect(() => {
    // Computing derived state (search results) from dependencies is a valid pattern
    // that doesn't cause cascading renders. The warning is overly cautious for this use case.
    const results = searchBooks(query, activeFilters);
    setSearchState({
      allResults: results,
      displayedResults: results.slice(0, ITEMS_PER_PAGE),
      itemsLoaded: ITEMS_PER_PAGE,
      hasMore: results.length > ITEMS_PER_PAGE,
    });
  }, [query, activeFilters]);

  const handleLoadMore = () => {
    const newCount = searchState.itemsLoaded + ITEMS_PER_PAGE;
    setSearchState({
      ...searchState,
      itemsLoaded: newCount,
      displayedResults: searchState.allResults.slice(0, newCount),
      hasMore: newCount < searchState.allResults.length,
    });
  };

  const handleApply = () => {
    // Update activeFilters and URL with new filters
    setActiveFilters(pendingFilters);
    const filterParams = encodeFiltersToParams(pendingFilters);
    const q = headerQueryRef.current || searchParams.get("q");
    if (q) {
      filterParams.set("q", q);
    }
    navigate(`/search?${filterParams.toString()}`);
  };

  const handleReset = () => {
    setPendingFilters(defaultFilters);
    setActiveFilters(defaultFilters);
    // Update URL to remove all filters
    const queryParam = searchParams.get("q");
    if (queryParam) {
      navigate(`/search?q=${encodeURIComponent(queryParam)}`);
    } else {
      navigate("/search");
    }
  };

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
  };

  const handleCardClick = (bookIndex: number) => {
    navigate(`/book/${bookIndex}`);
  };

  const getBookIndex = (book: typeof BookItem[0]) => BookItem.indexOf(book);

  // Show the 'enter parameters' message only when the page was opened via Advanced Search
  // (we mark that via the `advanced` query param). Otherwise an empty q should show all items.
  const showEmptyMessage = !hasQueryParam && searchParams.has("advanced");

  return (
    <div className={styles.container}>
      <FilterOptions
        filters={pendingFilters}
        onFiltersChange={setPendingFilters}
        onApply={handleApply}
        onReset={handleReset}
      />

      <div className={styles.results}>
        {showEmptyMessage ? (
          <div className={styles.emptyMessage}>
            <p>Введите параметры для поиска</p>
          </div>
        ) : searchState.displayedResults.length === 0 ? (
          <div className={styles.emptyMessage}>
            <p>Ничего не найдено</p>
          </div>
        ) : (
          <>
            <div className={styles.resultsList}>
              {searchState.displayedResults.map((book) => (
                <div
                  key={getBookIndex(book)}
                  className={styles.clickableCard}
                  onClick={() => handleCardClick(getBookIndex(book))}
                >
                  <CatalogueCard book={book} onButtonClick={handleButtonClick} />
                </div>
              ))}
            </div>

            {searchState.hasMore && (
              <button className={styles.loadMoreButton} onClick={handleLoadMore}>
                Загрузить ещё
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
