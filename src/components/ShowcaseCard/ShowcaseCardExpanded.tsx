import styles from "./ShowcaseCard.module.css";

interface Book {
  name: string;
  author: string;
  price: number;
  discount?: number | null;
  image: string;
  tags?: string[];
  pages?: number;
  description?: string;
}

interface ShowcaseCardExpandedProps {
  book: Book;
}

export default function ShowcaseCardExpanded({ book }: ShowcaseCardExpandedProps) {
  const hasDiscount = book.discount != null && book.discount < book.price;

  return (
    <div className={styles.card}>
      <div className={styles.imageWrap}>
        <img src={book.image} alt={book.name} className={styles.image} />
      </div>

      <div className={styles.right}>
        <div>
          <div className={styles.titleLine}>
            <h1 className={styles.title}>{book.name}</h1>
          </div>
          <div className={styles.author}>{book.author}</div>

          {book.pages && (
            <div className={styles.pages}>{book.pages} стр.</div>
          )}

          {book.tags && book.tags.length > 0 && (
            <div className={styles.tags}>
              {book.tags.map((tag, i) => (
                <span key={i} className={styles.tag}>
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className={styles.priceRow}>
            {hasDiscount && (
              <div className={styles.discountPrice}>{book.discount} Р</div>
            )}
            <div className={hasDiscount ? styles.regularCross : styles.regular}>
              {book.price} Р
            </div>
          </div>
        </div>

        <div className={styles.bottomArea}>
          <button className={styles.addButton}>В корзину</button>
        </div>
      </div>
    </div>
  );
}
