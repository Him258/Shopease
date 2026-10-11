import React, { useState, useEffect } from 'react';
import { Search, Sparkles, Filter, PackageX } from 'lucide-react';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';

const CATEGORIES = ['All', 'Shoes', 'T-Shirts', 'Accessories'];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('default');

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = '/products';
      const params = new URLSearchParams();

      if (selectedCategory && selectedCategory !== 'All') {
        params.append('category', selectedCategory);
      }

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await api.get(url);
      setProducts(response.data.data || []);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setError(
        err.response?.data?.message ||
          'Failed to load products. Make sure backend server is running.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Client-side filtering by search query & sorting
  const filteredProducts = products
    .filter((product) =>
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  return (
    <div className="container">
      {/* Hero Banner */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-pill">
            <Sparkles size={15} />
            <span>Summer Collection 2026</span>
          </div>
          <h1 className="hero-title">
            Discover Premium Gear at <span>ShopEase</span>
          </h1>
          <p className="hero-desc">
            Explore our curated catalog of premium apparel, shoes, and luxury accessories.
            Fast shipping, verified reviews, and instant Razorpay checkout.
          </p>
          <a href="#catalog" className="btn btn-primary btn-lg">
            Shop Catalog
          </a>
        </div>
      </section>

      {/* Catalog & Filter Section */}
      <div id="catalog">
        <div className="controls-bar">
          {/* Search Input */}
          <div className="search-box">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              className="search-input"
              placeholder="Search products by title or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Category Tabs */}
          <div className="category-pills">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`category-pill ${
                  selectedCategory === cat ? 'active' : ''
                }`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={16} color="var(--text-secondary)" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="form-input"
              style={{ width: 'auto', padding: '0.55rem 0.85rem' }}
            >
              <option value="default">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Status Messages */}
        <ErrorMessage message={error} type="danger" />

        {/* Product Grid */}
        {loading ? (
          <Loader text="Fetching latest products from store..." />
        ) : filteredProducts.length > 0 ? (
          <div className="product-grid">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <PackageX className="empty-state-icon" />
            <h3>No products found</h3>
            <p>
              We couldn't find any products matching your search or selected category.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="btn btn-secondary"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
