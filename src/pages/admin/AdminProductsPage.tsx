import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  CheckCircle2,
  XCircle,
  X,
  PlusCircle,
  Eye,
} from 'lucide-react';
import { DataService } from '@/services/dataService';
import { Product, Category, AvailabilityStatus } from '@/types';
import { formatINR } from '@/config/business';

export const AdminProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    brand: '',
    category_id: '',
    description: '',
    size: '',
    unit: 'piece',
    pack_details: '',
    price: '' as string | number,
    is_price_visible: false,
    availability_status: 'in_stock' as AvailabilityStatus,
    image_urls: '' as string, // newline or comma separated
    keywords: '' as string,
    is_featured: false,
    is_active: true,
  });

  // Specifications key-value pairs
  const [specList, setSpecList] = useState<Array<{ key: string; val: string }>>([]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [prodRes, catList] = await Promise.all([
        DataService.getProducts({ limit: 1000 }),
        DataService.getCategories(true),
      ]);
      setProducts(prodRes.data);
      setCategories(catList);
    } catch (err) {
      console.error('Failed to load products', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      slug: '',
      brand: '',
      category_id: categories[0]?.id || '',
      description: '',
      size: '',
      unit: 'piece',
      pack_details: '',
      price: '',
      is_price_visible: false,
      availability_status: 'in_stock',
      image_urls: '',
      keywords: '',
      is_featured: false,
      is_active: true,
    });
    setSpecList([{ key: '', val: '' }]);
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      slug: p.slug,
      brand: p.brand,
      category_id: p.category_id,
      description: p.description,
      size: p.size,
      unit: p.unit,
      pack_details: p.pack_details,
      price: p.price !== null ? p.price : '',
      is_price_visible: p.is_price_visible,
      availability_status: p.availability_status,
      image_urls: p.image_urls.join('\n'),
      keywords: p.keywords.join(', '),
      is_featured: p.is_featured,
      is_active: p.is_active,
    });

    const specs = Object.entries(p.specifications || {}).map(([key, val]) => ({
      key,
      val: String(val),
    }));
    setSpecList(specs.length > 0 ? specs : [{ key: '', val: '' }]);
    setIsModalOpen(true);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    // Auto-generate slug if creating new product
    if (!editingProduct) {
      const generatedSlug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      setFormData((prev) => ({ ...prev, name, slug: generatedSlug }));
    } else {
      setFormData((prev) => ({ ...prev, name }));
    }
  };

  const handleSpecChange = (index: number, field: 'key' | 'val', value: string) => {
    setSpecList((prev) => {
      const updated = [...prev];
      if (updated[index]) {
        updated[index] = { ...updated[index], [field]: value };
      }
      return updated;
    });
  };

  const addSpecRow = () => {
    setSpecList((prev) => [...prev, { key: '', val: '' }]);
  };

  const removeSpecRow = (index: number) => {
    setSpecList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Build specs object
    const specifications: Record<string, string> = {};
    specList.forEach(({ key, val }) => {
      if (key.trim() && val.trim()) {
        specifications[key.trim()] = val.trim();
      }
    });

    // Parse image URLs
    const image_urls = formData.image_urls
      .split(/[\n,]/)
      .map((u) => u.trim())
      .filter(Boolean);

    // Parse keywords
    const keywords = formData.keywords
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean);

    const priceNum =
      formData.price !== '' && !isNaN(Number(formData.price))
        ? Number(formData.price)
        : null;

    try {
      if (editingProduct) {
        await DataService.adminUpdateProduct(editingProduct.id, {
          name: formData.name,
          slug: formData.slug,
          brand: formData.brand,
          category_id: formData.category_id,
          description: formData.description,
          size: formData.size,
          unit: formData.unit,
          pack_details: formData.pack_details,
          price: priceNum,
          is_price_visible: formData.is_price_visible,
          availability_status: formData.availability_status,
          image_urls: image_urls.length > 0 ? image_urls : ['https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=800&auto=format&fit=crop&q=80'],
          keywords,
          specifications,
          is_featured: formData.is_featured,
          is_active: formData.is_active,
        });
      } else {
        await DataService.adminCreateProduct({
          name: formData.name,
          slug: formData.slug || `item-${Date.now()}`,
          brand: formData.brand,
          category_id: formData.category_id,
          description: formData.description,
          size: formData.size,
          unit: formData.unit,
          pack_details: formData.pack_details,
          price: priceNum,
          is_price_visible: formData.is_price_visible,
          availability_status: formData.availability_status,
          image_urls: image_urls.length > 0 ? image_urls : ['https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=800&auto=format&fit=crop&q=80'],
          keywords,
          specifications,
          is_featured: formData.is_featured,
          is_active: formData.is_active,
        });
      }

      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      alert(`Error saving product: ${err?.message || 'Operation failed'}`);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete product "${name}"?`)) {
      try {
        await DataService.adminDeleteProduct(id);
        loadData();
      } catch (err: any) {
        alert(`Error deleting product: ${err?.message}`);
      }
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      !selectedCategory || p.category_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950 tracking-tight">
            Product Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Create, update specifications, manage verified prices, and control stock status
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center px-4 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Add Product
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="flex-1 w-full relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, brand, or slug..."
            className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full sm:w-56 bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-brand-500"
        >
          <option value="">All Categories ({categories.length})</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading catalog...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            No products found matching filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-5 py-3">Product</th>
                  <th className="px-5 py-3">Brand</th>
                  <th className="px-5 py-3">Category</th>
                  <th className="px-5 py-3">Price / Rate</th>
                  <th className="px-5 py-3">Availability</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((product) => {
                  const cat = categories.find((c) => c.id === product.category_id);
                  return (
                    <tr key={product.id} className="hover:bg-slate-50/50">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center space-x-3">
                          <img
                            src={product.image_urls[0] || 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=800&auto=format&fit=crop&q=80'}
                            alt=""
                            className="w-9 h-9 rounded-md object-cover bg-slate-100 shrink-0 border border-slate-200"
                          />
                          <div>
                            <span className="font-semibold text-slate-900 block line-clamp-1">
                              {product.name}
                            </span>
                            <span className="text-[11px] text-slate-400 font-mono">
                              /{product.slug}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 font-medium text-slate-700">
                        {product.brand}
                      </td>
                      <td className="px-5 py-3.5 text-slate-600">
                        {cat?.name || '—'}
                      </td>
                      <td className="px-5 py-3.5">
                        {product.is_price_visible && product.price !== null ? (
                          <span className="font-bold text-slate-900">
                            {formatINR(product.price)}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">Contact for Price</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            product.availability_status === 'in_stock'
                              ? 'bg-emerald-100 text-emerald-800'
                              : product.availability_status === 'out_of_stock'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {product.availability_status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        {product.is_active ? (
                          <span className="inline-flex items-center text-emerald-700 font-medium text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-slate-400 font-medium text-[11px]">
                            <XCircle className="w-3.5 h-3.5 mr-1" />
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-right space-x-2 whitespace-nowrap">
                        <Link
                          to={`/products/${product.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center p-1.5 rounded text-slate-400 hover:text-brand-600 hover:bg-slate-100"
                          title="Preview public page"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => openEditModal(product)}
                          className="p-1.5 rounded text-slate-400 hover:text-blue-600 hover:bg-slate-100"
                          title="Edit product"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(product.id, product.name)}
                          className="p-1.5 rounded text-slate-400 hover:text-red-600 hover:bg-slate-100"
                          title="Delete product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Product Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-navy-950">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <p className="text-xs text-slate-500">
                  Enter accurate specifications and pricing details.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleNameChange}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-brand-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Brand *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="e.g. Bosch, Finolex, Ashirvad..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Category *
                  </label>
                  <select
                    required
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-brand-500"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Product Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-brand-500"
                />
              </div>

              {/* Pricing, Availability & Visibility */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Verified Price (INR ₹)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="Leave empty for 'Contact for Price'"
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Price Visibility
                  </label>
                  <label className="flex items-center space-x-2 mt-2">
                    <input
                      type="checkbox"
                      checked={formData.is_price_visible}
                      onChange={(e) => setFormData({ ...formData, is_price_visible: e.target.checked })}
                      className="rounded text-brand-600 focus:ring-brand-500 h-4 w-4"
                    />
                    <span className="text-xs text-slate-700">Display public rate</span>
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Availability Status
                  </label>
                  <select
                    value={formData.availability_status}
                    onChange={(e) =>
                      setFormData({ ...formData, availability_status: e.target.value as AvailabilityStatus })
                    }
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs"
                  >
                    <option value="in_stock">In Stock</option>
                    <option value="available_to_order">Available to Order</option>
                    <option value="on_order">On Order</option>
                    <option value="out_of_stock">Out of Stock</option>
                  </select>
                </div>
              </div>

              {/* Size, Unit, Pack Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Size / Dimensions
                  </label>
                  <input
                    type="text"
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                    placeholder="e.g. 2.5 sq mm / 100mm"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Unit
                  </label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    placeholder="piece / coil / length / box"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Pack Details
                  </label>
                  <input
                    type="text"
                    value={formData.pack_details}
                    onChange={(e) => setFormData({ ...formData, pack_details: e.target.value })}
                    placeholder="Box of 10 / 90m coil"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs"
                  />
                </div>
              </div>

              {/* Key-Value Specifications Editor */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide">
                    Specifications (Technical Parameters)
                  </label>
                  <button
                    type="button"
                    onClick={addSpecRow}
                    className="text-xs text-brand-600 font-semibold hover:underline flex items-center"
                  >
                    <PlusCircle className="w-3.5 h-3.5 mr-1" />
                    Add Parameter
                  </button>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {specList.map((spec, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={spec.key}
                        onChange={(e) => handleSpecChange(i, 'key', e.target.value)}
                        placeholder="Parameter (e.g. Voltage, Power, Grade)"
                        className="flex-1 bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs"
                      />
                      <input
                        type="text"
                        value={spec.val}
                        onChange={(e) => handleSpecChange(i, 'val', e.target.value)}
                        placeholder="Value (e.g. 1100V, 670W, SS 304)"
                        className="flex-1 bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => removeSpecRow(i)}
                        className="p-1 text-slate-400 hover:text-red-500"
                        title="Remove row"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Image URLs & Keywords */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Image URLs (One per line)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.image_urls}
                    onChange={(e) => setFormData({ ...formData, image_urls: e.target.value })}
                    placeholder="https://..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Search Keywords (Comma-separated)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.keywords}
                    onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                    placeholder="cables, copper, wiring, 2.5mm"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="flex items-center space-x-6 pt-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="rounded text-brand-600 focus:ring-brand-500 h-4 w-4"
                  />
                  <span className="text-xs font-medium text-slate-700">Featured on Homepage</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="rounded text-brand-600 focus:ring-brand-500 h-4 w-4"
                  />
                  <span className="text-xs font-medium text-slate-700">Active (Publicly Visible)</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-xs"
                >
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
