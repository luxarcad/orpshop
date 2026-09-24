import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './DepthCarousel.css';

export default function DepthCarousel({
  items = [],
  autoplay = true,
  autoplayDelay = 3500,
}) {
  const [active, setActive] = useState(0);
  const cardsRef = useRef([]);

  const move = (direction) => {
    setActive((current) => {
      const next = current + direction;

      if (next < 0) return items.length - 1;
      if (next >= items.length) return 0;

      return next;
    });
  };

  useEffect(() => {
    cardsRef.current.forEach((card, index) => {
      if (!card) return;

      let distance = index - active;

      if (distance < -items.length / 2) {
        distance += items.length;
      }

      if (distance > items.length / 2) {
        distance -= items.length;
      }

      gsap.to(card, {
        x: distance * 85,
        z: -Math.abs(distance) * 190,
        rotateY: distance * -12,
        scale: distance === 0 ? 1 : 0.88,
        opacity: Math.abs(distance) > 3 ? 0 : 1,
        duration: 0.75,
        ease: 'power3.out',
        zIndex: 50 - Math.abs(distance),
      });
    });
  }, [active, items.length]);

  useEffect(() => {
    if (!autoplay || items.length <= 1) return undefined;

    const timer = setInterval(() => {
      move(1);
    }, autoplayDelay);

    return () => clearInterval(timer);
  }, [autoplay, autoplayDelay, items.length]);

  return (
    <div className="depth-carousel">
      <div className="depth-carousel-stage">
        {items.map((item, index) => (
          <article
            key={item.id ?? index}
            ref={(element) => {
              cardsRef.current[index] = element;
            }}
            className="depth-card"
            onClick={() => setActive(index)}
          >
            <img src={item.image} alt={item.name} />

            <div className="depth-card-overlay">
              <span>{item.category}</span>

              <h3>{item.name}</h3>

              {item.price && (
                <strong>
                  ${Number(item.price).toLocaleString('es-MX')}
                </strong>
              )}
            </div>
          </article>
        ))}
      </div>

      <button
        className="depth-arrow depth-arrow-left"
        onClick={() => move(-1)}
        aria-label="Anterior"
      >
        <ChevronLeft />
      </button>

      <button
        className="depth-arrow depth-arrow-right"
        onClick={() => move(1)}
        aria-label="Siguiente"
      >
        <ChevronRight />
      </button>

      <div className="depth-indicators">
        {items.map((item, index) => (
          <button
            key={item.id ?? index}
            className={index === active ? 'active' : ''}
            onClick={() => setActive(index)}
            aria-label={`Ir al producto ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}