import Slider from "react-slick";
import styles from "./Carousel.module.css";

interface CarouselProps {
  children?: React.ReactNode;
  slidesToShow?: number;
}

export function Carousel({ children, slidesToShow = 1 }: CarouselProps) {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: slidesToShow,
    slidesToScroll: slidesToShow,
    arrows: true,
    responsive: [
      {
        breakpoint: 2000,
        settings: {
          slidesToShow: slidesToShow,
          slidesToScroll: slidesToShow,
        },
      },
    ],
  }

  return (
    <div className={styles.sliderContainer}>
      <Slider {...settings}>{children}</Slider>
    </div>
  );
}