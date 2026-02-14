import styles from "./Header.module.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Header() {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchQuery, setSearchQuery] = useState("");
    const isSearchPage = location.pathname === "/search";

    const handleSearch = () => {
        // When on the search page, let the page handle applying pending filters too.
        if (isSearchPage) {
            const evt = new CustomEvent("headerSearch", { detail: { q: searchQuery } });
            window.dispatchEvent(evt);
            return;
        }

        // Not on search page: preserve existing non-q params and navigate
        const params = new URLSearchParams(location.search);
        const filterParams = new URLSearchParams();
        params.forEach((value, key) => {
            if (key !== "q" && key !== "advanced") {
                filterParams.set(key, value);
            }
        });
        if (searchQuery.trim()) {
            filterParams.set("q", searchQuery);
        }
        navigate(`/search?${filterParams.toString()}`);
    };

    const handleAdvancedSearch = () => {
        // Mark that the user explicitly opened advanced search with an empty query
        navigate("/search?advanced=1");
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    // Keep header input in sync with URL `q` param when location changes
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        setSearchQuery(params.get("q") || "");
    }, [location.search]);

    return (
        <header className={styles.header}>
            <Link to="/" className={styles.home}>Главная</Link>
            <input
                className={styles.searchInput}
                type="text"
                placeholder="Поиск книг, авторов"
                value={searchQuery}
                onChange={(e) => {
                    const v = e.target.value;
                    setSearchQuery(v);
                    const evt = new CustomEvent("headerQueryChanged", { detail: { q: v } });
                    window.dispatchEvent(evt);
                }}
                onKeyPress={handleKeyPress}
            />
            <button type="button" className={styles.button} onClick={handleSearch}>Найти</button>
            {!isSearchPage && (
                <button type="button" className={styles.button} onClick={handleAdvancedSearch}>Расширенный поиск</button>
            )}
            <button type="button" className={styles.cart}>Корзина</button>
        </header>
    );
}