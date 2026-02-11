import { Trash2, ShoppingBag, Gift, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatFcfa, toFcfaInteger } from '../lib/currency';

interface CartProps {
  onNavigate: (page: string) => void;
}

export function Cart({ onNavigate }: CartProps) {
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lux-panel rounded-2xl p-14 text-center">
            <ShoppingBag className="w-16 h-16 lux-body mx-auto mb-5" />
            <h2 className="lux-title text-3xl font-semibold mb-3">
              Votre Panier est Vide
            </h2>
            <p className="lux-body mb-10 max-w-lg mx-auto">
              Découvrez notre collection de parfums et commencez vos achats
            </p>
            <button
              onClick={() => onNavigate('catalogue')}
              className="interactive-button lux-button-primary px-8 py-3.5 rounded-md font-semibold"
            >
              Voir le Catalogue
            </button>
          </div>
        </div>
      </div>
    );
  }

  const regularItems = cart.filter((item) => item.type === 'perfume');
  const giftBouquetItems = cart.filter((item) => item.type === 'bouquet');

  return (
    <div className="min-h-screen py-16 sm:py-20">
      <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8">
        <header className="mb-12">
          <p className="text-xs uppercase tracking-[0.2em] lux-accent mb-3">Panier</p>
          <h1 className="lux-title text-4xl sm:text-5xl font-bold">
            Votre Panier
          </h1>
        </header>

        <div className="space-y-9 mb-11">
          {regularItems.length > 0 && (
            <section className="lux-panel rounded-2xl p-7 sm:p-8 step-enter">
              <h2 className="lux-title text-2xl font-semibold mb-6">
                Articles
              </h2>
              <div className="space-y-6">
                {regularItems.map((item) => (
                  <article
                    key={item.id}
                    className="flex flex-col sm:flex-row gap-5 pb-6 border-b lux-divider last:border-0 last:pb-0"
                  >
                    <div className="w-24 h-24 sm:w-24 sm:h-24 bg-[var(--lux-surface-soft)] rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.perfume.image_url}
                        alt={item.perfume.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="lux-title font-semibold mb-1">
                        {item.perfume.name}
                      </h3>
                      <p className="text-sm lux-body mb-2">
                        {item.perfume.size}
                      </p>
                      <p className="lux-title text-lg font-bold">
                        {formatFcfa(item.perfume.price)}
                      </p>
                    </div>
                    <div className="flex sm:flex-col items-center justify-between sm:justify-start gap-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="interactive-button w-10 h-10 flex items-center justify-center lux-button-secondary rounded-md font-bold"
                        >
                          -
                        </button>
                        <span className="w-12 text-center font-medium lux-title">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="interactive-button w-10 h-10 flex items-center justify-center lux-button-secondary rounded-md font-bold"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="interactive-button p-2 text-[var(--lux-danger-text)] hover:bg-[var(--lux-danger-bg)] rounded-lg"
                        aria-label="Supprimer"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {giftBouquetItems.length > 0 && (
            <section className="lux-panel rounded-2xl p-7 sm:p-8 step-enter">
              <div className="flex items-center gap-2 mb-6">
                <Gift className="w-6 h-6 lux-accent" />
                <h2 className="lux-title text-2xl font-semibold">
                  Bouquet Cadeau
                </h2>
              </div>
              <div className="space-y-4">
                {giftBouquetItems.map((item) => {
                  const bouquetUnitTotal = item.items.reduce(
                    (total, bouquetItem) =>
                      total + toFcfaInteger(bouquetItem.perfume.price) * bouquetItem.quantity,
                    0
                  );

                  return (
                    <article
                      key={item.id}
                      className="interactive-card lux-panel-soft rounded-lg p-5"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <p className="lux-title font-semibold">Bouquet Cadeau</p>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="interactive-button p-2 text-[var(--lux-danger-text)] hover:bg-[var(--lux-danger-bg)] rounded-lg"
                          aria-label="Supprimer"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      {item.isGift && item.giftMessage && (
                        <div className="mb-4 p-3 bg-[rgba(238,228,214,0.06)] border lux-border rounded-lg">
                          <p className="text-sm lux-body mb-1">
                            Message cadeau:
                          </p>
                          <p className="lux-title italic">"{item.giftMessage}"</p>
                        </div>
                      )}

                      <div className="space-y-3 mb-4">
                        {item.items.map((bouquetItem) => (
                          <div
                            key={bouquetItem.perfume.id}
                            className="flex items-center justify-between"
                          >
                            <div>
                              <p className="lux-title font-medium">
                                {bouquetItem.perfume.name}
                              </p>
                              <p className="text-sm lux-body">
                                {bouquetItem.perfume.size}
                                {bouquetItem.quantity > 1 ? ` x${bouquetItem.quantity}` : ''}
                              </p>
                            </div>
                            <p className="lux-title font-bold">
                              {formatFcfa(toFcfaInteger(bouquetItem.perfume.price) * bouquetItem.quantity)}
                            </p>
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-4 border-t lux-divider">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="interactive-button w-10 h-10 flex items-center justify-center lux-button-secondary rounded-md font-bold"
                          >
                            -
                          </button>
                          <span className="w-12 text-center font-medium lux-title">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="interactive-button w-10 h-10 flex items-center justify-center lux-button-secondary rounded-md font-bold"
                          >
                            +
                          </button>
                        </div>
                        <p className="lux-title font-bold">
                          {formatFcfa(bouquetUnitTotal * item.quantity)}
                        </p>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          )}
        </div>

        <section className="lux-panel rounded-2xl p-7 sm:p-8 step-enter">
          <div className="flex items-center justify-between mb-6 pb-6 border-b lux-divider">
            <span className="text-lg font-medium lux-body">Total</span>
            <span className="lux-title text-3xl font-bold">
              {formatFcfa(getCartTotal())}
            </span>
          </div>
          <button
            onClick={() => onNavigate('checkout')}
            className="interactive-button w-full px-8 py-3.5 lux-button-primary rounded-md font-semibold flex items-center justify-center gap-2"
          >
            Procéder au Paiement
            <ArrowRight className="w-5 h-5" />
          </button>
        </section>
      </div>
    </div>
  );
}
