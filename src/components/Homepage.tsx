import { useEffect, useState } from 'react';
import { Sparkles, ShieldCheck, Truck, ChevronLeft, ChevronRight } from 'lucide-react';

interface HomepageProps {
  onNavigate: (page: string) => void;
}

export function Homepage({ onNavigate }: HomepageProps) {
  const slides = [
    {
      headline: "L'Élégance d'un Parfum de Qualité",
      subtext: 'Découvrez notre sélection de parfums de marque authentiques. Commandez en toute confiance et payez à la livraison.',
      ctaLabel: 'Voir les Parfums',
      ctaPage: 'catalogue',
    },
    {
      headline: 'Une Signature Olfactive Distinctive',
      subtext: 'Des fragrances choisies avec exigence pour sublimer votre présence au quotidien.',
      ctaLabel: 'Découvrir le Catalogue',
      ctaPage: 'catalogue',
    },
    {
      headline: 'Offrez Un Bouquet Raffiné',
      subtext: 'Composez un bouquet parfumé personnalisé pour une attention élégante et mémorable.',
      ctaLabel: 'Créer un Bouquet Cadeau',
      ctaPage: 'bouquet',
    },
  ] as const;

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 7000);

    return () => window.clearInterval(interval);
  }, [slides.length]);

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <div className="min-h-screen">
      <section className="relative step-enter py-16 sm:py-24 lg:py-28">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="lux-panel rounded-2xl p-7 sm:p-12 lg:p-16 border lux-border relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_85%_12%,rgba(183,155,110,0.16),transparent_45%)]" />
            <div className="max-w-4xl relative min-h-[420px] sm:min-h-[390px]">
              {slides.map((slide, index) => (
                <div
                  key={slide.headline}
                  className={`absolute inset-0 transition-opacity duration-500 ease-out ${
                    index === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
                  }`}
                  aria-hidden={index !== currentSlide}
                >
                  <p className="text-xs uppercase tracking-[0.22em] lux-accent mb-6">Maison de Parfum</p>
                  <h1 className="lux-title text-4xl sm:text-6xl lg:text-7xl font-bold leading-[1.12] sm:leading-[1.06] mb-8 max-w-3xl">
                    {slide.headline}
                  </h1>
                  {slide.subtext && (
                    <p className="lux-body text-base sm:text-lg leading-relaxed sm:leading-relaxed mb-10 max-w-2xl">
                      {slide.subtext}
                    </p>
                  )}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <button
                      onClick={() => onNavigate(slide.ctaPage)}
                      className="interactive-button w-full sm:w-auto lux-button-primary px-8 py-3.5 font-semibold rounded-md"
                    >
                      {slide.ctaLabel}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="absolute bottom-6 sm:bottom-10 right-6 sm:right-12 flex items-center gap-2.5">
              <button
                onClick={goToPrevSlide}
                className="interactive-button w-10 h-10 rounded-full lux-button-secondary flex items-center justify-center"
                aria-label="Slide précédent"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={goToNextSlide}
                className="interactive-button w-10 h-10 rounded-full lux-button-secondary flex items-center justify-center"
                aria-label="Slide suivant"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-2 ml-2">
                {slides.map((slide, index) => (
                  <button
                    key={`${slide.headline}-dot`}
                    onClick={() => setCurrentSlide(index)}
                    className={`interactive-button h-1.5 rounded-full ${
                      index === currentSlide
                        ? 'w-8 bg-[var(--lux-gold)]'
                        : 'w-3 bg-[rgba(131,108,77,0.22)] hover:bg-[rgba(131,108,77,0.38)]'
                    }`}
                    aria-label={`Aller au slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
            <article className="interactive-card lux-panel rounded-xl p-8">
              <div className="inline-flex items-center justify-center w-11 h-11 rounded-full border lux-border mb-5">
                <Sparkles className="w-5 h-5 lux-accent" />
              </div>
              <h3 className="lux-title text-2xl font-semibold mb-3">
                Parfums Authentiques
              </h3>
              <p className="lux-body leading-relaxed">
                Nous garantissons l'authenticité de tous nos parfums de marque.
              </p>
            </article>

            <article className="interactive-card lux-panel rounded-xl p-8">
              <div className="inline-flex items-center justify-center w-11 h-11 rounded-full border lux-border mb-5">
                <Truck className="w-5 h-5 lux-accent" />
              </div>
              <h3 className="lux-title text-2xl font-semibold mb-3">
                Livraison Locale
              </h3>
              <p className="lux-body leading-relaxed">
                Livraison rapide dans votre région avec paiement à la réception.
              </p>
            </article>

            <article className="interactive-card lux-panel rounded-xl p-8">
              <div className="inline-flex items-center justify-center w-11 h-11 rounded-full border lux-border mb-5">
                <ShieldCheck className="w-5 h-5 lux-accent" />
              </div>
              <h3 className="lux-title text-2xl font-semibold mb-3">
                Paiement Sécurisé
              </h3>
              <p className="lux-body leading-relaxed">
                Payez en espèces lors de la livraison. Simple et sans risque.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="rounded-2xl border lux-border bg-[var(--lux-cream)] text-[var(--lux-cream-text)] p-8 sm:p-14 text-center">
            <h2 className="text-4xl sm:text-5xl font-bold mb-5">
              Prêt à Commander?
            </h2>
            <p className="text-lg leading-relaxed mb-10 max-w-2xl mx-auto text-[#4f4337]">
              Explorez notre collection de parfums ou créez un bouquet cadeau personnalisé.
            </p>
            <button
              onClick={() => onNavigate('catalogue')}
              className="interactive-button px-8 py-3.5 rounded-md font-semibold lux-button-secondary"
            >
              Découvrir le Catalogue
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
