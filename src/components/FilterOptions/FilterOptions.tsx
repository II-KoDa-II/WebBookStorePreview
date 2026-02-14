import { useState } from "react";
import styles from "./FilterOptions.module.css";
import type { SearchFilters } from "../../utils/searchUtils";
import { getAllTags } from "../../utils/searchUtils";

interface FilterOptionsProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onApply: () => void;
  onReset: () => void;
}

export default function FilterOptions({
  filters,
  onFiltersChange,
  onApply,
  onReset,
}: FilterOptionsProps) {
  const [tagSearch, setTagSearch] = useState("");
  const [showAllTags, setShowAllTags] = useState(false);
  const allTags = getAllTags();

  const filteredTags = allTags.filter((tag) =>
    tag.toLowerCase().includes(tagSearch.toLowerCase())
  );
  const visibleTags = showAllTags ? filteredTags : filteredTags.slice(0, 8);

  const handleTagToggle = (tag: string) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter((t) => t !== tag)
      : [...filters.tags, tag];
    onFiltersChange({ ...filters, tags: newTags });
  };

  return (
    <div className={styles.container}>
      {/* Tags Filter */}
      <div className={styles.segment}>
        <h3>Жанры</h3>
        <div className={styles.tagSearch}>
          <input
            type="text"
            placeholder="Поиск жанров"
            value={tagSearch}
            onChange={(e) => setTagSearch(e.target.value)}
            className={styles.tagSearchInput}
          />
          {tagSearch && (
            <button
              className={styles.clearButton}
              onClick={() => setTagSearch("")}
            >
              ✕
            </button>
          )}
        </div>
        <div className={styles.tagsList}>
          {visibleTags.map((tag) => (
            <label key={tag} className={styles.tagLabel}>
              <input
                type="checkbox"
                checked={filters.tags.includes(tag)}
                onChange={() => handleTagToggle(tag)}
              />
              {tag}
            </label>
          ))}
        </div>
        {filteredTags.length > 8 && (
          <button
            className={styles.toggleButton}
            onClick={() => setShowAllTags(!showAllTags)}
          >
            {showAllTags ? "Скрыть" : "Показать ещё"}
          </button>
        )}
      </div>

      {/* Price Range */}
      <div className={styles.segment}>
        <h3>Фильтры</h3>
        <div className={styles.filterGroup}>
          <label>Цена (Р)</label>
          <div className={styles.numberInputs}>
            <input
              type="number"
              placeholder="Мин"
              min="0"
              value={filters.priceMin === 0 ? "" : filters.priceMin}
              onChange={(e) =>
                onFiltersChange({
                  ...filters,
                  priceMin: e.target.value === "" ? 0 : Math.max(0, Number(e.target.value)),
                })
              }
              className={styles.numberInput}
            />
            <span className={styles.separator}>-</span>
            <input
              type="number"
              placeholder="Макс"
              min="0"
              value={filters.priceMax === 1000 ? "" : filters.priceMax}
              onChange={(e) =>
                onFiltersChange({
                  ...filters,
                  priceMax: e.target.value === "" ? 1000 : Math.max(Number(e.target.value), filters.priceMin),
                })
              }
              className={styles.numberInput}
            />
          </div>
        </div>

        {/* Pages Range */}
        <div className={styles.filterGroup}>
          <label>Страницы</label>
          <div className={styles.numberInputs}>
            <input
              type="number"
              placeholder="Мин"
              min="0"
              value={filters.pagesMin === 0 ? "" : filters.pagesMin}
              onChange={(e) =>
                onFiltersChange({
                  ...filters,
                  pagesMin: e.target.value === "" ? 0 : Math.max(0, Number(e.target.value)),
                })
              }
              className={styles.numberInput}
            />
            <span className={styles.separator}>-</span>
            <input
              type="number"
              placeholder="Макс"
              min="0"
              value={filters.pagesMax === 520 ? "" : filters.pagesMax}
              onChange={(e) =>
                onFiltersChange({
                  ...filters,
                  pagesMax: e.target.value === "" ? 520 : Math.max(Number(e.target.value), filters.pagesMin),
                })
              }
              className={styles.numberInput}
            />
          </div>
        </div>

        {/* Discount Toggle */}
        <div className={styles.filterGroup}>
          <label>
            <input
              type="checkbox"
              checked={filters.discount === true}
              onChange={(e) =>
                onFiltersChange({
                  ...filters,
                  discount: e.target.checked ? true : null,
                })
              }
            />
            Только со скидкой
          </label>
        </div>
      </div>

      {/* Sorting */}
      <div className={styles.segment}>
        <h3>Сортировка</h3>
        <div className={styles.sortOptions}>
          <label>
            <input
              type="radio"
              name="sort"
              checked={filters.sortBy === "relevance"}
              onChange={() =>
                onFiltersChange({ ...filters, sortBy: "relevance" })
              }
            />
            По релевантности
          </label>
          <label>
            <input
              type="radio"
              name="sort"
              checked={filters.sortBy === "price-asc"}
              onChange={() =>
                onFiltersChange({ ...filters, sortBy: "price-asc" })
              }
            />
            Цена: возрастание
          </label>
          <label>
            <input
              type="radio"
              name="sort"
              checked={filters.sortBy === "price-desc"}
              onChange={() =>
                onFiltersChange({ ...filters, sortBy: "price-desc" })
              }
            />
            Цена: убывание
          </label>
        </div>
      </div>

      {/* Apply/Reset Buttons */}
      <div className={styles.segment}>
        <button className={styles.applyButton} onClick={onApply}>
          Применить
        </button>
        <button className={styles.resetButton} onClick={onReset}>
          Сбросить
        </button>
      </div>
    </div>
  );
}
