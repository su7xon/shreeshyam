'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import useAdminStore from '@/lib/admin-store';
import { brands, ramOptions, storageOptions, products as defaultProducts } from '@/lib/data';
import { Save, X, Plus, ArrowLeft, Trash2, Eye, Loader2, Upload } from 'lucide-react';
import { uploadToCloudinary } from '@/lib/cloudinary';

export default function AdminProductFormClient({ id }: { id: string }) {
  const router = useRouter();
  const admin = useAdminStore();
  
  const isEditing = id !== 'new';
  const existingProduct = isEditing ? admin.getProduct(id) : undefined;

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
    images: existingProduct ? (Array.isArray(existingProduct.images) && existingProduct.images.length > 0 ? existingProduct.images : [existingProduct.image]) : [] as string[],
    ram: existingProduct?.ram || ramOptions[0],
    storage: existingProduct?.storage || storageOptions[0],
    processor: existingProduct?.processor || '',
    battery: existingProduct?.battery || '',
    camera: existingProduct?.camera || '',
    display: existingProduct?.display || '',
    featured: existingProduct?.featured || false,
    description: existingProduct?.description || '',
    category: existingProduct?.category || '',
    colors: existingProduct?.colors || [] as string[],
    variants: existingProduct?.variants || [] as any[],
  });

  const [isAddingNewBrand, setIsAddingNewBrand] = useState(false);
  const [newBrandName, setNewBrandName] = useState('');
  const [newColor, setNewColor] = useState('');
  const [newImage, setNewImage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);

  // Sync form when existingProduct loads (if it was undefined initially)
  useEffect(() => {
    if (isEditing && !form.name && !admin.isLoading) {
      const p = admin.getProduct(id);
      if (p) {
        setForm({
          id: p.id,
          name: p.name,
          brand: p.brand,
          price: p.price,
          originalPrice: p.originalPrice,
          image: p.image,
          images: Array.isArray(p.images) && p.images.length > 0 ? p.images : [p.image],
          ram: p.ram,
          storage: p.storage,
          processor: p.processor,
          battery: p.battery,
          camera: p.camera,
          display: p.display,
          featured: p.featured || false,
          description: p.description,
          category: p.category || '',
          colors: p.colors || [],
          variants: p.variants || [],
        });
      }
    }
  }, [id, admin.isLoading, admin.products]);

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
    const updated = form.images.filter((_: string, i: number) => i !== index);
    updateForm('images', updated);
    if (form.image === form.images[index]) {
      updateForm('image', updated[0] || '');
    }
  };

  const uploadImages = async (files: File[]) => {
    if (files.length === 0) return;
    try {
      setIsUploading(true);
      const urls: string[] = [];
      for (const file of files) {
        const url = await uploadToCloudinary(file);
        urls.push(url);
      }
      if (urls.length > 0) {
        const updated = [...form.images, ...urls];
        updateForm('images', updated);
        if (!form.image) {
          updateForm('image', updated[0] || '');
        }
      }
    } catch (error) {
      alert('Upload failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsUploading(false);
      setIsDragActive(false);
    }
  };

  const isDesktopDrop = () => typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches;

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    if (!isDesktopDrop()) return;
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = () => {
    setIsDragActive(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    if (!isDesktopDrop()) return;
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files || []).filter((file) => file.type.startsWith('image/'));
    await uploadImages(droppedFiles);
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Product name is required';
    if (!form.image && form.images.length === 0) errs.image = 'At least one image is required';
    if (form.price <= 0) errs.price = 'Price must be greater than 0';
    if (!form.processor.trim()) errs.processor = 'Processor is required';
    if (!form.battery.trim()) errs.battery = 'Battery info is required';
    if (!form.camera.trim()) errs.camera = 'Camera info is required';
    if (!form.display.trim()) errs.display = 'Display info is required';
    if (!form.description.trim()) errs.description = 'Description is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // if variants exist, ensure the lowest price is set as base price
    let finalPrice = form.price;
    let finalOriginalPrice = form.originalPrice;
    
    if (form.variants && form.variants.length > 0) {
      // Find the cheapest variant
      const cheapest = [...form.variants].sort((a, b) => a.price - b.price)[0];
      finalPrice = cheapest.price;
      finalOriginalPrice = cheapest.originalPrice;
    }

    const selectedBrand = isAddingNewBrand ? newBrandName.trim() : form.brand;
    
    if (!selectedBrand) {
      setErrors({ brand: 'Brand is required' });
      return;
    }

    // If it's a new brand, add it to the brands collection if it doesn't exist
    if (isAddingNewBrand) {
      const brandExists = admin.brands.some(b => b.name.toLowerCase() === selectedBrand.toLowerCase());
      if (!brandExists) {
        try {
          await admin.addBrand({
            name: selectedBrand,
            logo: '',
            active: true
          });
        } catch (err) {
          console.error('Error adding brand:', err);
        }
      }
    }

    const productData = {
      ...form,
      brand: selectedBrand,
      price: finalPrice,
      originalPrice: finalOriginalPrice,
      image: form.images[0] || form.image,
    };

    try {
      setIsSaving(true);
      if (isEditing) {
        await admin.updateProduct(id, productData);
      } else {
        await admin.addProduct(productData);
      }

      setSaved(true);
      if (!isEditing) {
        setTimeout(() => {
          // Use window.location for static export compatibility
          if (typeof window !== 'undefined') {
            window.location.href = '/admin/products';
          } else {
            router.push('/admin/products');
          }
        }, 1000);
      }
    } catch (error) {
      console.error('Failed to save product:', error);
      alert('Failed to save product. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/products" className="p-2 rounded-lg hover:bg-[#1f2937] transition-colors">
            <ArrowLeft className="h-5 w-5 text-gray-400" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-white">
              {isEditing ? 'Edit Product' : 'Add New Phone'}
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              {isEditing ? `Editing: ${form.name}` : 'Create a new product listing'}
            </p>
          </div>
        </div>
        {saved && (
          <span className="text-emerald-400 font-medium text-sm bg-emerald-900/30 border border-emerald-800 px-4 py-2 rounded-lg">
            ✓ Saved successfully!
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="admin-card p-6">
          <h3 className="text-lg font-bold text-white mb-5">Basic Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">Product Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => updateForm('name', e.target.value)}
                placeholder="e.g., iPhone 15 Pro Max"
                className={`w-full px-4 py-2.5 border rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#b78b57]/50 ${errors.name ? 'border-red-500 bg-red-900/20' : 'border-[#374151] bg-[#1f2937]'}`}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-300">Brand *</label>
                <button 
                  type="button" 
                  onClick={() => setIsAddingNewBrand(!isAddingNewBrand)}
                  className="text-[11px] text-[#b78b57] hover:underline"
                >
                  {isAddingNewBrand ? 'Select Existing' : '+ Add New Brand'}
                </button>
              </div>
              {isAddingNewBrand ? (
                <input
                  type="text"
                  value={newBrandName}
                  onChange={(e) => setNewBrandName(e.target.value)}
                  placeholder="Enter new brand name"
                  className="w-full px-4 py-2.5 border border-[#374151] rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#b78b57]/50 bg-[#1f2937]"
                  autoFocus
                />
              ) : (
                <select
                  value={form.brand}
                  onChange={(e) => updateForm('brand', e.target.value)}
                  className="w-full px-4 py-2.5 border border-[#374151] rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#b78b57]/50 bg-[#1f2937]"
                >
                  {availableBrands.map((brand) => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
              <select
                value={form.category}
                onChange={(e) => updateForm('category', e.target.value)}
                className="w-full px-4 py-2.5 border border-[#374151] rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#b78b57]/50 bg-[#1f2937]"
              >
                <option value="">No Category</option>
                {admin.categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Featured</label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => updateForm('featured', e.target.checked)}
                  className="h-5 w-5 rounded border-[#374151] bg-[#1f2937] text-[#b78b57] focus:ring-[#b78b57]"
                />
                <span className="text-sm text-gray-400">Show on homepage featured section</span>
              </label>
            </div>
          </div>
        </div>

        <div className="admin-card p-6">
          <h3 className="text-lg font-bold text-white mb-5">Pricing</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Selling Price (₹) *</label>
              <input
                type="number"
                value={form.price || ''}
                onChange={(e) => updateForm('price', Number(e.target.value))}
                placeholder="e.g., 79900"
                className={`w-full px-4 py-2.5 border rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#b78b57]/50 ${errors.price ? 'border-red-500 bg-red-900/20' : 'border-[#374151] bg-[#1f2937]'}`}
              />
              {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Original Price (₹)</label>
              <input
                type="number"
                value={form.originalPrice || ''}
                onChange={(e) => updateForm('originalPrice', e.target.value ? Number(e.target.value) : undefined)}
                placeholder="e.g., 89900 (optional)"
                className="w-full px-4 py-2.5 border border-[#374151] rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#b78b57]/50 bg-[#1f2937]"
              />
            </div>
          </div>
        </div>

        <div className="admin-card p-6">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-lg font-bold text-white">Variants (RAM / Storage)</h3>
            <button
              type="button"
              onClick={() => {
                const newVariant = {
                  id: `v-${Date.now()}`,
                  ram: '',
                  storage: '',
                  price: form.price || 0,
                  originalPrice: form.originalPrice,
                };
                updateForm('variants', [...form.variants, newVariant]);
              }}
              className="px-3 py-1.5 bg-[#1f2937] border border-[#374151] text-sm text-[#b78b57] font-medium rounded-lg hover:bg-[#374151] transition-colors flex items-center"
            >
              <Plus className="h-4 w-4 mr-1" /> Add Variant
            </button>
          </div>
          
          {form.variants && form.variants.length > 0 ? (
            <div className="space-y-4 mb-8">
              <datalist id="variant-ram-options">
                {ramOptions.map((r) => (
                  <option key={r} value={r} />
                ))}
              </datalist>
              <datalist id="variant-storage-options">
                {storageOptions.map((s) => (
                  <option key={s} value={s} />
                ))}
              </datalist>
              {form.variants.map((variant, index) => (
                <div key={variant.id} className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-4 bg-[#1f2937] border border-[#374151] rounded-xl relative group">
                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...form.variants];
                      updated.splice(index, 1);
                      updateForm('variants', updated);
                    }}
                    className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600 z-10"
                  >
                    <X className="h-3 w-3" />
                  </button>
                  
                  <div className="sm:col-span-1">
                    <label className="block text-xs font-medium text-gray-400 mb-1">RAM</label>
                    <input
                      type="text"
                      value={variant.ram || ''}
                      onChange={(e) => {
                        const updated = [...form.variants];
                        updated[index].ram = e.target.value;
                        updateForm('variants', updated);
                      }}
                      placeholder="e.g., 8GB"
                      list="variant-ram-options"
                      className="w-full px-3 py-2 border border-[#374151] rounded-lg text-sm text-white bg-[#111827] focus:outline-none focus:ring-1 focus:ring-[#b78b57]"
                    />
                  </div>
                  
                  <div className="sm:col-span-1">
                    <label className="block text-xs font-medium text-gray-400 mb-1">Storage</label>
                    <input
                      type="text"
                      value={variant.storage || ''}
                      onChange={(e) => {
                        const updated = [...form.variants];
                        updated[index].storage = e.target.value;
                        updateForm('variants', updated);
                      }}
                      placeholder="e.g., 256GB"
                      list="variant-storage-options"
                      className="w-full px-3 py-2 border border-[#374151] rounded-lg text-sm text-white bg-[#111827] focus:outline-none focus:ring-1 focus:ring-[#b78b57]"
                    />
                  </div>

                  <div className="sm:col-span-1">
                    <label className="block text-xs font-medium text-gray-400 mb-1">Price (₹)</label>
                    <input
                      type="number"
                      value={variant.price || ''}
                      onChange={(e) => {
                        const updated = [...form.variants];
                        updated[index].price = Number(e.target.value);
                        updateForm('variants', updated);
                      }}
                      className="w-full px-3 py-2 border border-[#374151] rounded-lg text-sm text-white bg-[#111827] focus:outline-none focus:ring-1 focus:ring-[#b78b57]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-gray-400 mb-1">Original Price (₹)</label>
                    <input
                      type="number"
                      value={variant.originalPrice || ''}
                      onChange={(e) => {
                        const updated = [...form.variants];
                        updated[index].originalPrice = e.target.value ? Number(e.target.value) : undefined;
                        updateForm('variants', updated);
                      }}
                      className="w-full px-3 py-2 border border-[#374151] rounded-lg text-sm text-white bg-[#111827] focus:outline-none focus:ring-1 focus:ring-[#b78b57]"
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 italic mb-8">No variants added. Using base pricing and specs.</p>
          )}
        </div>

        <div className="admin-card p-6">
          <h3 className="text-lg font-bold text-white mb-5">Product Images</h3>
          <p className="hidden lg:block text-xs text-gray-500 mb-3">Tip: Drag & drop images here to upload.</p>
          <div
            className={`flex flex-wrap gap-2 mb-4 rounded-2xl ${isDragActive ? 'ring-2 ring-[#b78b57] bg-[#111827]/70' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="text"
              value={newImage}
              onChange={(e) => setNewImage(e.target.value)}
              placeholder="Paste image URL or upload..."
              className="flex-1 min-w-[200px] px-4 py-2.5 border border-[#374151] rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#b78b57]/50 bg-[#1f2937]"
            />
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                disabled={isUploading}
                multiple
                onChange={async (e) => {
                  const files = Array.from(e.target.files || []);
                  await uploadImages(files);
                  e.target.value = '';
                }}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <button 
                type="button" 
                disabled={isUploading}
                className="px-4 py-2.5 bg-[#1f2937] border border-[#374151] text-gray-300 font-medium rounded-xl hover:bg-[#374151] disabled:opacity-50 transition-colors flex items-center justify-center h-full whitespace-nowrap"
              >
                {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Upload className="h-4 w-4 mr-1.5" /> Upload</>}
              </button>
            </div>
            <button
              type="button"
              onClick={addImage}
              disabled={!newImage.trim()}
              className="px-4 py-2.5 bg-[#b78b57] text-white rounded-xl hover:bg-[#d4a76a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center whitespace-nowrap"
            >
              <Plus className="h-4 w-4 mr-1.5" /> Add
            </button>
          </div>

          {form.images.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3">
              {form.images.map((img: string, index: number) => (
                <div key={index} className={`relative group rounded-lg overflow-hidden border-2 ${form.image === img ? 'border-[#b78b57]' : 'border-[#374151]'}`}>
                  <div className="aspect-square bg-[#1f2937] relative">
                    <img src={img} alt="" className="h-full w-full object-contain p-2" referrerPolicy="no-referrer" />
                    {form.image === img && <div className="absolute top-1 left-1 bg-[#b78b57] text-white text-[9px] font-bold px-2 py-0.5 rounded-full">Primary</div>}
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex gap-1">
                      <button type="button" onClick={() => updateForm('image', img)} className="p-1.5 bg-white rounded-lg hover:bg-gray-100"><Eye className="h-4 w-4 text-gray-600" /></button>
                      <button type="button" onClick={() => removeImage(index)} className="p-1.5 bg-white rounded-lg hover:bg-red-50"><Trash2 className="h-4 w-4 text-red-600" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {errors.image && <p className="text-red-500 text-xs mt-2">{errors.image}</p>}
        </div>

        <div className="admin-card p-6">
          <h3 className="text-lg font-bold text-white mb-5">Specifications</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Processor *</label>
              <input type="text" value={form.processor} onChange={(e) => updateForm('processor', e.target.value)} className={`w-full px-4 py-2.5 border rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#b78b57]/50 ${errors.processor ? 'border-red-500 bg-red-900/20' : 'border-[#374151] bg-[#1f2937]'}`} />
              {errors.processor && <p className="text-red-500 text-xs mt-1">{errors.processor}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Battery *</label>
              <input type="text" value={form.battery} onChange={(e) => updateForm('battery', e.target.value)} className={`w-full px-4 py-2.5 border rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#b78b57]/50 ${errors.battery ? 'border-red-500 bg-red-900/20' : 'border-[#374151] bg-[#1f2937]'}`} />
              {errors.battery && <p className="text-red-500 text-xs mt-1">{errors.battery}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Camera *</label>
              <input type="text" value={form.camera} onChange={(e) => updateForm('camera', e.target.value)} className={`w-full px-4 py-2.5 border rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#b78b57]/50 ${errors.camera ? 'border-red-500 bg-red-900/20' : 'border-[#374151] bg-[#1f2937]'}`} />
              {errors.camera && <p className="text-red-500 text-xs mt-1">{errors.camera}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Display *</label>
              <input type="text" value={form.display} onChange={(e) => updateForm('display', e.target.value)} className={`w-full px-4 py-2.5 border rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#b78b57]/50 ${errors.display ? 'border-red-500 bg-red-900/20' : 'border-[#374151] bg-[#1f2937]'}`} />
              {errors.display && <p className="text-red-500 text-xs mt-1">{errors.display}</p>}
            </div>
          </div>
        </div>

        <div className="admin-card p-6">
          <h3 className="text-lg font-bold text-white mb-5">Description</h3>
          <textarea
            value={form.description}
            onChange={(e) => updateForm('description', e.target.value)}
            rows={4}
            className={`w-full px-4 py-3 border rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#b78b57]/50 resize-none ${errors.description ? 'border-red-500 bg-red-900/20' : 'border-[#374151] bg-[#1f2937]'}`}
          />
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
        </div>

        <div className="flex items-center justify-end gap-4">
          <Link href="/admin/products" className="px-6 py-2.5 border border-[#374151] text-gray-300 font-medium rounded-xl hover:bg-[#1f2937] transition-colors">Cancel</Link>
          <button
            type="submit"
            disabled={isUploading || isSaving}
            className="inline-flex items-center gap-2 px-8 py-2.5 bg-gradient-to-r from-[#b78b57] to-[#d4a76a] text-white font-semibold rounded-xl hover:shadow-lg disabled:opacity-50 transition-all"
          >
            {isUploading || isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
            {isSaving ? 'Saving...' : (isEditing ? 'Update Product' : 'Create Product')}
          </button>
        </div>
      </form>
    </div>
  );
}
