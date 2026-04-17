'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import useAdminStore from '@/lib/admin-store';
import { brands, ramOptions, storageOptions } from '@/lib/data';
import { Save, X, Plus, ArrowLeft, Trash2, Eye, Loader2, Upload } from 'lucide-react';
import { uploadToCloudinary } from '@/lib/cloudinary';

export default function AdminProductFormPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const admin = useAdminStore();
  const existingProduct = id !== 'new' ? admin.getProduct(id) : undefined;
  const isEditing = !!existingProduct;

  const adminBrandNames = admin.brands.filter(b => b.active).map(b => b.name);
  const availableBrands = [...new Set([...adminBrandNames, ...(existingProduct ? [existingProduct.brand] : [])])];
  if (availableBrands.length === 0) availableBrands.push(brands[0]);

  const [form, setForm] = useState({
    id: existingProduct?.id || `product-${Date.now()}`,
    name: existingProduct?.name || '',
    brand: existingProduct?.brand || availableBrands[0],
    price: existingProduct?.price || 0,
    originalPrice: existingProduct?.originalPrice || undefined as number | undefined,
    image: existingProduct?.image || '',
    images: existingProduct ? [existingProduct.image] : [] as string[],
    ram: existingProduct?.ram || ramOptions[0],
    storage: existingProduct?.storage || storageOptions[0],
    processor: existingProduct?.processor || '',
    battery: existingProduct?.battery || '',
    camera: existingProduct?.camera || '',
    display: existingProduct?.display || '',
    featured: existingProduct?.featured || false,
    description: existingProduct?.description || '',
    colors: existingProduct?.colors || [] as string[],
  });

  const [newColor, setNewColor] = useState('');
  const [newImage, setNewImage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const updateForm = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const addColor = () => {
    if (newColor.trim() && !form.colors.includes(newColor.trim())) {
      updateForm('colors', [...form.colors, newColor.trim()]);
      setNewColor('');
    }
  };

  const removeColor = (color: string) => {
    updateForm('colors', form.colors.filter((c) => c !== color));
  };

  const addImage = () => {
    if (newImage.trim() && !form.images.includes(newImage.trim())) {
      const updated = [...form.images, newImage.trim()];
      updateForm('images', updated);
      if (!form.image) {
        updateForm('image', newImage.trim());
      }
      setNewImage('');
    }
  };

  const removeImage = (index: number) => {
    const updated = form.images.filter((_, i) => i !== index);
    updateForm('images', updated);
    if (form.image === form.images[index]) {
      updateForm('image', updated[0] || '');
    }
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Product name is required';
    if (!form.image.trim()) errs.image = 'At least one image URL is required';
    if (form.price <= 0) errs.price = 'Price must be greater than 0';
    if (!form.processor.trim()) errs.processor = 'Processor is required';
    if (!form.battery.trim()) errs.battery = 'Battery info is required';
    if (!form.camera.trim()) errs.camera = 'Camera info is required';
    if (!form.display.trim()) errs.display = 'Display info is required';
    if (!form.description.trim()) errs.description = 'Description is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const productData = {
      ...form,
      image: form.images[0] || form.image,
    };

    if (isEditing) {
      admin.updateProduct(id, productData);
    } else {
      admin.addProduct(productData);
    }

    setSaved(true);
    setTimeout(() => {
      router.push('/admin/products');
    }, 800);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/products" className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <ArrowLeft className="h-5 w-5 text-gray-500" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-[#1a1a2e]">
              {isEditing ? 'Edit Product' : 'Add New Phone'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {isEditing ? `Editing: ${existingProduct?.name}` : 'Create a new product listing'}
            </p>
          </div>
        </div>
        {saved && (
          <span className="text-emerald-600 font-medium text-sm bg-emerald-50 px-4 py-2 rounded-lg">
            ✓ Saved successfully!
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-bold text-[#1a1a2e] mb-5">Basic Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => updateForm('name', e.target.value)}
                placeholder="e.g., iPhone 15 Pro Max"
                className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#b78b57]/50 ${errors.name ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'}`}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Brand *</label>
              <select
                value={form.brand}
                onChange={(e) => updateForm('brand', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#b78b57]/50 bg-gray-50"
              >
                {availableBrands.map((brand) => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Featured</label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => updateForm('featured', e.target.checked)}
                  className="h-5 w-5 rounded text-[#b78b57] focus:ring-[#b78b57]"
                />
                <span className="text-sm text-gray-600">Show on homepage featured section</span>
              </label>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-bold text-[#1a1a2e] mb-5">Pricing</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Selling Price (₹) *</label>
              <input
                type="number"
                value={form.price || ''}
                onChange={(e) => updateForm('price', Number(e.target.value))}
                placeholder="e.g., 79900"
                className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#b78b57]/50 ${errors.price ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'}`}
              />
              {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Original Price (₹)</label>
              <input
                type="number"
                value={form.originalPrice || ''}
                onChange={(e) => updateForm('originalPrice', e.target.value ? Number(e.target.value) : undefined)}
                placeholder="e.g., 89900 (optional)"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#b78b57]/50 bg-gray-50"
              />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-bold text-[#1a1a2e] mb-5">Product Images</h3>

          {/* Image URL input */}
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newImage}
              onChange={(e) => setNewImage(e.target.value)}
              placeholder="Paste image URL..."
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#b78b57]/50 bg-gray-50"
            />
            <div className="relative overflow-hidden shrink-0">
              <input 
                type="file" 
                accept="image/*" 
                disabled={isUploading}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    try {
                      setIsUploading(true);
                      const url = await uploadToCloudinary(file);
                      setNewImage(url);
                    } catch (error) {
                      alert('Upload failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
                    } finally {
                      setIsUploading(false);
                    }
                  }
                }} 
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" 
              />
              <button 
                type="button" 
                disabled={isUploading}
                className="px-4 py-2.5 bg-gray-100 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-200 disabled:opacity-50 transition-colors flex items-center justify-center h-full min-w-[120px]"
              >
                {isUploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Upload className="h-4 w-4 mr-2" /> Upload File</>}
              </button>
            </div>
            <button
              type="button"
              onClick={addImage}
              className="px-4 py-2.5 bg-[#b78b57] text-white rounded-xl hover:bg-[#d4a76a] transition-colors"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>

          {/* Image grid */}
          {form.images.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3">
              {form.images.map((img, index) => (
                <div key={index} className={`relative group rounded-lg overflow-hidden border-2 ${form.image === img ? 'border-[#b78b57]' : 'border-gray-200'}`}>
                  <div className="aspect-square bg-gray-100 relative">
                    {/* @ts-ignore */}
                    <img
                      src={img}
                      alt={`Product ${index + 1}`}
                      className="h-full w-full object-contain p-2"
                      referrerPolicy="no-referrer"
                    />
                    {form.image === img && (
                      <div className="absolute top-1 left-1 bg-[#b78b57] text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                        Primary
                      </div>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => updateForm('image', img)}
                        className="p-1.5 bg-white rounded-lg hover:bg-gray-100"
                        title="Set as primary"
                      >
                        <Eye className="h-4 w-4 text-gray-600" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="p-1.5 bg-white rounded-lg hover:bg-red-50"
                        title="Remove"
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {errors.image && <p className="text-red-500 text-xs mt-2">{errors.image}</p>}
        </div>

        {/* Specifications */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-bold text-[#1a1a2e] mb-5">Specifications</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Processor *</label>
              <input
                type="text"
                value={form.processor}
                onChange={(e) => updateForm('processor', e.target.value)}
                placeholder="e.g., Snapdragon 8 Gen 3"
                className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#b78b57]/50 ${errors.processor ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'}`}
              />
              {errors.processor && <p className="text-red-500 text-xs mt-1">{errors.processor}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Battery *</label>
              <input
                type="text"
                value={form.battery}
                onChange={(e) => updateForm('battery', e.target.value)}
                placeholder="e.g., 5000 mAh"
                className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#b78b57]/50 ${errors.battery ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'}`}
              />
              {errors.battery && <p className="text-red-500 text-xs mt-1">{errors.battery}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Camera *</label>
              <input
                type="text"
                value={form.camera}
                onChange={(e) => updateForm('camera', e.target.value)}
                placeholder="e.g., 50MP + 12MP + 12MP"
                className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#b78b57]/50 ${errors.camera ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'}`}
              />
              {errors.camera && <p className="text-red-500 text-xs mt-1">{errors.camera}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Display *</label>
              <input
                type="text"
                value={form.display}
                onChange={(e) => updateForm('display', e.target.value)}
                placeholder="e.g., 6.7 inch Super Retina XDR OLED"
                className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#b78b57]/50 ${errors.display ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'}`}
              />
              {errors.display && <p className="text-red-500 text-xs mt-1">{errors.display}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">RAM</label>
              <select
                value={form.ram}
                onChange={(e) => updateForm('ram', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#b78b57]/50 bg-gray-50"
              >
                {ramOptions.map((ram) => (
                  <option key={ram} value={ram}>{ram}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Storage</label>
              <select
                value={form.storage}
                onChange={(e) => updateForm('storage', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#b78b57]/50 bg-gray-50"
              >
                {storageOptions.map((storage) => (
                  <option key={storage} value={storage}>{storage}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Colors */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-bold text-[#1a1a2e] mb-5">Available Colors</h3>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addColor();
                }
              }}
              placeholder="Enter color name..."
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#b78b57]/50 bg-gray-50"
            />
            <button
              type="button"
              onClick={addColor}
              className="px-4 py-2.5 bg-[#b78b57] text-white rounded-xl hover:bg-[#d4a76a] transition-colors"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
          {form.colors.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {form.colors.map((color) => (
                <span
                  key={color}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm"
                >
                  {color}
                  <button type="button" onClick={() => removeColor(color)} className="hover:text-red-600">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Description */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-bold text-[#1a1a2e] mb-5">Description</h3>
          <textarea
            value={form.description}
            onChange={(e) => updateForm('description', e.target.value)}
            placeholder="Write a compelling product description..."
            rows={4}
            className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#b78b57]/50 resize-none ${errors.description ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'}`}
          />
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-4">
          <Link
            href="/admin/products"
            className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isUploading}
            className="inline-flex items-center gap-2 px-8 py-2.5 bg-gradient-to-r from-[#b78b57] to-[#d4a76a] text-white font-semibold rounded-xl hover:shadow-lg disabled:opacity-50 transition-all"
          >
            {isUploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
            {isEditing ? 'Update Product' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );

