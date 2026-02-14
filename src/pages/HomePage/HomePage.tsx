import { BookItem } from "../../data/data";
import { Carousel } from "../../components/Carousel/Carousel";
import CatalogueCard from "../../components/CatalogueCard/CatalogueCard";
import ShowcaseCard from "../../components/ShowcaseCard/ShowcaseCard";
import { useNavigate } from "react-router-dom";
import styles from "./HomePage.module.css";

function caption(title: string) {
    return <h2 style={{ margin: "12px 0" }}>{title}</h2>;
}

export default function HomePage() {
  const navigate = useNavigate();
  const recommendations = BookItem.filter((b) => b.discount == null).slice(0, 12);
  const discounted = BookItem.filter((b) => b.discount != null && b.discount < b.price).slice(0, 12);
  const genreTag = "Genre 1";
  const tagged = BookItem.filter((b) => b.tags && b.tags.includes(genreTag)).slice(0, 12);
  const authorName = "Shared Author";
  const byAuthor = BookItem.filter((b) => b.author === authorName).slice(0, 12);

  const getBookIndex = (book: typeof BookItem[0]) => BookItem.indexOf(book);

  const handleCardClick = (bookIndex: number) => {
    navigate(`/book/${bookIndex}`);
  };

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
  };

    return (
        <div style={{ padding: 20 }}>
            {caption("Рекомендуем к чтению")}
            <Carousel slidesToShow={1}>
                {recommendations.map((b, i) => (
                    <div key={i} style={{ padding: 8 }}>
                        <div className={styles.clickableCard} onClick={() => handleCardClick(getBookIndex(b))}>
                            <ShowcaseCard book={b} onButtonClick={handleButtonClick} />
                        </div>
                    </div>
                ))}
            </Carousel>

            {caption("Распродажа")}
            <Carousel slidesToShow={4}>
                {discounted.map((b, i) => (
                    <div key={i} style={{ padding: 8 }}>
                        <div className={styles.clickableCard} onClick={() => handleCardClick(getBookIndex(b))}>
                            <CatalogueCard book={b} onButtonClick={handleButtonClick} />
                        </div>
                    </div>
                ))}
            </Carousel>

            {caption(`Жанр: ${genreTag}`)}
            <Carousel slidesToShow={4}>
                {tagged.map((b, i) => (
                    <div key={i} style={{ padding: 8 }}>
                        <div className={styles.clickableCard} onClick={() => handleCardClick(getBookIndex(b))}>
                            <CatalogueCard book={b} onButtonClick={handleButtonClick} />
                        </div>
                    </div>
                ))}
            </Carousel>

            {caption(`От автора: ${authorName}`)}
            <Carousel slidesToShow={4}>
                {byAuthor.map((b, i) => (
                    <div key={i} style={{ padding: 8 }}>
                        <div className={styles.clickableCard} onClick={() => handleCardClick(getBookIndex(b))}>
                            <CatalogueCard book={b} onButtonClick={handleButtonClick} />
                        </div>
                    </div>
                ))}
            </Carousel>
        </div>
    );
}