import { useEffect, useMemo, useState } from 'react';
import { CartProvider } from './context/CartContext';
import { Header } from './components/Header';
import { Homepage } from './components/Homepage';
import { Catalogue } from './components/Catalogue';
import { GiftBouquet } from './components/GiftBouquet';
import { Cart } from './components/Cart';
import { Checkout } from './components/Checkout';
import { OrderConfirmation } from './components/OrderConfirmation';
import type { OrderConfirmation as OrderConfirmationType } from './types';

type Page = 'home' | 'catalogue' | 'bouquet' | 'cart' | 'checkout' | 'confirmation';

function App() {
  const pageToHash = useMemo(
    () => ({
      home: '#/',
      catalogue: '#/catalogue',
      bouquet: '#/bouquet',
      cart: '#/cart',
      checkout: '#/checkout',
      confirmation: '#/confirmation',
    }),
    []
  );

  const getPageFromHash = () => {
    const hash = window.location.hash.replace(/^#/, '');
    const path = hash.startsWith('/') ? hash : `/${hash}`;

    switch (path) {
      case '/':
      case '':
        return 'home';
      case '/catalogue':
        return 'catalogue';
      case '/bouquet':
        return 'bouquet';
      case '/cart':
        return 'cart';
      case '/checkout':
        return 'checkout';
      case '/confirmation':
        return 'confirmation';
      default:
        return 'home';
    }
  };

  const [currentPage, setCurrentPage] = useState<Page>(getPageFromHash);
  const [orderConfirmation, setOrderConfirmation] = useState<OrderConfirmationType | null>(null);

  useEffect(() => {
    const handleHashChange = () => {
      const nextPage = getPageFromHash();
      setCurrentPage(nextPage);

      const normalizedHash = pageToHash[nextPage];
      if (window.location.hash !== normalizedHash) {
        window.location.hash = normalizedHash;
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [pageToHash]);

  const handleNavigate = (page: string) => {
    const nextPage = page as Page;
    const targetHash = pageToHash[nextPage] ?? pageToHash.home;
    if (window.location.hash !== targetHash) {
      window.location.hash = targetHash;
    } else {
      setCurrentPage(nextPage);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderComplete = (confirmation: OrderConfirmationType) => {
    setOrderConfirmation(confirmation);
    handleNavigate('confirmation');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Homepage onNavigate={handleNavigate} />;
      case 'catalogue':
        return <Catalogue />;
      case 'bouquet':
        return <GiftBouquet />;
      case 'cart':
        return <Cart onNavigate={handleNavigate} />;
      case 'checkout':
        return <Checkout onOrderComplete={handleOrderComplete} onNavigate={handleNavigate} />;
      case 'confirmation':
        return orderConfirmation ? (
          <OrderConfirmation confirmation={orderConfirmation} onNavigate={handleNavigate} />
        ) : (
          <Homepage onNavigate={handleNavigate} />
        );
      default:
        return <Homepage onNavigate={handleNavigate} />;
    }
  };

  return (
    <CartProvider>
      <div className="min-h-screen lux-page">
        <Header onNavigate={handleNavigate} currentPage={currentPage} />
        <main key={currentPage} className="page-enter">
          {renderPage()}
        </main>
      </div>
    </CartProvider>
  );
}

export default App;
