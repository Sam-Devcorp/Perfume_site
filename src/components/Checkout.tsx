import { useState, FormEvent } from 'react';
import { Loader2, CreditCard } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { supabase } from '../lib/supabase';
import type { Order, OrderConfirmation } from '../types';
import { formatFcfa, toFcfaInteger } from '../lib/currency';

interface CheckoutProps {
  onOrderComplete: (confirmation: OrderConfirmation) => void;
  onNavigate: (page: string) => void;
}

export function Checkout({ onOrderComplete, onNavigate }: CheckoutProps) {
  const { cart, getCartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    deliveryAddress: '',
    deliveryNote: '',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const generateOrderReference = () => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 7);
    return `ORD-${timestamp}-${random}`.toUpperCase();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.customerName.trim() || !formData.customerPhone.trim() || !formData.deliveryAddress.trim()) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (cart.length === 0) {
      setError('Votre panier est vide');
      return;
    }

    setLoading(true);

    try {
      const orderReference = generateOrderReference();
      const totalAmount = toFcfaInteger(getCartTotal());
      const orderPayload: Order = {
        customer: {
          fullName: formData.customerName.trim(),
          phone: formData.customerPhone.trim(),
        },
        delivery: {
          method: 'cash_on_delivery',
          address: formData.deliveryAddress.trim(),
          note: formData.deliveryNote.trim() || undefined,
        },
        items: {
          individual: cart
            .filter((item) => item.type === 'perfume')
            .map((item) => ({
              perfumeId: item.perfume.id,
              quantity: item.quantity,
              unitPrice: toFcfaInteger(item.perfume.price),
            })),
          bouquets: cart
            .filter((item) => item.type === 'bouquet')
            .map((item) => ({
              quantity: item.quantity,
              isGift: item.isGift,
              giftMessage: item.giftMessage || undefined,
              items: item.items.map((bouquetItem) => ({
                perfumeId: bouquetItem.perfume.id,
                quantityPerBouquet: bouquetItem.quantity,
                unitPrice: toFcfaInteger(bouquetItem.perfume.price),
              })),
            })),
        },
        totalAmount,
      };

      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_reference: orderReference,
          customer_name: orderPayload.customer.fullName,
          customer_phone: orderPayload.customer.phone,
          delivery_address: orderPayload.delivery.address,
          delivery_note: orderPayload.delivery.note || '',
          total_amount: orderPayload.totalAmount,
          status: 'pending',
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const individualOrderItems = orderPayload.items.individual.map((item) => ({
        order_id: orderData.id,
        perfume_id: item.perfumeId,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        is_gift_bouquet_item: false,
        gift_message: '',
      }));

      const bouquetOrderItems = orderPayload.items.bouquets.flatMap((bouquet) =>
        bouquet.items.map((item) => ({
          order_id: orderData.id,
          perfume_id: item.perfumeId,
          quantity: item.quantityPerBouquet * bouquet.quantity,
          unit_price: item.unitPrice,
          is_gift_bouquet_item: true,
          gift_message: bouquet.giftMessage || '',
        }))
      );

      const orderItems = [...individualOrderItems, ...bouquetOrderItems];

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      const confirmation: OrderConfirmation = {
        orderReference,
        customerName: formData.customerName,
        totalAmount,
        createdAt: orderData.created_at,
      };

      clearCart();
      onOrderComplete(confirmation);
    } catch (err) {
      console.error('Error creating order:', err);
      setError('Une erreur est survenue lors de la création de votre commande. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lux-panel rounded-2xl p-12 text-center">
            <h2 className="lux-title text-3xl font-semibold mb-3">
              Votre Panier est Vide
            </h2>
            <p className="lux-body mb-8">
              Ajoutez des articles à votre panier avant de passer commande
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

  return (
    <div className="min-h-screen py-20 sm:py-20">
      <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8">
        <header className="mb-12">
          <p className="text-xs uppercase tracking-[0.2em] lux-accent mb-3">Finalisation</p>
          <h1 className="lux-title text-4xl sm:text-5xl font-bold">
            Finaliser la Commande
          </h1>
        </header>

        <div className="grid lg:grid-cols-[1.25fr_0.75fr] gap-10">
          <div className="lg:col-span-1">
            <form onSubmit={handleSubmit} className="lux-panel rounded-2xl p-7 sm:p-10 step-enter">
              <h2 className="lux-title text-2xl font-semibold mb-8">
                Informations de Livraison
              </h2>

              {error && (
                <div className="mb-6 p-4 lux-danger rounded-lg">
                  {error}
                </div>
              )}

              <div className="space-y-8">
                <div>
                  <label
                    htmlFor="customerName"
                    className="block text-sm font-medium lux-body mb-2"
                  >
                    Nom Complet *
                  </label>
                  <input
                    type="text"
                    id="customerName"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3.5 rounded-md border lux-border bg-[rgba(255,253,249,0.78)] text-[var(--lux-text)] focus:ring-2 focus:ring-[var(--lux-gold)] focus:border-transparent"
                    placeholder="Entrez votre nom complet"
                  />
                </div>

                <div>
                  <label
                    htmlFor="customerPhone"
                    className="block text-sm font-medium lux-body mb-2"
                  >
                    Numéro de Téléphone *
                  </label>
                  <input
                    type="tel"
                    id="customerPhone"
                    name="customerPhone"
                    value={formData.customerPhone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3.5 rounded-md border lux-border bg-[rgba(255,253,249,0.78)] text-[var(--lux-text)] focus:ring-2 focus:ring-[var(--lux-gold)] focus:border-transparent"
                    placeholder="Ex: 0612345678"
                  />
                </div>

                <div>
                  <label
                    htmlFor="deliveryAddress"
                    className="block text-sm font-medium lux-body mb-2"
                  >
                    Adresse de Livraison *
                  </label>
                  <textarea
                    id="deliveryAddress"
                    name="deliveryAddress"
                    value={formData.deliveryAddress}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="w-full px-4 py-3.5 rounded-md border lux-border bg-[rgba(255,253,249,0.78)] text-[var(--lux-text)] focus:ring-2 focus:ring-[var(--lux-gold)] focus:border-transparent resize-none"
                    placeholder="Entrez votre adresse complète"
                  />
                </div>

                <div>
                  <label
                    htmlFor="deliveryNote"
                    className="block text-sm font-medium lux-body mb-2"
                  >
                    Note de Livraison (optionnel)
                  </label>
                  <textarea
                    id="deliveryNote"
                    name="deliveryNote"
                    value={formData.deliveryNote}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full px-4 py-3.5 rounded-md border lux-border bg-[rgba(255,253,249,0.78)] text-[var(--lux-text)] focus:ring-2 focus:ring-[var(--lux-gold)] focus:border-transparent resize-none"
                    placeholder="Instructions particulières pour la livraison"
                  />
                </div>
              </div>

              <div className="mt-9 pt-7 border-t lux-divider">
                <div className="flex items-center gap-3 p-4 lux-panel-soft rounded-lg mb-7">
                  <CreditCard className="w-5 h-5 lux-accent flex-shrink-0" />
                  <p className="text-sm lux-body">
                    <span className="font-semibold">Paiement à la livraison</span> -
                    Vous paierez en espèces lors de la réception de votre commande
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="interactive-button w-full px-8 py-3.5 lux-button-primary rounded-md font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Traitement en cours...
                    </>
                  ) : (
                    'Confirmer la Commande'
                  )}
                </button>
              </div>
            </form>
          </div>

          <aside className="lg:col-span-1">
            <div className="lux-panel rounded-2xl p-7 sticky top-20 sm:top-24 step-enter">
              <h2 className="lux-title text-xl font-semibold mb-5">
                Résumé de la Commande
              </h2>
              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  item.type === 'perfume' ? (
                    <div key={item.id} className="flex justify-between text-sm gap-3">
                      <div className="flex-1">
                        <p className="lux-title font-medium">{item.perfume.name}</p>
                        <p className="lux-body">Qty: {item.quantity}</p>
                      </div>
                      <p className="lux-title font-medium">
                        {formatFcfa(toFcfaInteger(item.perfume.price) * item.quantity)}
                      </p>
                    </div>
                  ) : (
                    <div key={item.id} className="flex justify-between text-sm gap-3">
                      <div className="flex-1">
                        <p className="lux-title font-medium">Bouquet Cadeau</p>
                        <p className="lux-body">Qty: {item.quantity}</p>
                      </div>
                      <p className="lux-title font-medium">
                        {formatFcfa(item.items.reduce(
                          (total, bouquetItem) => total + toFcfaInteger(bouquetItem.perfume.price) * bouquetItem.quantity,
                          0
                        ) * item.quantity)}
                      </p>
                    </div>
                  )
                ))}
              </div>
              <div className="pt-4 border-t lux-divider">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold lux-title">Total</span>
                  <span className="text-2xl font-bold lux-accent">
                    {formatFcfa(getCartTotal())}
                  </span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
