import { useMemo, useState } from 'react';

import {
  BarChart3,
  CheckCircle2,
  LogIn,
  LogOut,
  Menu,
  Package,
  PackagePlus,
  Search,
  ShoppingBag,
  Store,
  Trash2,
  User,
  X,
} from 'lucide-react';

import DepthCarousel from './components/DepthCarousel';
import PulseHeart from './components/PulseHeart';
import FuseButton from './components/FuseButton';
import JellyRadio from './components/JellyRadio';

import './App.css';

const seedProducts = [
  {
    id: 1,
    name: 'ORP Shadow Runner',
    category: 'Sneakers',
    price: 2199,
    stock: 14,
    sold: 21,
    image:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 2,
    name: 'Urban Oversize Black',
    category: 'Playeras',
    price: 899,
    stock: 23,
    sold: 17,
    image:
      'https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 3,
    name: 'ORP Street Vision',
    category: 'Sneakers',
    price: 2499,
    stock: 9,
    sold: 28,
    image:
      'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 4,
    name: 'Night District Hoodie',
    category: 'Hoodies',
    price: 1499,
    stock: 16,
    sold: 14,
    image:
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 5,
    name: 'Core Cargo',
    category: 'Pantalones',
    price: 1299,
    stock: 11,
    sold: 9,
    image:
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 6,
    name: 'ORP White Essential',
    category: 'Playeras',
    price: 749,
    stock: 31,
    sold: 32,
    image:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80',
  },
];

const seedOrders = [
  {
    id: 'ORP-0001',
    date: '2026-09-20',
    total: 4597,
    units: 3,
  },
  {
    id: 'ORP-0002',
    date: '2026-09-21',
    total: 3098,
    units: 2,
  },
];

function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);

    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function saveStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export default function App() {
  const [view, setView] = useState('home');

  const [products, setProducts] = useState(() =>
    readStorage('orp_products', seedProducts)
  );

  const [cart, setCart] = useState(() =>
    readStorage('orp_cart', [])
  );

  const [orders, setOrders] = useState(() =>
    readStorage('orp_orders', seedOrders)
  );

  const [user, setUser] = useState(() =>
    readStorage('orp_user', null)
  );

  const [category, setCategory] = useState('Todos');
  const [cartOpen, setCartOpen] = useState(false);

  const updateProducts = (nextProducts) => {
    setProducts(nextProducts);
    saveStorage('orp_products', nextProducts);
  };

  const updateCart = (nextCart) => {
    setCart(nextCart);
    saveStorage('orp_cart', nextCart);
  };

  const updateOrders = (nextOrders) => {
    setOrders(nextOrders);
    saveStorage('orp_orders', nextOrders);
  };

  const addToCart = (product) => {
    const existing = cart.find(
      (item) => item.id === product.id
    );

    if (existing) {
      if (existing.quantity >= product.stock) {
        return;
      }

      updateCart(
        cart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        )
      );
    } else {
      updateCart([
        ...cart,
        {
          ...product,
          quantity: 1,
        },
      ]);
    }

    setCartOpen(true);
  };

  const removeCartItem = (id) => {
    updateCart(
      cart.filter((item) => item.id !== id)
    );
  };

  const cartUnits = useMemo(
    () =>
      cart.reduce(
        (total, item) => total + item.quantity,
        0
      ),
    [cart]
  );

  const cartTotal = useMemo(
    () =>
      cart.reduce(
        (total, item) =>
          total + item.price * item.quantity,
        0
      ),
    [cart]
  );

  const categories = [
    'Todos',
    ...new Set(products.map((product) => product.category)),
  ];

  const visibleProducts =
    category === 'Todos'
      ? products
      : products.filter(
          (product) => product.category === category
        );

  const login = ({ name, role }) => {
    const session = {
      name,
      role,
    };

    setUser(session);
    saveStorage('orp_user', session);
    setView('home');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('orp_user');
    setView('home');
  };

  const checkout = () => {
    if (!cart.length) return;

    const nextProducts = products.map((product) => {
      const item = cart.find(
        (cartProduct) => cartProduct.id === product.id
      );

      if (!item) return product;

      return {
        ...product,
        stock: Math.max(
          0,
          product.stock - item.quantity
        ),
        sold: product.sold + item.quantity,
      };
    });

    const order = {
      id: `ORP-${Date.now()}`,
      date: new Date().toLocaleDateString('es-MX'),
      total: cartTotal,
      units: cartUnits,
    };

    updateProducts(nextProducts);
    updateOrders([order, ...orders]);
    updateCart([]);

    setCartOpen(false);
    setView('success');
  };

  return (
    <div className="app">
      <Announcement />

      <Navbar
        user={user}
        cartUnits={cartUnits}
        setView={setView}
        setCartOpen={setCartOpen}
        logout={logout}
      />

      <main>
        {view === 'home' && (
          <Home
            products={products}
            setView={setView}
            addToCart={addToCart}
          />
        )}

        {view === 'catalog' && (
          <Catalog
            products={visibleProducts}
            categories={categories}
            category={category}
            setCategory={setCategory}
            addToCart={addToCart}
          />
        )}

        {view === 'login' && (
          <Login login={login} />
        )}

        {view === 'seller' &&
          user?.role === 'Vendedor' && (
            <SellerPanel
              products={products}
              updateProducts={updateProducts}
            />
          )}

        {view === 'admin' &&
          user?.role === 'Administrador' && (
            <AdminPanel
              products={products}
              orders={orders}
            />
          )}

        {view === 'success' && (
          <Success
            setView={setView}
          />
        )}
      </main>

      {cartOpen && (
        <Cart
          cart={cart}
          total={cartTotal}
          close={() => setCartOpen(false)}
          removeItem={removeCartItem}
          checkout={checkout}
        />
      )}
    </div>
  );
}

function Announcement() {
  return (
    <div className="announcement">
      ENVÍO GRATIS EN COMPRAS MAYORES A $1,499
      <span>•</span>
      NUEVA COLECCIÓN / DROP 06
    </div>
  );
}

function Navbar({
  user,
  cartUnits,
  setView,
  setCartOpen,
  logout,
}) {
  return (
    <header className="navbar">
      <button
        className="logo"
        onClick={() => setView('home')}
      >
        ORP<span>SHOP</span>
      </button>

      <nav>
        <button onClick={() => setView('home')}>
          Inicio
        </button>

        <button onClick={() => setView('catalog')}>
          Shop
        </button>

        {user?.role === 'Vendedor' && (
          <button onClick={() => setView('seller')}>
            Vendedor
          </button>
        )}

        {user?.role === 'Administrador' && (
          <button onClick={() => setView('admin')}>
            Dashboard
          </button>
        )}
      </nav>

      <div className="nav-actions">
        <button>
          <Search size={20} />
        </button>

        {!user ? (
          <button onClick={() => setView('login')}>
            <User size={20} />
          </button>
        ) : (
          <button
            className="user-chip"
            onClick={logout}
          >
            {user.name}

            <LogOut size={16} />
          </button>
        )}

        <button
          className="cart-button"
          onClick={() => setCartOpen(true)}
        >
          <ShoppingBag size={20} />

          {cartUnits > 0 && (
            <span>{cartUnits}</span>
          )}
        </button>
      </div>
    </header>
  );
}

function Home({
  products,
  setView,
  addToCart,
}) {
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">
            ORP / URBAN CULTURE
          </p>

          <h1>
            WEAR
            <br />
            THE
            <span> STREETS.</span>
          </h1>

          <p>
            Sneakers, streetwear y piezas para
            quienes prefieren construir su propia
            identidad antes que seguir la de alguien
            más.
          </p>

          <div className="hero-buttons">
            <button
              className="primary-button"
              onClick={() => setView('catalog')}
            >
              EXPLORAR DROP
            </button>

            <button
              className="secondary-button"
              onClick={() => setView('catalog')}
            >
              VER TODO
            </button>
          </div>
        </div>

        <div className="hero-carousel">
          <DepthCarousel
            items={products.slice(0, 6)}
            autoplay
          />
        </div>
      </section>

      <section className="marquee">
        <div>
          ORP SHOP • STREET CULTURE • LIMITED DROPS •
          MEXICO CITY • ORP SHOP • STREET CULTURE •
          LIMITED DROPS •
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <div>
            <span className="eyebrow">
              CURATED FOR YOU
            </span>

            <h2>Trending now.</h2>
          </div>

          <button
            className="link-button"
            onClick={() => setView('catalog')}
          >
            Ver colección →
          </button>
        </div>

        <div className="product-grid">
          {products.slice(0, 4).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              addToCart={addToCart}
            />
          ))}
        </div>
      </section>

      <section className="editorial">
        <div>
          <span>ORP 2026</span>

          <h2>
            NO RULES.
            <br />
            JUST STYLE.
          </h2>
        </div>
      </section>
    </>
  );
}

function Catalog({
  products,
  categories,
  category,
  setCategory,
  addToCart,
}) {
  return (
    <section className="section catalog">
      <div className="catalog-heading">
        <span className="eyebrow">
          ORP SHOP / COLLECTION
        </span>

        <h1>SHOP ALL.</h1>
      </div>

      <JellyRadio
        items={categories}
        value={category}
        onChange={setCategory}
      />

      <div className="catalog-count">
        {products.length} PRODUCTOS
      </div>

      <div className="product-grid">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            addToCart={addToCart}
          />
        ))}
      </div>
    </section>
  );
}

function ProductCard({
  product,
  addToCart,
}) {
  return (
    <article className="product-card">
      <div className="product-image">
        <img
          src={product.image}
          alt={product.name}
        />

        <div className="favorite">
          <PulseHeart />
        </div>

        {product.stock <= 5 && (
          <span className="stock-alert">
            ÚLTIMAS {product.stock}
          </span>
        )}
      </div>

      <div className="product-info">
        <span>{product.category}</span>

        <h3>{product.name}</h3>

        <div className="product-bottom">
          <strong>
            ${product.price.toLocaleString('es-MX')}
          </strong>

          <button
            onClick={() => addToCart(product)}
            disabled={product.stock <= 0}
          >
            {product.stock <= 0
              ? 'Agotado'
              : 'Agregar +'}
          </button>
        </div>
      </div>
    </article>
  );
}

function Login({ login }) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('Cliente');

  const submit = (event) => {
    event.preventDefault();

    if (!name.trim()) return;

    login({
      name,
      role,
    });
  };

  return (
    <section className="login-page">
      <form
        className="login-card"
        onSubmit={submit}
      >
        <span className="eyebrow">
          ORP ACCOUNT
        </span>

        <h1>WELCOME BACK.</h1>

        <p>
          Para esta demo puedes seleccionar el tipo
          de usuario que deseas simular.
        </p>

        <label>
          Nombre
          <input
            type="text"
            placeholder="Tu nombre"
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
          />
        </label>

        <div>
          <span className="form-label">
            Tipo de cuenta
          </span>

          <JellyRadio
            items={[
              'Cliente',
              'Vendedor',
              'Administrador',
            ]}
            value={role}
            onChange={setRole}
          />
        </div>

        <button className="primary-button">
          <LogIn size={18} />
          INICIAR SESIÓN
        </button>
      </form>
    </section>
  );
}

function SellerPanel({
  products,
  updateProducts,
}) {
  const emptyProduct = {
    name: '',
    category: 'Sneakers',
    price: '',
    stock: '',
    image: '',
  };

  const [form, setForm] = useState(emptyProduct);
  const [deletedProduct, setDeletedProduct] =
    useState(null);

  const change = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const submit = (event) => {
    event.preventDefault();

    const product = {
      ...form,
      id: Date.now(),
      price: Number(form.price),
      stock: Number(form.stock),
      sold: 0,
      image:
        form.image ||
        'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=900&q=80',
    };

    updateProducts([
      product,
      ...products,
    ]);

    setForm(emptyProduct);
  };

  const deleteProduct = (product) => {
    setDeletedProduct(product);

    updateProducts(
      products.filter(
        (item) => item.id !== product.id
      )
    );
  };

  const restoreProduct = () => {
    if (!deletedProduct) return;

    updateProducts([
      deletedProduct,
      ...products,
    ]);

    setDeletedProduct(null);
  };

  return (
    <section className="dashboard">
      <div className="dashboard-heading">
        <div>
          <span className="eyebrow">
            SELLER CENTER
          </span>

          <h1>Productos.</h1>
        </div>

        <PackagePlus size={38} />
      </div>

      <div className="seller-grid">
        <form
          className="panel"
          onSubmit={submit}
        >
          <h2>Nuevo producto</h2>

          <label>
            Producto
            <input
              name="name"
              value={form.name}
              onChange={change}
              required
            />
          </label>

          <label>
            Categoría
            <select
              name="category"
              value={form.category}
              onChange={change}
            >
              <option>Sneakers</option>
              <option>Playeras</option>
              <option>Hoodies</option>
              <option>Pantalones</option>
              <option>Accesorios</option>
            </select>
          </label>

          <div className="form-row">
            <label>
              Precio
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={change}
                required
              />
            </label>

            <label>
              Stock
              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={change}
                required
              />
            </label>
          </div>

          <label>
            URL de imagen
            <input
              name="image"
              value={form.image}
              onChange={change}
              placeholder="https://..."
            />
          </label>

          <button className="primary-button">
            PUBLICAR PRODUCTO
          </button>
        </form>

        <div className="panel inventory">
          <h2>Inventario</h2>

          {products.map((product) => (
            <div
              className="inventory-row"
              key={product.id}
            >
              <img
                src={product.image}
                alt={product.name}
              />

              <div>
                <strong>{product.name}</strong>

                <span>
                  Stock: {product.stock}
                </span>
              </div>

              <span>
                ${product.price.toLocaleString('es-MX')}
              </span>

              <FuseButton
                label="Eliminar"
                undoLabel="Deshacer"
                onCommit={() =>
                  deleteProduct(product)
                }
                onUndo={restoreProduct}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AdminPanel({
  products,
  orders,
}) {
  const revenue = orders.reduce(
    (total, order) => total + order.total,
    0
  );

  const units = orders.reduce(
    (total, order) => total + order.units,
    0
  );

  const topProduct = [...products].sort(
    (a, b) => b.sold - a.sold
  )[0];

  const inventory = products.reduce(
    (total, product) => total + product.stock,
    0
  );

  return (
    <section className="dashboard">
      <div className="dashboard-heading">
        <div>
          <span className="eyebrow">
            ORP BUSINESS INTELLIGENCE
          </span>

          <h1>Dashboard.</h1>
        </div>

        <BarChart3 size={40} />
      </div>

      <div className="metrics">
        <Metric
          title="VENTAS"
          value={`$${revenue.toLocaleString(
            'es-MX'
          )}`}
          subtitle="Ingresos registrados"
        />

        <Metric
          title="PEDIDOS"
          value={orders.length}
          subtitle="Órdenes procesadas"
        />

        <Metric
          title="UNIDADES"
          value={units}
          subtitle="Productos vendidos"
        />

        <Metric
          title="INVENTARIO"
          value={inventory}
          subtitle="Unidades disponibles"
        />
      </div>

      <div className="admin-grid">
        <div className="panel">
          <span className="eyebrow">
            TOP PRODUCT
          </span>

          <div className="top-product">
            <img
              src={topProduct?.image}
              alt={topProduct?.name}
            />

            <div>
              <h2>{topProduct?.name}</h2>

              <strong>
                {topProduct?.sold} unidades
              </strong>

              <p>
                Producto con mayor número de ventas
                dentro del catálogo actual.
              </p>
            </div>
          </div>
        </div>

        <div className="panel">
          <h2>Ventas recientes</h2>

          <div className="orders">
            {orders.map((order) => (
              <div
                className="order-row"
                key={order.id}
              >
                <div>
                  <strong>{order.id}</strong>
                  <span>{order.date}</span>
                </div>

                <span>
                  {order.units} uds.
                </span>

                <strong>
                  ${order.total.toLocaleString(
                    'es-MX'
                  )}
                </strong>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Metric({
  title,
  value,
  subtitle,
}) {
  return (
    <article className="metric">
      <span>{title}</span>
      <strong>{value}</strong>
      <small>{subtitle}</small>
    </article>
  );
}

function Cart({
  cart,
  total,
  close,
  removeItem,
  checkout,
}) {
  return (
    <>
      <div
        className="cart-backdrop"
        onClick={close}
      />

      <aside className="cart">
        <div className="cart-header">
          <div>
            <span className="eyebrow">
              YOUR BAG
            </span>

            <h2>Carrito.</h2>
          </div>

          <button onClick={close}>
            <X />
          </button>
        </div>

        <div className="cart-content">
          {!cart.length && (
            <div className="empty-cart">
              <ShoppingBag size={50} />

              <h3>Tu carrito está vacío.</h3>

              <p>
                Una tragedia económica para ORP Shop.
              </p>
            </div>
          )}

          {cart.map((item) => (
            <div
              className="cart-item"
              key={item.id}
            >
              <img
                src={item.image}
                alt={item.name}
              />

              <div>
                <strong>{item.name}</strong>

                <span>
                  Cantidad: {item.quantity}
                </span>

                <span>
                  $
                  {(
                    item.price * item.quantity
                  ).toLocaleString('es-MX')}
                </span>
              </div>

              <button
                onClick={() =>
                  removeItem(item.id)
                }
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        {!!cart.length && (
          <div className="cart-footer">
            <div>
              <span>Total</span>

              <strong>
                ${total.toLocaleString('es-MX')}
              </strong>
            </div>

            <button
              className="primary-button"
              onClick={checkout}
            >
              FINALIZAR COMPRA
            </button>

            <small>
              Demo de pago. No se realiza ningún
              cobro real.
            </small>
          </div>
        )}
      </aside>
    </>
  );
}

function Success({ setView }) {
  return (
    <section className="success-page">
      <div>
        <CheckCircle2 size={70} />

        <span className="eyebrow">
          ORDER CONFIRMED
        </span>

        <h1>COMPRA COMPLETADA.</h1>

        <p>
          El pedido fue almacenado localmente y el
          inventario ha sido actualizado.
        </p>

        <button
          className="primary-button"
          onClick={() => setView('home')}
        >
          VOLVER A LA TIENDA
        </button>
      </div>
    </section>
  );
}