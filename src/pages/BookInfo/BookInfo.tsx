import { useParams } from "react-router-dom";
import { BookItem } from "../../data/data";
import ShowcaseCardExpanded from "../../components/ShowcaseCard/ShowcaseCardExpanded";
import styles from "./BookInfo.module.css";

export default function BookInfo() {
  const { id } = useParams<{ id: string }>();
  const bookIndex = parseInt(id || "0", 10);
  const book = BookItem[bookIndex];

  if (!book) {
    return (
      <div style={{ padding: 20 }}>
        <p>Книга не найдена</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <ShowcaseCardExpanded book={book} />
        {book.description && (
          <div className={styles.descriptionSection}>
            <h2>Описание</h2>
            <p className={styles.fullDescription}>{book.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}
