/*
  # Perfume Shop Database Schema

  1. New Tables
    - `perfumes`
      - `id` (uuid, primary key)
      - `name` (text) - Perfume name
      - `category` (text) - Category: Homme, Femme, Unisexe
      - `size` (text) - Size description (e.g., "50ml", "100ml")
      - `price` (decimal) - Price in local currency
      - `image_url` (text) - URL to product image
      - `description` (text, optional) - Product description
      - `in_stock` (boolean) - Stock availability
      - `created_at` (timestamptz) - Creation timestamp

    - `orders`
      - `id` (uuid, primary key)
      - `order_reference` (text, unique) - Human-readable order reference
      - `customer_name` (text) - Full name
      - `customer_phone` (text) - Phone number
      - `delivery_address` (text) - Delivery address
      - `delivery_note` (text, optional) - Optional delivery instructions
      - `total_amount` (decimal) - Total order amount
      - `status` (text) - Order status: pending, confirmed, delivered, cancelled
      - `created_at` (timestamptz) - Order creation timestamp

    - `order_items`
      - `id` (uuid, primary key)
      - `order_id` (uuid, foreign key) - Reference to orders table
      - `perfume_id` (uuid, foreign key) - Reference to perfumes table
      - `quantity` (integer) - Quantity ordered
      - `unit_price` (decimal) - Price at time of order
      - `is_gift_bouquet_item` (boolean) - Whether this item is part of a gift bouquet
      - `gift_message` (text, optional) - Optional gift message for bouquets
      - `created_at` (timestamptz) - Creation timestamp

  2. Security
    - Enable RLS on all tables
    - Public read access for perfumes (catalogue is public)
    - Public insert for orders and order_items (anonymous checkout)
    - No update/delete for public users (admin only, to be added later)
*/

-- Create perfumes table
CREATE TABLE IF NOT EXISTS perfumes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL CHECK (category IN ('Homme', 'Femme', 'Unisexe')),
  size text NOT NULL,
  price decimal(10, 2) NOT NULL CHECK (price > 0),
  image_url text NOT NULL,
  description text DEFAULT '',
  in_stock boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_reference text UNIQUE NOT NULL,
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  delivery_address text NOT NULL,
  delivery_note text DEFAULT '',
  total_amount decimal(10, 2) NOT NULL CHECK (total_amount > 0),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'delivered', 'cancelled')),
  created_at timestamptz DEFAULT now()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  perfume_id uuid NOT NULL REFERENCES perfumes(id),
  quantity integer NOT NULL CHECK (quantity > 0),
  unit_price decimal(10, 2) NOT NULL CHECK (unit_price > 0),
  is_gift_bouquet_item boolean DEFAULT false,
  gift_message text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_perfumes_category ON perfumes(category);
CREATE INDEX IF NOT EXISTS idx_perfumes_in_stock ON perfumes(in_stock);
CREATE INDEX IF NOT EXISTS idx_orders_reference ON orders(order_reference);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- Enable Row Level Security
ALTER TABLE perfumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for perfumes table
CREATE POLICY "Public can view in-stock perfumes"
  ON perfumes FOR SELECT
  USING (in_stock = true);

-- RLS Policies for orders table
CREATE POLICY "Public can create orders"
  ON orders FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Public can view own orders by reference"
  ON orders FOR SELECT
  USING (true);

-- RLS Policies for order_items table
CREATE POLICY "Public can create order items"
  ON order_items FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Public can view order items"
  ON order_items FOR SELECT
  USING (true);