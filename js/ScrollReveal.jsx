import { useEffect, useRef, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import './ScrollReveal.css';

gsap.registerPlugin(ScrollTrigger);

const ScrollReveal = ({
  children,
  scrollContainerRef,
  enableBlur = true,
  baseOpacity = 0.1,
  baseRotation = 3,
  blurStrength = 4,
  containerClassName = '',
  textClassName = '',
  rotationStart = 'top 95%',
  rotationEnd = 'top 75%',
  wordAnimationStart = 'top 85%',
  wordAnimationEnd = 'top 65%'
}) => {
  const containerRef = useRef(null);

  const splitText = useMemo(() => {
    let text = '';
    if (typeof children === 'string') {
      text = children;
    } else if (Array.isArray(children)) {
      text = children.map(child => typeof child === 'string' ? child : '').join('');
    } else if (children && typeof children.toString === 'function') {
      text = children.toString();
    }

    // Clean up spaces and newlines
    text = text.trim().replace(/\s+/g, ' ');

    return text.split(/(\s+)/).map((word, index) => {
      if (word.match(/^\s+$/)) return word;
      return (
        <span className="word" key={index}>
          {word}
        </span>
      );
    });
  }, [children]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const scroller = scrollContainerRef && scrollContainerRef.current ? scrollContainerRef.current : window;

    // Set initial transform origin and rotation
    gsap.set(el, { transformOrigin: '0% 50%', rotate: baseRotation });

    gsap.fromTo(
      el,
      { rotate: baseRotation },
      {
        ease: 'none',
        rotate: 0,
        scrollTrigger: {
          trigger: el,
          scroller,
          start: rotationStart,
          end: rotationEnd,
          scrub: true
        }
      }
    );

    const wordElements = el.querySelectorAll('.word');

    gsap.fromTo(
      wordElements,
      { opacity: baseOpacity },
      {
        ease: 'none',
        opacity: 1,
        stagger: 0.05,
        scrollTrigger: {
          trigger: el,
          scroller,
          start: wordAnimationStart,
          end: wordAnimationEnd,
          scrub: true
        }
      }
    );

    if (enableBlur) {
      gsap.fromTo(
        wordElements,
        { filter: `blur(${blurStrength}px)` },
        {
          ease: 'none',
          filter: 'blur(0px)',
          stagger: 0.05,
          scrollTrigger: {
            trigger: el,
            scroller,
            start: wordAnimationStart,
            end: wordAnimationEnd,
            scrub: true
          }
        }
      );
    }

    // Force GSAP ScrollTrigger to recalculate layout dimensions after React has mounted the component
    ScrollTrigger.refresh();

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [
    scrollContainerRef,
    enableBlur,
    baseRotation,
    baseOpacity,
    rotationStart,
    rotationEnd,
    wordAnimationStart,
    wordAnimationEnd,
    blurStrength
  ]);

  return (
    <div ref={containerRef} className={`react-scroll-reveal ${containerClassName}`}>
      <p className={`react-scroll-reveal-text ${textClassName}`}>{splitText}</p>
    </div>
  );
};

export default ScrollReveal;
