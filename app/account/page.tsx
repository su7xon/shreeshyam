'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Package, User, LogOut, Settings, CreditCard, MapPin, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AccountPage() {
  const router = useRouter();
  
  // Real dynamic states ready for Auth and Database
  const [user, setUser] = useState<{name: string, email: string, initials: string} | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with actual Auth logic (e.g., Firebase onAuthStateChanged)
    const checkAuthStatus = () => {
      setIsLoading(true);
      // Currently set to NULL meaning user is NOT logged in.
      // Simply populate setUser({ name: '...', email: '...', initials: '...' }) when they login.
      setUser(null);
      setOrders([]);
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  const handleLogout = async () => {
    // TODO: Replace with actual Auth logout logic (e.g., Firebase signOut(auth))
    try {
      setUser(null);
      alert('You have successfully logged out!');
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
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
            onClick={() => alert('Login modal/page will open here')}
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
                <div className="w-12 h-12 bg-gray-200 text-gray-800 rounded-full flex items-center justify-center font-bold text-lg uppercase">
                  {user.initials}
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">{user.name}</h2>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
              
              <nav className="flex flex-col p-2">
                <Link href="/account" className="flex items-center justify-between p-3 rounded-lg bg-gray-50 text-gray-900 font-medium">
                  <div className="flex items-center gap-3">
                    <Package className="w-5 h-5 text-gray-500" />
                    <span>My Orders</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </Link>
                <Link href="#address" className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-gray-500" />
                    <span>Saved Addresses</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </Link>
                <Link href="#payment" className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-gray-500" />
                    <span>Payment Methods</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </Link>
                <Link href="#settings" className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors">
                  <div className="flex items-center gap-3">
                    <Settings className="w-5 h-5 text-gray-500" />
                    <span>Account Settings</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </Link>
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

          {/* Main Content - Order History */}
          <div className="flex-1">
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
                {orders.map((order) => (
                  <div key={order.id} className="bg-white border text-left border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 border-b border-gray-100 pb-4">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Order ID</div>
                        <div className="font-semibold text-gray-900">{order.id}</div>
                      </div>
                      <div className="mt-2 sm:mt-0">
                        <div className="text-xs text-gray-500 mb-1">Date</div>
                        <div className="font-medium text-gray-800">{order.date}</div>
                      </div>
                      <div className="mt-2 sm:mt-0">
                        <div className="text-xs text-gray-500 mb-1">Total Amount</div>
                        <div className="font-bold text-gray-900">₹{order.total}</div>
                      </div>
                      <div className="mt-2 sm:mt-0 flex items-center gap-2">
                         {order.status === 'Delivered' ? (
                           <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-2.5 py-1 rounded-full text-xs font-semibold">
                             <CheckCircle2 className="w-3.5 h-3.5" />
                             {order.status}
                           </span>
                         ) : (
                           <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full text-xs font-semibold">
                             <Package className="w-3.5 h-3.5" />
                             {order.status}
                           </span>
                         )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        {order.items} item{order.items > 1 ? 's' : ''} in this order.
                      </div>
                      <button className="text-sm font-semibold text-[#6E5EE2] hover:text-[#5041B2]">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
