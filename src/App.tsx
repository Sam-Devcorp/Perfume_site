import { useState } from 'react';
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
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [orderConfirmation, setOrderConfirmation] = useState<OrderConfirmationType | null>(null);

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderComplete = (confirmation: OrderConfirmationType) => {
    setOrderConfirmation(confirmation);
    setCurrentPage('confirmation');
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
