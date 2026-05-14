'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Package, User, LogOut, MapPin, ChevronRight, CircleCheck, Globe, Plus, Trash2, Edit2, Check, X, Star, ExternalLink, Store } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { onAuthChange, logOut, getUserProfile, updateUserProfile, SavedAddress } from '@/lib/firebase-auth';
import { getOrdersByEmail } from '@/lib/services/orderService';

type ActiveSection = 'orders' | 'store' | 'addresses';

export default function AccountPage() {
  const router = useRouter();
  
  const [user, setUser] = useState<{uid: string, name: string, email: string, initials: string, photoURL: string} | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<ActiveSection>('orders');
  
  // Address states
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<SavedAddress | null>(null);
  const [addressForm, setAddressForm] = useState<Omit<SavedAddress, 'id' | 'isDefault'>>({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });
  const [savingAddress, setSavingAddress] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      setIsLoading(true);
      if (firebaseUser) {
        const displayName = firebaseUser.displayName || 'User';
        const initials = displayName.substring(0, 2).toUpperCase();
        setUser({
          uid: firebaseUser.uid,
          name: displayName,
          email: firebaseUser.email || '',
          initials: initials,
          photoURL: firebaseUser.photoURL || ''
        });

        // Load saved addresses and language from Firestore
        try {
          const profile = await getUserProfile(firebaseUser.uid);
          if (profile) {
            setSavedAddresses(profile.savedAddresses || []);
            setUserProfile(profile);
          }
        } catch (err) {
          console.error('Failed to load profile:', err);
        }

        // Load orders
        if (firebaseUser.email) {
          const userOrders = await getOrdersByEmail(firebaseUser.email);
          setOrders(userOrders);
        } else {
          setOrders([]);
        }
      } else {
        setUser(null);
        setOrders([]);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Check hash on load
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash === 'store') setActiveSection('store');
    else if (hash === 'addresses') setActiveSection('addresses');
  }, []);

  const handleLogout = async () => {
    try {
      await logOut();
      setUser(null);
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      } else {
        router.push('/');
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // ---- Address Management ----
  const resetAddressForm = () => {
    setAddressForm({ fullName: '', phone: '', address: '', city: '', state: '', pincode: '' });
    setEditingAddress(null);
    setShowAddressForm(false);
  };

  const handleEditAddress = (addr: SavedAddress) => {
    setEditingAddress(addr);
    setAddressForm({
      fullName: addr.fullName,
      phone: addr.phone,
      address: addr.address,
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
    });
    setShowAddressForm(true);
  };

  const handleSaveAddress = async () => {
    if (!user) return;
    if (!addressForm.fullName || !addressForm.phone || !addressForm.address || !addressForm.city || !addressForm.state || !addressForm.pincode) {
      alert('Please fill all fields');
      return;
    }

    setSavingAddress(true);
    try {
      let updatedAddresses: SavedAddress[];

      if (editingAddress) {
        // Update existing
        updatedAddresses = savedAddresses.map(a =>
          a.id === editingAddress.id
            ? { ...a, ...addressForm }
            : a
        );
      } else {
        // Add new
        const newAddress: SavedAddress = {
          id: Date.now().toString(),
          ...addressForm,
          isDefault: savedAddresses.length === 0, // First address is default
        };
        updatedAddresses = [...savedAddresses, newAddress];
      }

      await updateUserProfile(user.uid, { savedAddresses: updatedAddresses });
      setSavedAddresses(updatedAddresses);
      resetAddressForm();
    } catch (err) {
      console.error('Failed to save address:', err);
      alert('Failed to save address. Please try again.');
    } finally {
      setSavingAddress(false);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!user) return;
    if (!confirm('Are you sure you want to delete this address?')) return;

    try {
      let updatedAddresses = savedAddresses.filter(a => a.id !== id);
      // If deleted address was default, make first one default
      if (updatedAddresses.length > 0 && !updatedAddresses.some(a => a.isDefault)) {
        updatedAddresses[0].isDefault = true;
      }
      await updateUserProfile(user.uid, { savedAddresses: updatedAddresses });
      setSavedAddresses(updatedAddresses);
    } catch (err) {
      console.error('Failed to delete address:', err);
    }
  };

  const handleSetDefault = async (id: string) => {
    if (!user) return;
    const updatedAddresses = savedAddresses.map(a => ({
      ...a,
      isDefault: a.id === id,
    }));
    try {
      await updateUserProfile(user.uid, { savedAddresses: updatedAddresses });
      setSavedAddresses(updatedAddresses);
    } catch (err) {
      console.error('Failed to set default:', err);
    }
  };



  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-gray-50 min-h-screen flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center max-w-md w-full">
          <User className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Not Logged In</h2>
          <p className="text-gray-500 mb-6">Log in or create an account to view your profile, manage addresses, and check order history.</p>
          <button 
            onClick={() => { window.location.href = '/auth'; }}
            className="w-full bg-black text-white font-medium p-3 rounded-lg hover:bg-gray-800 transition-colors shadow-sm"
          >
            Login / Sign Up
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Header */}
      <div className="bg-white px-4 pt-12 pb-6 shadow-sm mb-4">
        <h1 className="text-2xl font-bold text-gray-900">My Account</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back, {user.name}</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-6">
          
          {/* Sidebar Navigation */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center gap-3">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.name} className="w-12 h-12 rounded-full object-cover shadow-sm border border-gray-200" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-12 h-12 bg-gray-200 text-gray-800 rounded-full flex items-center justify-center font-bold text-lg uppercase shadow-sm border border-gray-100">
                    {user.initials}
                  </div>
                )}
                <div>
                  <h2 className="font-semibold text-gray-900">{user.name}</h2>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
              
              <nav className="flex flex-col p-2">
                <button 
                  onClick={() => setActiveSection('orders')}
                  className={`flex items-center justify-between p-3 rounded-lg transition-colors text-left ${activeSection === 'orders' ? 'bg-gray-50 text-gray-900 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  <div className="flex items-center gap-3">
                    <Package className="w-5 h-5 text-gray-500" />
                    <span>My Orders</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
                <button 
                  onClick={() => setActiveSection('store')}
                  className={`flex items-center justify-between p-3 rounded-lg transition-colors text-left ${activeSection === 'store' ? 'bg-gray-50 text-gray-900 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  <div className="flex items-center gap-3">
                    <Store className="w-5 h-5 text-gray-500" />
                    <span>Store Location</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
                <button 
                  onClick={() => setActiveSection('addresses')}
                  className={`flex items-center justify-between p-3 rounded-lg transition-colors text-left ${activeSection === 'addresses' ? 'bg-gray-50 text-gray-900 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-gray-500" />
                    <span>Saved Addresses</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
              </nav>
            </div>
            
            {/* Logout Button */}
            <div className="mt-4">
              <button 
                className="w-full flex items-center justify-center gap-2 bg-white border border-red-200 text-red-600 font-medium p-3 rounded-xl hover:bg-red-50 transition-colors shadow-sm"
                onClick={handleLogout}
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">

            {/* ========== ORDERS SECTION ========== */}
            {activeSection === 'orders' && (
              <>
                <h2 className="text-xl font-bold text-gray-900 mb-4 px-1">Order History</h2>
                {orders.length === 0 ? (
                  <div className="bg-white border border-gray-100 rounded-xl p-8 text-center shadow-sm">
                    <Package className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No orders yet</h3>
                    <p className="text-gray-500 mb-4">When you place an order, it will appear here.</p>
                    <Link href="/products" className="inline-block bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors">
                      Start Shopping
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order: any) => (
                      <div key={order.id} className="bg-white border text-left border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 border-b border-gray-100 pb-4">
                          <div className="flex items-center gap-4">
                            {/* Product Image Preview */}
                            <div className="flex -space-x-3 overflow-hidden">
                              {order.items?.slice(0, 3).map((item: any, idx: number) => (
                                <img 
                                  key={idx}
                                  src={item.image || '/images/placeholder.png'} 
                                  alt={item.name} 
                                  className="w-12 h-12 rounded-lg object-cover border-2 border-white shadow-sm"
                                />
                              ))}
                              {(order.items?.length || 0) > 3 && (
                                <div className="w-12 h-12 rounded-lg bg-gray-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-gray-500 shadow-sm">
                                  +{(order.items?.length || 0) - 3}
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="text-xs text-gray-500 mb-1">Product</div>
                              <div className="font-semibold text-gray-900 text-sm sm:text-base line-clamp-1 max-w-[150px] sm:max-w-[200px]">
                                {order.items?.[0]?.name || 'N/A'}
                                {order.items?.length > 1 && ` +${order.items.length - 1} more`}
                              </div>
                              <div className="text-[10px] text-gray-400 font-mono mt-0.5">#{order.id.substring(0, 10)}...</div>
                            </div>
                          </div>
                          <div className="mt-2 sm:mt-0">
                            <div className="text-xs text-gray-500 mb-1">Date</div>
                            <div className="font-medium text-gray-800">
                              {order.createdAt ? (
                                typeof order.createdAt.toDate === 'function' 
                                  ? order.createdAt.toDate().toLocaleDateString() 
                                  : new Date(order.createdAt).toLocaleDateString()
                              ) : 'N/A'}
                            </div>
                          </div>
                          <div className="mt-2 sm:mt-0">
                            <div className="text-xs text-gray-500 mb-1">Total</div>
                            <div className="font-bold text-gray-900">₹{(order.total || 0).toLocaleString('en-IN')}</div>
                          </div>
                          <div className="mt-2 sm:mt-0">
                             {order.status === 'delivered' ? (
                               <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-2.5 py-1 rounded-full text-xs font-semibold capitalize">
                                 <CircleCheck className="w-3.5 h-3.5" />
                                 {order.status}
                               </span>
                             ) : (
                               <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full text-xs font-semibold capitalize">
                                 <Package className="w-3.5 h-3.5" />
                                 {order.status || 'Pending'}
                               </span>
                             )}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-600">
                            {order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? 's' : ''} in this order.
                          </div>
                          <button 
                            onClick={() => setSelectedOrder(order)}
                            className="text-sm font-semibold text-[#ff8c00] hover:text-[#e67e00]"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* ========== STORE LOCATION SECTION ========== */}
            {activeSection === 'store' && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h2 className="text-xl font-bold text-gray-900 mb-4 px-1">Visit Our Store</h2>
                
                <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                  {/* Map Preview Image (Static placeholder for now, or use an iframe) */}
                  <div className="h-48 bg-gray-200 relative overflow-hidden">
                    <iframe 
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3576.471676674681!2d73.045464!3d26.311105!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjbCsDE4JzQwLjAiTiA3M8KwMDInNDMuNyJF!5e0!3m2!1sen!2sin!4v1715694000000!5m2!1sen!2sin" 
                      className="w-full h-full border-0" 
                      allowFullScreen 
                      loading="lazy" 
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full shadow-sm text-xs font-bold text-[#ff8c00] flex items-center gap-1.5 border border-white">
                      <Star className="w-3 h-3 fill-current" />
                      Main Branch
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                      <div>
                        <h3 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                          श्री श्याम Mobiles
                        </h3>
                        <p className="text-gray-500 font-medium">Shree Shyam Mobiles Jodhpur</p>
                      </div>
                      <Link 
                        href="https://maps.google.com/?q=Shree+Shyam+Mobiles+Mandore+Mandi+Jodhpur"
                        target="_blank"
                        className="bg-black text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-black/10"
                      >
                        <MapPin className="w-4 h-4" />
                        Get Directions
                      </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                          <div className="w-10 h-10 rounded-full bg-[#ff8c00]/10 flex items-center justify-center flex-shrink-0">
                            <MapPin className="w-5 h-5 text-[#ff8c00]" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Address</p>
                            <p className="text-sm font-semibold text-gray-800 leading-relaxed">
                              Near Mandore Mandi, Mandore Road,<br />
                              Jodhpur, Rajasthan 342007
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                            <Package className="w-5 h-5 text-blue-500" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Business Hours</p>
                            <p className="text-sm font-semibold text-gray-800">Mon - Sun: 10:00 AM - 09:00 PM</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                          <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 text-green-500" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">WhatsApp</p>
                            <p className="text-sm font-semibold text-gray-800">+91 98281 45878</p>
                          </div>
                        </div>

                        <div className="flex gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                          <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center flex-shrink-0">
                            <Check className="w-5 h-5 text-purple-500" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">UPI ID</p>
                            <Link 
                              href="upi://pay?pa=shreeganesh1585-3@okaxis&pn=Shree%20Shyam%20Mobiles"
                              className="text-sm font-semibold text-purple-600 hover:text-purple-800 transition-colors flex items-center gap-1"
                            >
                              shreeganesh1585-3@okaxis
                              <ExternalLink className="w-3 h-3" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========== SAVED ADDRESSES SECTION ========== */}
            {activeSection === 'addresses' && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex items-center justify-between mb-4 px-1">
                  <h2 className="text-xl font-bold text-gray-900">Saved Addresses</h2>
                  {!showAddressForm && (
                    <button
                      onClick={() => { resetAddressForm(); setShowAddressForm(true); }}
                      className="flex items-center gap-1.5 bg-[#ff8c00] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#e67e00] transition-colors shadow-sm"
                    >
                      <Plus className="w-4 h-4" />
                      Add Address
                    </button>
                  )}
                </div>

                {/* Address Form */}
                {showAddressForm && (
                  <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm mb-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900">
                        {editingAddress ? 'Edit Address' : 'Add New Address'}
                      </h3>
                      <button onClick={resetAddressForm} className="text-gray-400 hover:text-gray-600">
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Full Name *</label>
                        <input
                          type="text"
                          value={addressForm.fullName}
                          onChange={(e) => setAddressForm({...addressForm, fullName: e.target.value})}
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff8c00] text-sm"
                          placeholder="Enter full name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Phone Number *</label>
                        <input
                          type="tel"
                          value={addressForm.phone}
                          onChange={(e) => setAddressForm({...addressForm, phone: e.target.value})}
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff8c00] text-sm"
                          placeholder="+91 98765 43210"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-600 mb-1">Full Address *</label>
                        <textarea
                          value={addressForm.address}
                          onChange={(e) => setAddressForm({...addressForm, address: e.target.value})}
                          rows={2}
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff8c00] text-sm resize-none"
                          placeholder="House No., Street, Locality, Landmark"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">City *</label>
                        <input
                          type="text"
                          value={addressForm.city}
                          onChange={(e) => setAddressForm({...addressForm, city: e.target.value})}
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff8c00] text-sm"
                          placeholder="e.g. Jodhpur"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">State *</label>
                        <input
                          type="text"
                          value={addressForm.state}
                          onChange={(e) => setAddressForm({...addressForm, state: e.target.value})}
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff8c00] text-sm"
                          placeholder="e.g. Rajasthan"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">PIN Code *</label>
                        <input
                          type="text"
                          value={addressForm.pincode}
                          onChange={(e) => setAddressForm({...addressForm, pincode: e.target.value.replace(/\D/g, '').slice(0, 6)})}
                          maxLength={6}
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff8c00] text-sm"
                          placeholder="e.g. 342001"
                        />
                      </div>
                    </div>
                    <div className="flex gap-3 mt-5">
                      <button
                        onClick={handleSaveAddress}
                        disabled={savingAddress}
                        className="flex items-center gap-2 bg-[#ff8c00] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#e67e00] transition-colors disabled:opacity-50"
                      >
                        <Check className="w-4 h-4" />
                        {savingAddress ? 'Saving...' : (editingAddress ? 'Update Address' : 'Save Address')}
                      </button>
                      <button
                        onClick={resetAddressForm}
                        className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-600 border border-gray-300 hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Address List */}
                {savedAddresses.length === 0 && !showAddressForm ? (
                  <div className="bg-white border border-gray-100 rounded-xl p-8 text-center shadow-sm">
                    <MapPin className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No saved addresses</h3>
                    <p className="text-gray-500 mb-4">Add an address so you can quickly checkout next time.</p>
                    <button 
                      onClick={() => { resetAddressForm(); setShowAddressForm(true); }}
                      className="inline-flex items-center gap-2 bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add Your First Address
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {savedAddresses.map((addr) => (
                      <div 
                        key={addr.id} 
                        className={`bg-white border rounded-xl p-4 shadow-sm transition-all ${addr.isDefault ? 'border-[#ff8c00] ring-1 ring-[#ff8c00]/20' : 'border-gray-100'}`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-gray-900">{addr.fullName}</h4>
                              {addr.isDefault && (
                                <span className="inline-flex items-center gap-1 bg-[#ff8c00]/10 text-[#ff8c00] px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide">
                                  <Star className="w-3 h-3 fill-current" />
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">{addr.address}</p>
                            <p className="text-sm text-gray-600">{addr.city}, {addr.state} - {addr.pincode}</p>
                            <p className="text-sm text-gray-500 mt-1">📱 {addr.phone}</p>
                          </div>
                          <div className="flex items-center gap-1 ml-3">
                            <button
                              onClick={() => handleEditAddress(addr)}
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteAddress(addr.id)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        {!addr.isDefault && (
                          <button
                            onClick={() => handleSetDefault(addr.id)}
                            className="mt-3 text-xs font-medium text-[#ff8c00] hover:text-[#e67e00] transition-colors"
                          >
                            Set as default
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ========== ORDER DETAILS MODAL ========== */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex items-center justify-between z-10">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Order Details</h3>
                <p className="text-xs text-gray-500">#{selectedOrder.id}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              {/* Order Info Grid */}
              <div className="grid grid-cols-2 gap-6 mb-8 bg-gray-50 p-4 rounded-xl">
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">Status</p>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold capitalize ${
                    selectedOrder.status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {selectedOrder.status || 'Pending'}
                  </span>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">Date</p>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedOrder.createdAt ? (
                      typeof selectedOrder.createdAt.toDate === 'function' 
                        ? selectedOrder.createdAt.toDate().toLocaleDateString() 
                        : new Date(selectedOrder.createdAt).toLocaleDateString()
                    ) : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">Payment Method</p>
                  <p className="text-sm font-medium text-gray-900 capitalize">{selectedOrder.paymentMethod || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">Total Amount</p>
                  <p className="text-sm font-bold text-gray-900 text-lg">₹{(selectedOrder.total || 0).toLocaleString('en-IN')}</p>
                </div>
              </div>

              {/* Items List */}
              <div className="mb-8">
                <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Package className="w-4 h-4 text-gray-400" />
                  Items ({selectedOrder.items?.length || 0})
                </h4>
                <div className="space-y-4">
                  {selectedOrder.items?.map((item: any, idx: number) => (
                    <div key={idx} className="flex gap-4 p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                      <img 
                        src={item.image || '/images/placeholder.png'} 
                        alt={item.name} 
                        className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                      />
                      <div className="flex-1">
                        <h5 className="text-sm font-semibold text-gray-900 line-clamp-1">{item.name}</h5>
                        <p className="text-xs text-gray-500 mt-0.5">Quantity: {item.quantity || 1}</p>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-sm font-bold text-gray-900">₹{(item.price || 0).toLocaleString('en-IN')}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address */}
              {selectedOrder.customer && (
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    Delivery Address
                  </h4>
                  <div className="text-sm text-gray-600 space-y-0.5">
                    <p className="font-semibold text-gray-900">{selectedOrder.customer.name}</p>
                    <p>{selectedOrder.customer.address}</p>
                    <p>{selectedOrder.customer.city}, {selectedOrder.customer.state} - {selectedOrder.customer.pincode}</p>
                    <p className="pt-1 font-medium text-gray-700">Phone: {selectedOrder.customer.phone}</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-gray-100 flex justify-end">
              <button 
                onClick={() => setSelectedOrder(null)}
                className="px-6 py-2 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
