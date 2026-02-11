import { ShoppingBag, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../context/CartContext';

interface HeaderProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export function Header({ onNavigate, currentPage }: HeaderProps) {
  const { getCartItemsCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const cartCount = getCartItemsCount();

  const navItems = [
    { label: 'Accueil', page: 'home' },
    { label: 'Catalogue', page: 'catalogue' },
    { label: 'Créer un Bouquet', page: 'bouquet' },
  ];

  return (
    <header className="bg-[rgba(250,246,240,0.84)] border-b lux-border backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-20">
          <button
            onClick={() => onNavigate('home')}
            className="interactive-button text-lg sm:text-2xl font-bold lux-title tracking-[0.05em] hover:text-[var(--lux-gold)] transition-colors"
          >
            Maison de Parfum
          </button>

          <nav className="hidden md:flex items-center space-x-10">
            {navItems.map((item) => (
              <button
                key={item.page}
                onClick={() => onNavigate(item.page)}
                className={`interactive-button text-xs font-medium tracking-[0.18em] uppercase transition-colors ${
                  currentPage === item.page
                    ? 'lux-accent'
                    : 'lux-body hover:text-[var(--lux-text)]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => onNavigate('cart')}
              className="interactive-button relative p-2.5 lux-body hover:text-[var(--lux-text)] transition-colors"
              aria-label="Panier"
            >
              <ShoppingBag className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="interactive-fade absolute -top-1 -right-1 bg-[var(--lux-gold)] text-[var(--lux-cream-text)] text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="interactive-button md:hidden p-2.5 lux-body hover:text-[var(--lux-text)]"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <nav className="md:hidden mt-1 py-3 pb-5 border-t lux-divider step-enter">
            {navItems.map((item) => (
              <button
                key={item.page}
                onClick={() => {
                  onNavigate(item.page);
                  setMobileMenuOpen(false);
                }}
                className={`interactive-button block w-full text-left px-5 py-4 text-sm font-medium rounded-md transition-colors ${
                  currentPage === item.page
                    ? 'lux-accent bg-[rgba(183,155,110,0.12)]'
                    : 'lux-body hover:text-[var(--lux-text)] hover:bg-[rgba(183,155,110,0.08)]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
