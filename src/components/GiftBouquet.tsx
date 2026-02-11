import { useEffect, useState } from 'react';
import { Check, Gift, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useCart } from '../context/CartContext';
import type { Perfume } from '../types';
import { formatFcfa, toFcfaInteger } from '../lib/currency';

type BouquetStep = 1 | 2 | 3;

export function GiftBouquet() {
  const [perfumes, setPerfumes] = useState<Perfume[]>([]);
  const [selectedPerfumes, setSelectedPerfumes] = useState<Perfume[]>([]);
  const [currentStep, setCurrentStep] = useState<BouquetStep>(1);
  const [isGift, setIsGift] = useState(true);
  const [giftMessage, setGiftMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const { addBouquetToCart } = useCart();
  const SOFT_RECOMMENDED_BOUQUET_SIZE = 3;

  useEffect(() => {
    fetchPerfumes();
  }, []);

  const fetchPerfumes = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('perfumes')
        .select('*')
        .eq('in_stock', true)
        .order('name');

      if (error) throw error;

      setPerfumes(data || []);
    } catch (err) {
      setError('Erreur lors du chargement des parfums');
      console.error('Error fetching perfumes:', err);
    } finally {
      setLoading(false);
    }
  };

  const togglePerfumeSelection = (perfume: Perfume) => {
    const selected = selectedPerfumes.some((p) => p.id === perfume.id);

    if (selected) {
      setSelectedPerfumes(selectedPerfumes.filter((p) => p.id !== perfume.id));
      return;
    }

    setSelectedPerfumes([...selectedPerfumes, perfume]);
  };

  const isSelected = (perfumeId: string) => {
    return selectedPerfumes.some((p) => p.id === perfumeId);
  };

  const getTotalPrice = () => {
    return selectedPerfumes.reduce((total, perfume) => total + toFcfaInteger(perfume.price), 0);
  };

  const goToNextStep = () => {
    if (selectedPerfumes.length === 0) return;
    if (currentStep === 1) setCurrentStep(2);
    if (currentStep === 2) setCurrentStep(3);
  };

  const goToPreviousStep = () => {
    if (currentStep === 3) setCurrentStep(2);
    if (currentStep === 2) setCurrentStep(1);
  };

  const handleGiftToggle = (checked: boolean) => {
    setIsGift(checked);
    if (!checked) setGiftMessage('');
  };

  const handleAddBouquetToCart = () => {
    if (selectedPerfumes.length === 0) return;

    addBouquetToCart(selectedPerfumes, giftMessage, 1, isGift);

    setSelectedPerfumes([]);
    setCurrentStep(1);
    setIsGift(true);
    setGiftMessage('');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--lux-gold)] mx-auto mb-4"></div>
          <p className="lux-body">Chargement des parfums...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="lux-panel rounded-xl p-8 max-w-md w-full text-center">
          <AlertCircle className="w-12 h-12 text-[var(--lux-danger-text)] mx-auto mb-4" />
          <p className="lux-title font-medium mb-4">{error}</p>
          <button
            onClick={fetchPerfumes}
            className="interactive-button lux-button-primary px-6 py-2.5 rounded-md"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 sm:py-20">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <header className="mb-14 sm:mb-12">
          <p className="text-xs uppercase tracking-[0.2em] lux-accent mb-3">Collection Signature</p>
          <h1 className="lux-title text-4xl sm:text-5xl font-bold mb-6 flex items-center gap-3">
            <Gift className="w-8 h-8 lux-accent" />
            Créer un Bouquet Cadeau
          </h1>
          <p className="lux-body text-lg leading-relaxed">
            Sélectionnez au moins 1 parfum pour composer un cadeau personnalisé
          </p>
        </header>

        {showSuccess && (
          <div className="mb-8 lux-success px-6 py-4 rounded-lg flex items-center gap-3">
            <Check className="w-5 h-5 flex-shrink-0" />
            <span>Bouquet ajouté au panier avec succès!</span>
          </div>
        )}

        <section className="lux-panel rounded-2xl p-7 sm:p-10 mb-14 sm:mb-12 step-enter" key={`bouquet-shell-${currentStep}`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="lux-title text-3xl font-semibold">
              Parfums Sélectionnés
            </h2>
            <span className="text-sm font-medium lux-body">
              {selectedPerfumes.length}
            </span>
          </div>

          {selectedPerfumes.length === 0 ? (
            <p className="lux-body text-center py-12">
              Aucun parfum sélectionné
            </p>
          ) : (
            <div className="space-y-4 mb-7">
              {selectedPerfumes.map((perfume) => (
                <div key={perfume.id} className="lux-panel-soft rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <p className="lux-title font-medium">{perfume.name}</p>
                    <p className="lux-body text-sm">{perfume.size}</p>
                  </div>
                  <p className="lux-title font-bold">{formatFcfa(perfume.price)}</p>
                </div>
              ))}
            </div>
          )}

          {selectedPerfumes.length > 0 && currentStep >= 2 && (
            <div className="mb-7 step-enter" key={`bouquet-step-message-${currentStep}`}>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="giftMessage" className="block text-sm font-medium lux-body">
                  Message Cadeau (optionnel)
                </label>
                <label className="flex items-center gap-2 text-sm lux-body">
                  <input
                    type="checkbox"
                    checked={isGift}
                    onChange={(e) => handleGiftToggle(e.target.checked)}
                    className="rounded border-[var(--lux-border)] bg-[rgba(255,253,249,0.72)] text-[var(--lux-gold)] focus:ring-[var(--lux-gold)]"
                  />
                  <span>Cadeau</span>
                </label>
              </div>
              <textarea
                id="giftMessage"
                value={giftMessage}
                onChange={(e) => setGiftMessage(e.target.value)}
                placeholder="Ajoutez un message personnalisé pour votre cadeau..."
                rows={3}
                className="w-full px-4 py-3 rounded-md border lux-border bg-[rgba(255,253,249,0.78)] text-[var(--lux-text)] focus:ring-2 focus:ring-[var(--lux-gold)] focus:border-transparent resize-none"
                maxLength={200}
                disabled={!isGift}
              />
              <p className="text-xs lux-body mt-1">{giftMessage.length} / 200 caractères</p>
            </div>
          )}

          {selectedPerfumes.length > 0 && currentStep === 3 && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t lux-divider step-enter">
              <div>
                <p className="text-sm lux-body mb-1">Total du Bouquet</p>
                <p className="lux-title text-3xl font-bold">{formatFcfa(getTotalPrice())}</p>
              </div>
              <button
                onClick={handleAddBouquetToCart}
                className="interactive-button w-full sm:w-auto lux-button-primary px-8 py-3.5 rounded-md font-semibold"
              >
                Ajouter au Panier
              </button>
            </div>
          )}

          {selectedPerfumes.length > 0 && (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mt-8 pt-6 border-t lux-divider">
              <button
                onClick={goToPreviousStep}
                disabled={currentStep === 1}
                className="interactive-button w-full sm:w-auto lux-button-secondary px-6 py-3 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Retour
              </button>
              {currentStep < 3 ? (
                <button
                  onClick={goToNextStep}
                  className={`interactive-button w-full sm:w-auto px-8 py-3 rounded-md font-semibold ${
                    currentStep === 1 && selectedPerfumes.length > SOFT_RECOMMENDED_BOUQUET_SIZE
                      ? 'lux-button-primary'
                      : 'lux-button-secondary'
                  }`}
                >
                  Continuer
                </button>
              ) : (
                <p className="text-sm lux-body">Etape {currentStep} / 3</p>
              )}
            </div>
          )}
        </section>

        {currentStep === 1 && (
          <section className="step-enter">
            <div className="mb-8">
              <h2 className="lux-title text-3xl font-semibold mb-2">
                Choisissez vos Parfums
              </h2>
              <div className="h-px w-20 bg-[var(--lux-border)]" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 sm:gap-8">
              {perfumes.map((perfume) => {
                const selected = isSelected(perfume.id);

                return (
                  <button
                    key={perfume.id}
                    onClick={() => togglePerfumeSelection(perfume)}
                    className={`interactive-card lux-panel rounded-xl overflow-hidden text-left relative ${
                      selected
                        ? 'ring-1 ring-[var(--lux-gold)] border-[var(--lux-border)]'
                        : ''
                    }`}
                  >
                    {selected && (
                      <div className="absolute top-3 right-3 z-10 bg-[var(--lux-gold)] text-[var(--lux-cream-text)] rounded-full p-2">
                        <Check className="w-5 h-5" />
                      </div>
                    )}
                    <div className="aspect-square bg-[var(--lux-surface-soft)] overflow-hidden">
                      <img
                        src={perfume.image_url}
                        alt={perfume.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <div className="mb-2">
                        <span className="lux-tag text-xs font-medium px-2.5 py-1 rounded">
                          {perfume.category}
                        </span>
                      </div>
                      <h3 className="lux-title text-xl font-semibold mb-1">
                        {perfume.name}
                      </h3>
                      <p className="lux-body text-sm mb-3">{perfume.size}</p>
                      <p className="lux-title text-xl font-bold">
                        {formatFcfa(perfume.price)}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
