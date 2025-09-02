"use client";

import { ArrowRight } from 'lucide-react';
import React, { useState, useEffect } from 'react';

const HeroSection = () => {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const examples = [
  "Busco departamento 2D en Providencia, $600.000 máx",
  "Quiero arrendar una casa en Santiago Centro con 3 dormitorios",
  "Necesito un estudio amoblado en Ñuñoa cerca del metro",
  "Busco comprar casa 4D en Las Condes con jardín",
  "Quiero arrendar departamento 1D en Vitacura, amoblado"];


  useEffect(() => {
    const currentExample = examples[currentIndex];

    if (isPaused) {
      const pauseTimer = setTimeout(() => {
        setIsPaused(false);
        setIsTyping(false);
      }, 2000); // Pause for 2 seconds when complete
      return () => clearTimeout(pauseTimer);
    }

    if (isTyping) {
      if (currentText.length < currentExample.length) {
        const typingTimer = setTimeout(() => {
          setCurrentText(currentExample.slice(0, currentText.length + 1));
        }, 50); // Typing speed
        return () => clearTimeout(typingTimer);
      } else {
        setIsPaused(true);
      }
    } else {
      if (currentText.length > 0) {
        const deletingTimer = setTimeout(() => {
          setCurrentText(currentText.slice(0, -1));
        }, 30); // Deleting speed (faster than typing)
        return () => clearTimeout(deletingTimer);
      } else {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % examples.length);
        setIsTyping(true);
      }
    }
  }, [currentText, currentIndex, isTyping, isPaused, examples]);

  return (
    <section className="bg-background py-20 px-6 md:px-16 lg:px-24 !w-full !h-[432px]">
      <div className="mx-auto max-w-4xl">
        <div className="space-y-12 text-center">
          <div className="space-y-6">
            <h1 className="text-4xl leading-tight text-primary !font-(family-name:--font-inter) !font-bold !tracking-[-3.5px] md:!text-[51px] !opacity-100 lg:!text-6xl">
              Encuentra tu propiedad ideal en minutos con IA
            </h1>
          </div>
          <div className="mx-auto max-w-3xl">
            <form className="relative" onSubmit={(e) => e.preventDefault()}>
              <input
                id="try"
                type="text"
                aria-label="Property search input"
                placeholder={currentText}
                className="flex h-16 w-full rounded-xl border-2 border-border bg-card px-6 pr-16 text-base placeholder:text-muted-foreground transition-colors focus:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:text-lg" />

              <button
                type="submit"
                aria-label="Submit search"
                className="absolute top-1/2 right-2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full text-white transition-colors hover:opacity-80"
                style={{ backgroundColor: '#8C0529' }}>

                <ArrowRight className="h-5 w-5" />
              </button>
            </form>
          </div>
          <div className="space-y-4">
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
              Escribe lo que buscas y deja que Broky haga el resto.
            </p>
          </div>
        </div>
      </div>
    </section>);

};

export default HeroSection;