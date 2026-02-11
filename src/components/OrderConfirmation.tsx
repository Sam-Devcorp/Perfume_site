import { CheckCircle, Package, Truck, CreditCard } from 'lucide-react';
import type { OrderConfirmation as OrderConfirmationType } from '../types';
import { formatFcfa } from '../lib/currency';

interface OrderConfirmationProps {
  confirmation: OrderConfirmationType;
  onNavigate: (page: string) => void;
}

export function OrderConfirmation({ confirmation, onNavigate }: OrderConfirmationProps) {
  return (
    <div className="min-h-screen py-20 sm:py-20">
      <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="lux-panel rounded-2xl overflow-hidden step-enter">
          <header className="text-center px-7 sm:px-8 py-12 sm:py-16 border-b lux-divider bg-[rgba(238,228,214,0.05)]">
            <CheckCircle className="w-20 h-20 mx-auto mb-5 lux-accent" />
            <h1 className="lux-title text-4xl sm:text-5xl font-bold mb-3">
              Commande Confirmée!
            </h1>
            <p className="lux-body text-lg">
              Merci pour votre confiance
            </p>
          </header>

          <div className="p-7 sm:p-12">
            <div className="mb-10 text-center">
              <p className="text-sm font-medium lux-body mb-2">
                Référence de commande
              </p>
              <p className="text-2xl font-bold lux-title font-mono tracking-[0.06em]">
                {confirmation.orderReference}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6 mb-10 pb-10 border-b lux-divider">
              <div>
                <p className="text-sm font-medium lux-body mb-1">
                  Client
                </p>
                <p className="text-lg font-semibold lux-title">
                  {confirmation.customerName}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium lux-body mb-1">
                  Montant Total
                </p>
                <p className="text-lg font-semibold lux-accent">
                  {formatFcfa(confirmation.totalAmount)}
                </p>
              </div>
            </div>

            <section className="space-y-8 mb-10">
              <h2 className="text-2xl font-bold lux-title">
                Prochaines Étapes
              </h2>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full border lux-border flex items-center justify-center">
                    <Package className="w-5 h-5 lux-accent" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold lux-title mb-1">
                    1. Préparation de votre commande
                  </h3>
                  <p className="lux-body">
                    Notre équipe prépare soigneusement votre commande avec attention.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full border lux-border flex items-center justify-center">
                    <Truck className="w-5 h-5 lux-accent" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold lux-title mb-1">
                    2. Livraison à votre adresse
                  </h3>
                  <p className="lux-body">
                    Votre commande sera livrée directement à l'adresse indiquée dans les meilleurs délais.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full border lux-border flex items-center justify-center">
                    <CreditCard className="w-5 h-5 lux-accent" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold lux-title mb-1">
                    3. Paiement à la livraison
                  </h3>
                  <p className="lux-body">
                    Réglez votre commande en espèces lors de la réception. Simple et sécurisé.
                  </p>
                </div>
              </div>
            </section>

            <div className="lux-panel-soft rounded-lg p-6 mb-10">
              <p className="lux-body">
                <span className="font-semibold lux-title">Note importante:</span>{' '}
                Conservez votre référence de commande. Vous recevrez un appel de confirmation
                avant la livraison.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-4">
              <button
                onClick={() => onNavigate('home')}
                className="interactive-button flex-1 px-8 py-3.5 lux-button-primary rounded-md font-semibold"
              >
                Retour à l'Accueil
              </button>
              <button
                onClick={() => onNavigate('catalogue')}
                className="interactive-button flex-1 px-8 py-3.5 lux-button-secondary rounded-md font-semibold"
              >
                Continuer vos Achats
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
