'use client';

import { useState } from 'react';
import useAdminStore from '@/lib/admin-store';
import { productsData } from '@/products-data';
import { Upload, Check, X, AlertCircle, Trash2, RefreshCw, FileText } from 'lucide-react';

export default function ImportProductsPage() {
  const admin = useAdminStore();
  const [imported, setImported] = useState<string[]>([]);
  const [duplicates, setDuplicates] = useState<string[]>([]);
  const [importing, setImporting] = useState(false);
  const [updated, setUpdated] = useState(0);

  const generatePlaceholder = (text: string) => 
    `https://placehold.co/400x400/1a1a2e/FFF?text=${encodeURIComponent(text.substring(0, 15))}`;

  const getPlaceholderImage = (name: string) => {
    const brandMatch = name.match(/^(OPPO|Realme|Samsung|Vivo|Tecno|Infinix|iQOO|Itel|Lava|Motorola|Nokia|HMD|Philips|POCO|Xiaomi)/);
    const brand = brandMatch ? brandMatch[0] : name.split(' ')[0];
    const model = name.split(' ').slice(1).join(' ').substring(0, 10);
    return generatePlaceholder(`${brand} ${model}`);
  };

  const getProductSpecs = (name: string, brand: string) => {
    const specs: Record<string, { processor: string; battery: string; camera: string; display: string; description: string }> = {
      'OPPO': {
        processor: 'MediaTek Dimensity 6300, Octa-core 2.4GHz',
        battery: '5000mAh with 15W fast charging',
        camera: '50MP AI Rear + 8MP Front, Night Mode',
        display: '6.67 inch HD+ 90Hz AMOLED',
        description: 'OPPO A6 5G features a powerful MediaTek processor, stunning 90Hz display, and AI-enhanced camera for perfect shots. With 5000mAh battery, stay connected all day long.'
      },
      'Realme': {
        processor: 'MediaTek Dimensity 7025, Octa-core 2.5GHz',
        battery: '5000mAh with 45W SUPERVOOC charging',
        camera: '50MP Sony IMX890 + 8MP Ultra-wide',
        display: '6.72 inch FHD+ 120Hz AMOLED',
        description: 'Realme 15 5G comes with blazing fast 120Hz display, powerful gaming processor, and 45W charging. Capture stunning photos with Sony camera sensor.'
      },
      'Samsung': {
        processor: 'Exynos 1330 / Snapdragon 750G, Octa-core',
        battery: '5000mAh with 25W fast charging',
        camera: '50MP OIS Main + 8MP Ultra-wide + 5MP Macro',
        display: '6.7 inch FHD+ 120Hz sAMOLED',
        description: 'Samsung Galaxy A16 5G features Samsung\'s signature Super AMOLED display with 120Hz refresh rate. IP67 water resistant, Knox security, and 4 generations of OS updates.'
      },
      'Vivo': {
        processor: 'MediaTek Dimensity 7200, Octa-core 2.8GHz',
        battery: '5000mAh with 44W FlashCharge',
        camera: '50MP Sony IMX766 + 8MP Ultra-wide',
        display: '6.78 inch 3D Curved 120Hz AMOLED',
        description: 'Vivo V30 5G features a stunning 3D curved AMOLED display, professional-grade camera with Aura light, and 44W fast charging for all-day performance.'
      },
      'Tecno': {
        processor: 'MediaTek Helio G99, Octa-core 2.2GHz',
        battery: '6000mAh with 18W fast charging',
        camera: '50MP AI Dual Camera + 8MP Front',
        display: '6.8 inch HD+ 90Hz Display',
        description: 'Tecno Spark 20 Pro features massive 6000mAh battery, 90Hz smooth display, and powerful Helio G99 processor for smooth gaming experience.'
      },
      'Infinix': {
        processor: 'MediaTek Helio G99 Ultimate, Octa-core',
        battery: '5000mAh with 33W charging',
        camera: '50MP Triple AI Camera',
        display: '6.78 inch FHD+ 120Hz AMOLED',
        description: 'Infinix Note 40 Pro features 120Hz AMOLED display, 108MP camera, and 33W fast charging. JBL stereo speakers for immersive audio.'
      },
      'iQOO': {
        processor: 'Snapdragon 7+ Gen 3, Octa-core',
        battery: '5500mAh with 120W FlashCharge',
        camera: '50MP Sony OIS + 8MP Ultra-wide',
        display: '6.78 inch 1.5K 144Hz AMOLED',
        description: 'iQOO Z10 5G features flagship-level Snapdragon processor, 120W ultra-fast charging, and 144Hz gaming display for ultimate performance.'
      },
      'Itel': {
        processor: 'Unisoc SC9832E, Quad-core',
        battery: '5000mAh',
        camera: '8MP Rear + 5MP Front',
        display: '6.6 inch HD+ IPS Display',
        description: 'Itel A70 offers great value with big display, long-lasting battery, and reliable performance for everyday use at an affordable price.'
      },
      'Lava': {
        processor: 'Unisoc SC9863A, Octa-core',
        battery: '5000mAh',
        camera: '13MP AI Camera',
        display: '6.5 inch HD+ Display',
        description: 'Lava Blaze Curve 5G features premium design, 64MP camera, and smooth 120Hz display. Made in India with quality assurance.'
      },
      'Motorola': {
        processor: 'MediaTek Dimensity 7025, Octa-core',
        battery: '5000mAh with 15W TurboPower',
        camera: '50MP Quad Pixel + 8MP Ultra-wide',
        display: '6.7 inch FHD+ 120Hz OLED',
        description: 'Motorola Edge 40 features clean Android experience, 68W fast charging, and IP68 water resistance. Stock Android with no bloatware.'
      },
      'Nokia': {
        processor: 'Unisoc T107, Octa-core',
        battery: '1450mAh',
        camera: '2MP Rear',
        display: '2.8 inch QVGA',
        description: 'Nokia 110 4G features legendary Nokia durability, FM radio, and long battery life. Perfect for basic phone needs with modern connectivity.'
      },
      'POCO': {
        processor: 'MediaTek Dimensity 7025 Ultra',
        battery: '5500mAh with 45W charging',
        camera: '50MP OIS + 8MP Ultra-wide',
        display: '6.67 inch 120Hz AMOLED',
        description: 'POCO M7 Pro 5G features powerful processor, 120Hz AMOLED display, and 50MP camera with OIS. Great performance at budget price.'
      },
      'Xiaomi': {
        processor: 'MediaTek Dimensity 7025',
        battery: '5000mAh with 33W charging',
        camera: '48MP Triple Camera',
        display: '6.67 inch 120Hz AMOLED',
        description: 'Redmi Note 15 5G features stunning 120Hz AMOLED display, powerful MediaTek processor, and 33W fast charging. MIUI 14 with custom features.'
      }
    };
    
    return specs[brand] || {
      processor: 'Octa-core processor',
      battery: '5000mAh battery',
      camera: '50MP camera',
      display: '6.5 inch display',
      description: `${name} - Latest smartphone with advanced features, powerful battery, and stunning camera.`
    };
  };

  const handleImport = () => {
    setImporting(true);
    const importedList: string[] = [];
    const duplicateList: string[] = [];

    productsData.forEach((product) => {
      const exists = admin.products.some(
        (p) => p.name === product.name && p.brand === product.brand
      );

      if (exists) {
        duplicateList.push(product.name);
      } else {
        const specs = getProductSpecs(product.name, product.brand);
        const newProduct = {
          id: `product-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          name: product.name,
          brand: product.brand,
          price: product.price,
          originalPrice: undefined as number | undefined,
          image: product.image,
          images: [product.image],
          ram: product.ram,
          storage: product.storage,
          processor: specs.processor,
          battery: specs.battery,
          camera: specs.camera,
          display: specs.display,
          featured: false,
          description: specs.description,
          colors: [],
        };
        admin.addProduct(newProduct);
        importedList.push(product.name);
      }
    });

    setImported(importedList);
    setDuplicates(duplicateList);
    setImporting(false);
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to delete ALL products? This cannot be undone.')) {
      admin.products.forEach(p => admin.deleteProduct(p.id));
      setImported([]);
      setDuplicates([]);
      setUpdated(0);
    }
  };

  const handleFixImages = () => {
    let count = 0;
    admin.products.forEach((product) => {
      if (!product.image || product.image.includes('google') || product.image.includes('amazon')) {
        const newImage = getPlaceholderImage(product.name);
        admin.updateProduct(product.id, { image: newImage });
        count++;
      }
    });
    setUpdated(count);
    setTimeout(() => window.location.reload(), 1000);
  };

  const handleFixDescriptions = () => {
    let count = 0;
    admin.products.forEach((product) => {
      const specs = getProductSpecs(product.name, product.brand);
      if (product.description.includes(product.name) && !product.description.includes('features')) {
        admin.updateProduct(product.id, {
          processor: specs.processor,
          battery: specs.battery,
          camera: specs.camera,
          display: specs.display,
          description: specs.description
        });
        count++;
      }
    });
    setUpdated(count);
    alert(`Updated ${count} product descriptions!`);
  };

  const clearDuplicates = () => {
    setDuplicates([]);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl tracking-tight font-bold text-[var(--color-text)]">
          Bulk Import Products
        </h2>
        <p className="text-xs sm:text-sm text-[var(--color-text-muted)] font-medium tracking-wide uppercase mt-1">
          Import products from pre-defined data
        </p>
      </div>

      <div className="premium-surface rounded-2xl border border-[var(--color-border)] p-6">
        <div className="flex flex-col items-center justify-center gap-6 py-8">
          <div className="h-16 w-16 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center">
            <Upload className="h-8 w-8 text-[var(--color-primary)]" />
          </div>
          
          <div className="text-center">
            <h3 className="text-lg font-semibold text-[var(--color-text)]">
              Ready to Import Products
            </h3>
            <p className="text-sm text-[var(--color-text-muted)] mt-1">
              Total products in database: <span className="font-semibold">{productsData.length}</span>
            </p>
            <p className="text-sm text-[var(--color-text-muted)]">
              Currently in store: <span className="font-semibold">{admin.products.length}</span>
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleClearAll}
              disabled={importing || admin.products.length === 0}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-500/10 text-red-600 border border-red-200 text-sm font-semibold rounded-xl hover:bg-red-500 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 className="h-4 w-4" />
              Clear All
            </button>
            <button
              onClick={handleFixImages}
              disabled={admin.products.length === 0}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-500/10 text-blue-600 border border-blue-200 text-sm font-semibold rounded-xl hover:bg-blue-500 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className="h-4 w-4" />
              Fix Images
            </button>
            <button
              onClick={handleFixDescriptions}
              disabled={admin.products.length === 0}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-500/10 text-green-600 border border-green-200 text-sm font-semibold rounded-xl hover:bg-green-500 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FileText className="h-4 w-4" />
              Add Descriptions
            </button>
            <button
              onClick={handleImport}
              disabled={importing}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-white text-sm font-semibold rounded-xl hover:bg-[var(--color-primary-hover)] hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {importing ? (
                <>
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Import All Products
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {updated > 0 && (
        <div className="premium-surface rounded-2xl border border-blue-500/30 p-6">
          <div className="flex items-center gap-2">
            <Check className="h-5 w-5 text-blue-500" />
            <h3 className="text-lg font-semibold text-[var(--color-text)]">
              Fixed {updated} product images
            </h3>
          </div>
        </div>
      )}

      {imported.length > 0 && (
        <div className="premium-surface rounded-2xl border border-green-500/30 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Check className="h-5 w-5 text-green-500" />
            <h3 className="text-lg font-semibold text-[var(--color-text)]">
              Successfully Imported ({imported.length})
            </h3>
          </div>
          <div className="max-h-48 overflow-y-auto space-y-1">
            {imported.slice(0, 20).map((name) => (
              <div key={name} className="text-sm text-[var(--color-text)] flex items-center gap-2">
                <Check className="h-3 w-3 text-green-500" />
                {name}
              </div>
            ))}
            {imported.length > 20 && (
              <div className="text-sm text-[var(--color-text-muted)]">
                ...and {imported.length - 20} more
              </div>
            )}
          </div>
        </div>
      )}

      {duplicates.length > 0 && (
        <div className="premium-surface rounded-2xl border border-yellow-500/30 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              <h3 className="text-lg font-semibold text-[var(--color-text)]">
                Duplicates Skipped ({duplicates.length})
              </h3>
            </div>
            <button
              onClick={clearDuplicates}
              className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            >
              Clear
            </button>
          </div>
          <div className="max-h-48 overflow-y-auto space-y-1">
            {duplicates.slice(0, 20).map((name) => (
              <div key={name} className="text-sm text-[var(--color-text-muted)] flex items-center gap-2">
                <X className="h-3 w-3 text-yellow-500" />
                {name}
              </div>
            ))}
            {duplicates.length > 20 && (
              <div className="text-sm text-[var(--color-text-muted)]">
                ...and {duplicates.length - 20} more
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}