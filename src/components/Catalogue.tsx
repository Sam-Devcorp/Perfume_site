import { useEffect, useState } from 'react';
import { Plus, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useCart } from '../context/CartContext';
import type { Perfume } from '../types';
import { formatFcfa } from '../lib/currency';

export function Catalogue() {
  const [perfumes, setPerfumes] = useState<Perfume[]>([]);
  const [filteredPerfumes, setFilteredPerfumes] = useState<Perfume[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();
  const [addedToCart, setAddedToCart] = useState<string | null>(null);

  const categories = ['Tous', 'Homme', 'Femme', 'Unisexe'];

  useEffect(() => {
    fetchPerfumes();
  }, []);

  useEffect(() => {
    if (selectedCategory === 'Tous') {
      setFilteredPerfumes(perfumes);
    } else {
      setFilteredPerfumes(perfumes.filter(p => p.category === selectedCategory));
    }
  }, [selectedCategory, perfumes]);

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
      setFilteredPerfumes(data || []);
    } catch (err) {
      setError('Erreur lors du chargement des parfums');
      console.error('Error fetching perfumes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (perfume: Perfume) => {
    addToCart(perfume);
    setAddedToCart(perfume.id);
    setTimeout(() => setAddedToCart(null), 2000);
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
        <div className="lux-panel rounded-xl p-9 max-w-md w-full text-center">
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
        <header className="mb-16 sm:mb-14">
          <p className="text-xs uppercase tracking-[0.2em] lux-accent mb-3">Collection</p>
          <h1 className="lux-title text-4xl sm:text-5xl font-bold mb-6">
            Notre Collection
          </h1>
          <p className="lux-body text-lg leading-relaxed max-w-2xl">
            Découvrez nos parfums authentiques de grandes marques
          </p>
        </header>

        <div className="flex gap-3 mb-16 sm:mb-14 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`interactive-button px-5 py-3 rounded-md text-xs uppercase tracking-[0.16em] font-medium whitespace-nowrap border ${
                selectedCategory === category
                  ? 'lux-button-primary'
                  : 'lux-button-secondary'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {filteredPerfumes.length === 0 ? (
          <div className="text-center py-20 lux-panel rounded-xl">
            <p className="lux-body text-lg">
              Aucun parfum disponible dans cette catégorie
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 sm:gap-8 lg:gap-9">
            {filteredPerfumes.map((perfume) => (
              <article
                key={perfume.id}
                className="interactive-card lux-panel rounded-xl overflow-hidden"
              >
                <div className="aspect-square bg-[var(--lux-surface-soft)] overflow-hidden">
                  <img
                    src={perfume.image_url}
                    alt={perfume.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-[1.03]"
                  />
                </div>
                <div className="p-7 sm:p-7">
                  <div className="mb-3">
                    <span className="lux-tag text-xs font-medium px-2.5 py-1 rounded">
                      {perfume.category}
                    </span>
                  </div>
                  <h3 className="lux-title text-2xl font-semibold mb-1">
                    {perfume.name}
                  </h3>
                  <p className="lux-body text-sm mb-4">{perfume.size}</p>
                  {perfume.description && (
                    <p className="lux-body text-sm mb-5 line-clamp-2">
                      {perfume.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="lux-title text-2xl font-bold">
                      {formatFcfa(perfume.price)}
                    </span>
                    <button
                      onClick={() => handleAddToCart(perfume)}
                      disabled={addedToCart === perfume.id}
                      className={`interactive-button w-12 h-12 rounded-md flex items-center justify-center ${
                        addedToCart === perfume.id
                          ? 'bg-[#69785b] text-[var(--lux-text)] border border-[#849473]'
                          : 'lux-button-primary'
                      }`}
                    >
                      {addedToCart === perfume.id ? (
                        <span className="text-xs font-semibold">✓</span>
                      ) : (
                        <Plus className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
