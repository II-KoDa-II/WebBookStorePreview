import styles from "./CatalogueCard.module.css";

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

interface CatalogueCardProps {
    book: Book;
    onButtonClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function CatalogueCard({ book, onButtonClick }: CatalogueCardProps) {
    const hasDiscount = book.discount != null && book.discount < book.price;

    return (
        <div className={styles.card}>
            <div className={styles.imageWrap}>
                <img src={book.image} alt={book.name} className={styles.image} />
            </div>

            <div className={styles.right}>
                <div>
                    <div className={styles.title}>{book.name}</div>
                    <div className={styles.author}>{book.author}</div>

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
                    <button className={styles.addButton} onClick={onButtonClick}>В корзину</button>
                </div>
            </div>
        </div>
    );
}