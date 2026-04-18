/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { 
  Send, 
  Facebook, 
  Instagram, 
  Youtube, 
  Twitter, 
  Video, 
  Home, 
  ShoppingBag, 
  User, 
  History, 
  Search,
  ChevronRight,
  AlertTriangle,
  Wallet,
  LucideIcon,
  MessageCircle,
  PlusCircle,
  RefreshCw,
  Gift,
  Bell,
  Zap,
  HandCoins,
  Share2,
  LayoutDashboard,
  Layers,
  Key,
  Gamepad2,
  TrendingUp,
  FileText,
  Settings,
  ShieldCheck,
  Headphones,
  Calendar,
  Lock,
  Copy,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CATEGORIES, SERVICES } from './constants';
import { TelegramUser, SMMService, Category } from './types';

const GATEWAYS = [
    { 
        id: 'bkash', 
        name: 'Bkash', 
        min: 1, 
        number: '01916649472', 
        type: 'Send Money', 
        instructions: 'বিকাশ নাম্বারে সেন্ড মানি করবেন। ট্রানজিকশন আইডি এবং স্ক্রিনশট পাঠাবেন। ১ -২ ঘণ্টার মধ্যে ডিপোজিট করে দেওয়া হয়।'
    },
    { 
        id: 'nagad', 
        name: 'Nagad', 
        min: 10, 
        number: '01916649472', 
        type: 'Send Money', 
        instructions: 'নগদ নাম্বারে সেন্ড মানি করবেন। ট্রানজিকশন আইডি এবং স্ক্রিনশট পাঠাবেন।'
    },
    { 
        id: 'rocket', 
        name: 'Rocket', 
        min: 20, 
        number: '01916649472', 
        type: 'Send Money', 
        instructions: 'রকেট নাম্বারে সেন্ড মানি করবেন। ট্রানজিকশন আইডি এবং স্ক্রিনশট পাঠাবেন।'
    },
    { 
        id: 'binance', 
        name: 'Binance', 
        min: 100, 
        number: 'TID: 123456', 
        type: 'USDT', 
        instructions: 'বাইনান্স পে আইডিতে পেমেন্ট করবেন।'
    },
];

const PlatformIcons: Record<string, LucideIcon> = {
  telegram: Send,
  facebook: Facebook,
  instagram: Instagram,
  youtube: Youtube,
  twitter: Twitter,
  tiktok: Video,
};

type AppTab = 'deposit' | 'history' | 'profile' | 'chat' | 'new-order' | 'referral';

export default function App() {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [isTelegramEnv, setIsTelegramEnv] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<AppTab>('new-order');
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [orderQuantity, setOrderQuantity] = useState<string>('');
  const [orderLink, setOrderLink] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'link' | 'balance' | 'service-missing' | 'category-missing' | 'transaction-missing' | 'amount-missing' | 'gateway-missing'>('link');
  const [openDropdown, setOpenDropdown] = useState<'category' | 'service' | 'gateway' | null>(null);
  const [depositType, setDepositType] = useState<'auto' | 'manual'>('auto');
  const [selectedGatewayId, setSelectedGatewayId] = useState<string | null>(null);
  const [depositAmount, setDepositAmount] = useState<string>('1');
  const [transactionId, setTransactionId] = useState<string>('');
  const [depositNote, setDepositNote] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const bannerImages = [
    'https://i.ibb.co.com/20070TgF/Screenshot-20260418-020416.jpg',
    'https://i.ibb.co.com/9HY2pr29/Screenshot-20260418-020121.jpg'
  ];

  useEffect(() => {
    const timer = setInterval(() => {
        setCurrentBannerIndex((prev) => (prev + 1) % bannerImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const selectedService = SERVICES.find(s => s.id === selectedServiceId);

  const platforms = [
    { id: 'facebook', name: 'Facebook', icon: Facebook },
    { id: 'youtube', name: 'YouTube', icon: Youtube },
    { id: 'tiktok', name: 'TikTok', icon: Video },
    { id: 'instagram', name: 'Instagram', icon: Instagram },
    { id: 'telegram', name: 'Telegram', icon: Send },
    { id: 'all', name: 'All', icon: ShoppingBag },
  ];

  const handleManualDeposit = () => {
    if (!selectedGatewayId) {
        setModalType('gateway-missing');
        setShowModal(true);
        return;
    }
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
        setModalType('amount-missing');
        setShowModal(true);
        return;
    }
    if (!transactionId) {
        setModalType('transaction-missing');
        setShowModal(true);
        return;
    }
    // Success logic placeholder
  };

  const handlePlaceOrder = () => {
    if (!selectedCategory) {
        setModalType('category-missing');
        setShowModal(true);
        return;
    }

    if (!selectedServiceId) {
        setModalType('service-missing');
        setShowModal(true);
        return;
    }

    if (!orderLink) {
        setModalType('link');
        setShowModal(true);
        return;
    }
    
    // Check balance logic (always show insufficient balance for demo if user has 0)
    if (selectedService && orderQuantity) {
        setModalType('balance');
        setShowModal(true);
    }
  };

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    // Check if we are in AI Studio Preview environment to allow development
    const isDevPreview = window.location.hostname.includes('ais-dev') || 
                        window.location.hostname.includes('ais-pre') ||
                        window.location.hostname === 'localhost';

    if (tg && (tg as any).initDataUnsafe?.user && (tg as any).platform !== 'unknown') {
      tg.ready();
      tg.expand();
      
      const tgUser = tg.initDataUnsafe.user;
      setUser(tgUser);
      setIsTelegramEnv(true);
    } else {
      // Logic for developers in AI Studio
      if (isDevPreview) {
        setUser({
          id: 7228630025,
          first_name: 'Trader Tamim',
          username: 'TRADER_TAMIM_3',
        });
        setIsTelegramEnv(true);
      } else {
        setIsTelegramEnv(false);
      }
    }
  }, []);

  const filteredCategories = CATEGORIES.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredServices = selectedCategory 
    ? SERVICES.filter(s => s.category === selectedCategory)
    : SERVICES;

  if (isTelegramEnv === false) {
    return (
      <div className="fixed inset-0 bg-[#0A0A0A] flex items-center justify-center p-8 text-white overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-600 rounded-full blur-[140px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-400 rounded-full blur-[140px]" />
        </div>

        <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative z-10 w-full max-w-sm bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[48px] p-10 text-center shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)]"
        >
            <div className="w-28 h-28 bg-gradient-to-br from-blue-500 to-blue-700 rounded-[35px] mx-auto mb-10 flex items-center justify-center shadow-2xl shadow-blue-500/30 ring-8 ring-white/5">
                <Send className="w-14 h-14 text-white rotate-[-20deg] mr-1.5 mb-1.5 drop-shadow-lg" />
            </div>

            <h1 className="text-3xl font-black mb-4 tracking-tight leading-loose text-white">
                Telegram Only Access
            </h1>
            
            <p className="text-blue-100/60 text-sm font-bold leading-relaxed mb-12 max-w-[280px] mx-auto">
                এই ওয়েবসাইটটি শুধুমাত্র টেলিগ্রাম মিনি অ্যাপ থেকে ব্যবহারযোগ্য। আমাদের অফিসিয়াল বোট এর মাধ্যমে প্রবেশ করুন।
            </p>

            <div className="space-y-4">
                <button 
                    onClick={() => window.location.href = 'https://t.me/your_bot_username'}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-[24px] transition-all active:scale-95 flex items-center justify-center gap-3 shadow-[0_20px_40px_-10px_rgba(37,99,235,0.4)]"
                >
                    <span className="tracking-widest uppercase text-xs">Open Telegram Bot</span>
                    <ChevronRight className="w-5 h-5" />
                </button>
                
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 pt-8 opacity-40">
                    Security Secured by TRADER TAMIM
                </p>
            </div>
        </motion.div>
      </div>
    );
  }

  if (isTelegramEnv === null) {
      return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <RefreshCw className="w-10 h-10 text-blue-500 animate-spin" />
                <p className="text-blue-100 font-bold uppercase tracking-widest text-[10px]">Initializing...</p>
            </div>
        </div>
      )
  }

  return (
    <div className="min-h-screen bg-smm-bg text-smm-text-primary pb-28 font-sans select-none overflow-x-hidden flex flex-col">
      <main className="flex-1">
        <AnimatePresence mode="wait">
          {activeTab === 'deposit' && (
            <motion.div 
              key="deposit"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-5 pb-20"
            >
              {/* Header Section */}
              <div className="mx-3 mt-3 p-5 bg-gradient-to-b from-[#1E90FF] to-[#1E6BFF] rounded-[32px] text-white shadow-lg relative overflow-hidden">
                <div className="relative z-10 flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-xl font-black tracking-tight">Deposit Balance</h2>
                        <p className="text-blue-100 text-[10px] opacity-90 mt-0.5 uppercase tracking-widest font-black">Payments</p>
                    </div>
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30">
                        <Wallet className="w-6 h-6 text-white" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/10 backdrop-blur-md rounded-[20px] p-3.5 border border-white/10 flex flex-col items-center justify-center text-center">
                        <p className="text-[10px] font-black uppercase tracking-widest text-blue-100 opacity-60 mb-0.5">Total</p>
                        <p className="text-xl font-black">0</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-[20px] p-3.5 border border-white/10 flex flex-col items-center justify-center text-center">
                        <p className="text-[10px] font-black uppercase tracking-widest text-blue-100 opacity-60 mb-0.5">Pending</p>
                        <p className="text-xl font-black">0</p>
                    </div>
                    <div className="col-span-2 bg-white/10 backdrop-blur-md rounded-[20px] p-3 border border-white/10 flex flex-col items-center justify-center text-center">
                        <p className="text-[10px] font-black uppercase tracking-widest text-blue-100 opacity-60 mb-0.5">Completed</p>
                        <p className="text-xl font-black">0</p>
                    </div>
                </div>
              </div>

              <div className="px-4 space-y-5">
                {/* Choose Deposit Type Section */}
                <section className="bg-white p-4 rounded-[28px] border border-smm-border/60 shadow-sm">
                    <h3 className="text-lg font-black text-gray-900 mb-4 pl-1">Choose Deposit Type</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <button 
                            onClick={() => setDepositType('auto')}
                            className={`${depositType === 'auto' ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25' : 'bg-gray-50 text-gray-400'} p-4 rounded-[22px] flex flex-col items-center gap-2 active:scale-95 transition-all w-full`}
                        >
                            <Zap className="w-7 h-7 stroke-[2.5px]" />
                            <span className="font-black text-[10px] uppercase tracking-wider">Auto Payment</span>
                        </button>
                        <button 
                            onClick={() => setDepositType('manual')}
                            className={`${depositType === 'manual' ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-white shadow-lg shadow-orange-500/25' : 'bg-gray-50 text-gray-400'} p-4 rounded-[22px] flex flex-col items-center gap-2 active:scale-95 transition-all w-full`}
                        >
                            <HandCoins className="w-7 h-7 stroke-[2.5px]" />
                            <span className="font-black text-[10px] uppercase tracking-wider">Manual Payment</span>
                        </button>
                    </div>

                    {depositType === 'auto' ? (
                        <div className="mt-6 space-y-4">
                            <div className="space-y-2">
                                <label className="block text-[11px] font-black text-gray-500 pl-1 uppercase tracking-widest">Amount</label>
                                <input 
                                    type="number" 
                                    value={depositAmount} 
                                    onChange={(e) => setDepositAmount(e.target.value)}
                                    placeholder="Enter amount"
                                    className="w-full bg-gray-50 border border-gray-100 rounded-[18px] py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-300"
                                />
                            </div>

                            <button className="w-full bg-blue-600 text-white font-black py-4 rounded-[20px] shadow-lg shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-2">
                                Create Auto Payment
                            </button>
                        </div>
                    ) : (
                        <div className="mt-6 space-y-5">
                            <div className="space-y-2">
                                <label className="block text-[11px] font-black text-gray-500 pl-1 uppercase tracking-widest">Select Gateway</label>
                                <button 
                                    onClick={() => setOpenDropdown(openDropdown === 'gateway' ? null : 'gateway')}
                                    className={`w-full bg-white border ${openDropdown === 'gateway' ? 'border-blue-500 ring-2 ring-blue-500/10' : 'border-gray-200'} rounded-[20px] py-4 px-6 text-sm font-bold shadow-sm outline-none transition-all flex items-center justify-between text-left`}
                                >
                                    <span className={selectedGatewayId ? 'text-gray-900' : 'text-gray-400'}>
                                        {GATEWAYS.find(g => g.id === selectedGatewayId)?.name || 'Select Gateway'}
                                    </span>
                                    <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${openDropdown === 'gateway' ? '-rotate-90' : 'rotate-90'}`} />
                                </button>

                                <AnimatePresence>
                                    {openDropdown === 'gateway' && (
                                        <motion.div 
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="bg-white border border-smm-border rounded-[24px] shadow-xl p-2 space-y-1 mt-2"
                                        >
                                            {GATEWAYS.map(gateway => (
                                                <button 
                                                    key={gateway.id}
                                                    onClick={() => {
                                                        setSelectedGatewayId(gateway.id);
                                                        setOpenDropdown(null);
                                                    }}
                                                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${selectedGatewayId === gateway.id ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'}`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <HandCoins className="w-4 h-4" />
                                                        <span className="font-bold text-xs">{gateway.name}</span>
                                                    </div>
                                                    <p className="text-[9px] font-black opacity-60">Min ৳{gateway.min}</p>
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {selectedGatewayId && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="p-4 bg-blue-50/50 rounded-[24px] border border-blue-100/50 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-xs font-black text-blue-700 uppercase tracking-widest">{GATEWAYS.find(g => g.id === selectedGatewayId)?.name} Details</h4>
                                        <div className="px-2 py-0.5 bg-blue-600 text-white rounded text-[8px] font-black uppercase">Official</div>
                                    </div>
                                    
                                    <div className="bg-white p-3.5 rounded-[18px] border border-blue-100 shadow-sm">
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Payment Number</p>
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-black text-gray-900">{GATEWAYS.find(g => g.id === selectedGatewayId)?.number}</p>
                                            <button className="text-blue-600 active:scale-90 transition-transform"><Copy className="w-4 h-4" /></button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-white p-3 rounded-[16px] border border-blue-50 shadow-sm">
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Min</p>
                                            <p className="text-xs font-black text-gray-900">৳{GATEWAYS.find(g => g.id === selectedGatewayId)?.min}</p>
                                        </div>
                                        <div className="bg-white p-3 rounded-[16px] border border-blue-50 shadow-sm">
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Type</p>
                                            <p className="text-xs font-black text-gray-900">{GATEWAYS.find(g => g.id === selectedGatewayId)?.type}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="block text-[11px] font-black text-gray-500 pl-1 uppercase tracking-widest">Amount</label>
                                    <input 
                                        type="number" 
                                        placeholder="Enter amount"
                                        value={depositAmount}
                                        onChange={(e) => setDepositAmount(e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-[18px] py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-[11px] font-black text-gray-500 pl-1 uppercase tracking-widest">Transaction ID</label>
                                    <input 
                                        type="text" 
                                        placeholder="TxnID or PayID"
                                        value={transactionId}
                                        onChange={(e) => setTransactionId(e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-[18px] py-4 px-6 font-mono text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <button 
                                    onClick={handleManualDeposit}
                                    className="w-full bg-blue-600 text-white font-black py-4 rounded-[20px] shadow-lg shadow-blue-500/20 active:scale-95 transition-all text-sm"
                                >
                                    Submit Deposit Request
                                </button>
                            </div>
                        </div>
                    )}
                </section>

                <section className="bg-white p-4 rounded-[28px] border border-smm-border/60 shadow-sm">
                    <h3 className="text-lg font-black text-gray-900 mb-4 pl-1">Deposit History</h3>
                    <div className="bg-gray-50 h-24 rounded-[20px] flex items-center justify-center border border-dashed border-gray-200">
                        <p className="text-xs font-bold text-gray-400">No deposit history found</p>
                    </div>
                </section>
              </div>
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div 
              key="history"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="px-5 pt-8 pb-10 bg-gradient-to-br from-blue-600 to-blue-400 rounded-b-[40px] text-white shadow-xl relative overflow-hidden">
                <div className="relative z-10 flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-black">Order History</h2>
                        <p className="text-blue-100 text-[10px] font-bold mt-1 uppercase tracking-widest opacity-80">Auto synced with provider status</p>
                    </div>
                    <button className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 active:rotate-180 transition-transform duration-500">
                        <RefreshCw className="w-6 h-6" />
                    </button>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-3">
                    <StatBox label="Total Orders" value="0" />
                    <StatBox label="Total Spent" value="৳0" />
                    <StatBox label="Completed" value="0" />
                    <StatBox label="Pending" value="0" />
                    <StatBox label="Processing" value="0" />
                    <StatBox label="Inprogress" value="0" />
                    <StatBox label="Partial" value="0" full />
                </div>
              </div>

              <div className="px-5 space-y-6">
                <section className="bg-white p-6 rounded-3xl border border-smm-border shadow-sm">
                    <h3 className="text-lg font-black mb-4">Refill Order</h3>
                    <input 
                        type="text" 
                        placeholder="Enter Service ID / Provider Order ID" 
                        className="w-full bg-gray-50 border border-smm-border rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-400"
                    />
                    <div className="mt-4 flex flex-col items-center">
                        <RefreshCw className="w-8 h-8 text-gray-300 mb-4" />
                        <button className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-2">
                           <RefreshCw className="w-5 h-5" />
                           Refill
                        </button>
                        <p className="mt-4 text-[11px] text-gray-400 font-bold text-center leading-relaxed">এখানে আপনার order-এর Service ID / Provider Order ID দিন।</p>
                    </div>
                </section>

                <section>
                    <h3 className="text-lg font-black mb-4">Search & Filter</h3>
                    <div className="relative mb-4">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search by order ID, service, link, Service ID" 
                            className="w-full bg-white border border-smm-border rounded-2xl py-4 pl-12 pr-6 text-xs font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-none mb-3">
                        {['All', 'Pending', 'Processing', 'Inprogress', 'Completed', 'Partial', 'Cancelled'].map((filter, i) => (
                            <button 
                                key={filter} 
                                className={`px-4 py-2 rounded-full text-[10px] font-black whitespace-nowrap transition-all ${i === 0 ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-white text-gray-500 border border-smm-border'}`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>

                    <div className="mt-4 flex flex-col items-center justify-center p-8 text-center bg-white rounded-[24px] border border-gray-100 shadow-sm">
                        <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                            <ShoppingBag className="w-6 h-6 text-gray-200" />
                        </div>
                        <h4 className="text-base font-black text-gray-900 leading-tight">No orders found</h4>
                        <p className="text-[11px] font-bold text-gray-400 mt-1">এই filter এ কোনো order পাওয়া যায়নি</p>
                    </div>
                </section>
              </div>
            </motion.div>
          )}

          {activeTab === 'profile' && (
            <motion.div 
                key="profile" 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="space-y-6 pb-24"
            >
              {/* Profile Header - Detailed */}
              <div className="px-4 pt-6 pb-8 bg-gradient-to-br from-[#1E90FF] via-[#1E6BFF] to-[#1E4BFF] rounded-b-[24px] text-white shadow-lg relative overflow-hidden text-center flex flex-col items-center">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl opacity-20" />
                
                <div className="relative z-10 flex flex-col items-center">
                    <div className="w-14 h-14 rounded-[20px] border-2 border-white/20 p-0.5 mb-3 bg-white/10 backdrop-blur-md">
                        <img 
                            src={user?.photo_url || "https://picsum.photos/seed/user/200/200"} 
                            alt="Avatar" 
                            className="w-full h-full object-cover rounded-[18px]" 
                        />
                    </div>
                    <h2 className="text-lg font-black tracking-tight leading-tight mb-0.5">
                        {user?.first_name || 'Trader Tamim'} {user?.last_name || ''}
                    </h2>
                    <p className="text-blue-100/80 text-[10px] font-bold">@{user?.username || 'TRADER_TAMIM_3'}</p>
                    <div className="mt-2 px-2.5 py-1 bg-white/20 backdrop-blur-md border border-white/20 rounded-full text-[8px] font-black tracking-widest uppercase">
                        User ID: {user?.id || '7228630025'}
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-6 w-full">
                    <div className="bg-white/10 backdrop-blur-md rounded-[20px] p-3 border border-white/10 flex flex-col items-center">
                        <p className="text-[9px] font-black text-blue-100 opacity-60 uppercase mb-1">Level</p>
                        <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-[20px] p-3 border border-white/10 flex flex-col items-center">
                        <p className="text-[9px] font-black text-blue-100 opacity-60 uppercase mb-1">Balance</p>
                        <p className="text-base font-black">৳0.00</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-[20px] p-3 border border-white/10 flex flex-col items-center">
                        <p className="text-[9px] font-black text-blue-100 opacity-60 uppercase mb-1">Spent</p>
                        <p className="text-base font-black">৳0.00</p>
                    </div>
                </div>
              </div>

              {/* Account Detailed Information */}
              <div className="mx-4 space-y-3">
                <div className="flex items-center gap-2 px-1">
                    <div className="w-1.5 h-5 bg-blue-600 rounded-full" />
                    <h3 className="text-lg font-black text-gray-900">Account Information</h3>
                </div>
                
                <div className="bg-white p-5 rounded-[32px] border border-smm-border/60 space-y-5 shadow-sm">
                    <div className="grid grid-cols-1 gap-5">
                        <InfoItem label="Full Name" value={`${user?.first_name || 'Trader Tamim'} ${user?.last_name || ''}`} icon={User} />
                        <InfoItem label="Username" value={`@${user?.username || 'TRADER_TAMIM_3'}`} icon={MessageCircle} />
                        <InfoItem label="User Level" value="Normal" icon={ShieldCheck} />
                        <InfoItem label="Telegram User ID" value={user?.id?.toString() || '7228630025'} icon={Lock} />
                        <InfoItem label="Account Created" value="18 Apr 2026, 00:46" icon={Calendar} />
                        <InfoItem label="Last Updated" value="18 Apr 2026, 02:03" icon={RefreshCw} />
                    </div>
                </div>
              </div>

              {/* Order Statistics Grid */}
              <div className="mx-4 space-y-3">
                <div className="flex items-center gap-2 px-1">
                    <div className="w-1.5 h-5 bg-blue-600 rounded-full" />
                    <h3 className="text-lg font-black text-gray-900">Order Statistics</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                    <StatListCard icon={ShoppingBag} label="Total Orders" value="0" color="bg-blue-50 text-blue-600" />
                    <StatListCard icon={ShieldCheck} label="Completed" value="0" color="bg-green-50 text-green-600" />
                    <StatListCard icon={History} label="Pending" value="0" color="bg-orange-50 text-orange-600" />
                    <StatListCard icon={RefreshCw} label="Processing" value="0" color="bg-indigo-50 text-indigo-600" />
                    <StatListCard icon={Layers} label="Partial" value="0" color="bg-purple-50 text-purple-600" />
                    <StatListCard icon={AlertTriangle} label="Cancelled" value="0" color="bg-red-50 text-red-600" />
                </div>
              </div>

              {/* Quick Actions List */}
              <div className="mx-5 space-y-4">
                <div className="flex flex-col gap-1 px-2">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-6 bg-blue-600 rounded-full" />
                        <h3 className="text-xl font-black text-gray-900">Quick Actions</h3>
                    </div>
                    <p className="text-[10px] font-bold text-gray-400 leading-relaxed max-w-[280px]">Fast access to your important sections in a clean list view.</p>
                </div>

                <div className="space-y-4">
                    <div className="px-2">
                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">QUICK MENU</span>
                    </div>

                    <div className="space-y-3">
                        <ActionMenuCard 
                            icon={LayoutDashboard} 
                            title="New Order" 
                            desc="Create a fresh order from your dashboard instantly." 
                            onClick={() => setActiveTab('new-order')}
                        />
                        <ActionMenuCard 
                            icon={ShoppingBag} 
                            title="My Orders" 
                            desc="Track all your current and completed orders in one place." 
                            onClick={() => setActiveTab('history')}
                        />
                        <ActionMenuCard 
                            icon={Key} 
                            title="Reseller API Key" 
                            desc="Are you reseller then try this features" 
                        />
                        <ActionMenuCard 
                            icon={TrendingUp} 
                            title="Earn With Ads" 
                            desc="View ads and Earn Balance" 
                        />
                        <ActionMenuCard 
                            icon={HandCoins} 
                            title="Add Funds" 
                            desc="Top up your account balance quickly and securely." 
                            onClick={() => setActiveTab('deposit')}
                        />
                        <ActionMenuCard 
                            icon={Gamepad2} 
                            title="Top Leaderboard" 
                            desc="View Monthly Top Referrer leaderboard" 
                        />
                        <ActionMenuCard 
                            icon={Gift} 
                            title="Referral" 
                            desc="See Your Refer link or many Details" 
                            onClick={() => setActiveTab('referral')}
                        />
                        <ActionMenuCard 
                            icon={FileText} 
                            title="Faq and Policy" 
                            desc="Faqs, Order Rules and Refund Policy" 
                        />
                        <ActionMenuCard 
                            icon={Headphones} 
                            title="Support Chat" 
                            desc="Talk to support for any issue, order help, or payment assistance." 
                            onClick={() => setActiveTab('chat')}
                        />
                    </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'new-order' && (
            <motion.div key="new-order" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-10 space-y-4">
                 {/* Profile Header - Match Screenshot */}
                 <div className="px-4 pt-5 pb-6 bg-gradient-to-br from-[#1E90FF] via-[#1E6BFF] to-[#1E4BFF] rounded-b-[32px] text-white shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-10 -mt-10 blur-3xl opacity-20" />
                     <div className="flex items-center gap-4 mb-8 relative z-10">
                        <div className="w-16 h-16 rounded-[24px] border-2 border-white/30 p-1 flex items-center justify-center overflow-hidden bg-white/20 backdrop-blur-md">
                            <img 
                                src={user?.photo_url || "https://picsum.photos/seed/user/200/200"} 
                                alt={user?.first_name || "Trader Tamim"} 
                                className="w-full h-full object-cover rounded-[14px]" 
                                referrerPolicy="no-referrer" 
                            />
                        </div>
                        <div>
                            <h2 className="text-xl font-black tracking-tight leading-tight flex items-center gap-1.5">
                                {user?.first_name || 'Trader Tamim'} {user?.last_name || ''}
                            </h2>
                            <p className="text-blue-100 text-xs opacity-80 mt-0.5">@{user?.username || 'TRADER_TAMIM_3'}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 relative z-10">
                        <div className="bg-white/10 backdrop-blur-md rounded-[24px] p-4 border border-white/10 flex flex-col items-center">
                            <p className="text-[9px] uppercase tracking-[1.5px] text-blue-100 font-bold opacity-70 mb-1">Balance</p>
                            <p className="text-lg font-black">৳0.0000</p>
                        </div>
                        <div 
                            onClick={() => setActiveTab('referral')}
                            className="bg-white/10 backdrop-blur-md rounded-[24px] p-4 border border-white/10 flex flex-col items-center cursor-pointer active:scale-95 transition-all"
                        >
                            <p className="text-[9px] uppercase tracking-[1.5px] text-blue-100 font-bold opacity-70 mb-1">Invite</p>
                            <User className="w-6 h-6" />
                        </div>
                    </div>
                 </div>

                  {/* Animated Notice Bar (যাবে আর আসবে Animation) */}
                  <div className="mx-4 mt-4 bg-gradient-to-r from-blue-50 to-white border border-blue-100/50 rounded-2xl py-3 px-1 relative overflow-hidden flex items-center">
                        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
                        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
                        
                        <motion.div 
                            animate={{ x: ['100%', '-100%'] }}
                            transition={{ 
                                duration: 25, // Significantly slower for a super smooth motion
                                repeat: Infinity, 
                                ease: "easeInOut",
                                repeatType: "reverse"
                            }}
                            className="whitespace-nowrap flex items-center gap-6"
                        >
                            <span className="text-[11px] font-black text-blue-700 flex items-center gap-2 uppercase tracking-widest">
                                <Bell className="w-3 h-3 animate-bounce" />
                                MJBOOST এনিমেশন আপডেট: লেখাটি সামনে যাবে আবার পিছনে আসবে! 🚀
                            </span>
                            <span className="text-[11px] font-black text-orange-600 flex items-center gap-2 uppercase tracking-widest">
                                <Zap className="w-3 h-3" />
                                সব সার্ভিস সুপার ফাস্ট কাজ করছে 🔥
                            </span>
                            <span className="text-[11px] font-black text-green-600 flex items-center gap-2 uppercase tracking-widest">
                                <ShieldCheck className="w-3 h-3" />
                                ১০০% সিকিউরড পেমেন্ট গেটওয়ে ✅
                            </span>
                        </motion.div>
                  </div>

                  <div className="mx-4 mt-4">
                    <div className="h-44 bg-white rounded-[32px] overflow-hidden relative group shadow-lg border border-white/50">
                        {/* Main Festive Image Slider */}
                        <div className="absolute inset-0">
                            <AnimatePresence mode="wait">
                                <motion.img 
                                    key={currentBannerIndex}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.5 }}
                                    src={bannerImages[currentBannerIndex]} 
                                    alt="Festive Banner" 
                                    className="w-full h-full object-cover"
                                    referrerPolicy="no-referrer"
                                />
                            </AnimatePresence>
                        </div>

                        {/* Pagination Dots */}
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 pt-10">
                            {bannerImages.map((_, i) => (
                                <div 
                                    key={i}
                                    onClick={() => setCurrentBannerIndex(i)}
                                    className={`h-1.5 transition-all duration-300 rounded-full cursor-pointer ${currentBannerIndex === i ? 'w-4 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/60'}`} 
                                />
                            ))}
                        </div>
                    </div>
                 </div>

                 {/* Select Platform Section */}
                 <div className="px-4 pb-2 space-y-3">
                    <h3 className="text-lg font-black text-gray-900 border-l-[4px] border-blue-600 pl-3">Select Platform</h3>
                    <div className="grid grid-cols-3 gap-4">
                        {platforms.map(p => {
                            const Icon = p.icon;
                            const isActive = selectedPlatform === p.id;
                            return (
                                <button 
                                    key={p.id} 
                                    onClick={() => {
                                        setSelectedPlatform(p.id);
                                        setSelectedCategory(null);
                                        setSelectedServiceId(null);
                                        setOrderQuantity('');
                                        setOrderLink('');
                                        setSearchQuery('');
                                    }}
                                    className={`p-3 rounded-[20px] flex flex-col items-center justify-center gap-1.5 border transition-all active:scale-95 shadow-sm ${isActive ? 'bg-blue-600 text-white border-blue-600 shadow-blue-500/20' : 'bg-white text-gray-500 border-gray-100'}`}
                                >
                                    <Icon className={`w-5 h-5 ${isActive ? 'stroke-white' : 'stroke-blue-600'}`} />
                                    <span className="text-[9px] font-black uppercase tracking-tighter">{p.name}</span>
                                </button>
                            );
                        })}
                    </div>
                 </div>

                 {/* Create New Order Form */}
                 <div className="mx-4 p-5 bg-white rounded-[32px] border border-smm-border shadow-sm space-y-6">
                    <h3 className="text-xl font-black text-gray-900 leading-tight">Create New Order</h3>
                    
                    <div className="space-y-6">
                        <div className="space-y-3">
                             <label className="text-[12px] font-black text-gray-500 uppercase tracking-widest pl-1">Search Service / Category / Service ID</label>
                             <div className="relative">
                                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-300" />
                                <input 
                                    type="text" 
                                    placeholder="Type service id, category name or se" 
                                    className="w-full bg-gray-50 border border-gray-100 rounded-[28px] py-5 pl-14 pr-8 text-sm font-bold shadow-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-gray-300"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                             </div>
                        </div>

                        {/* Custom Category Selection */}
                        <div className="space-y-3">
                            <label className="text-[12px] font-black text-gray-500 uppercase tracking-widest pl-1">Category</label>
                            <div className="relative">
                                <button 
                                    onClick={() => setOpenDropdown(openDropdown === 'category' ? null : 'category')}
                                    className={`w-full bg-white border-2 ${openDropdown === 'category' ? 'border-blue-500 shadow-lg shadow-blue-500/10' : 'border-blue-500/20'} rounded-[28px] py-5 pl-14 pr-8 text-sm font-bold shadow-sm outline-none transition-all flex items-center text-left`}
                                >
                                    <div className="absolute left-4">
                                        {(() => {
                                            const cat = CATEGORIES.find(c => c.id === selectedCategory);
                                            const Icon = cat ? PlatformIcons[cat.platform] : (selectedPlatform !== 'all' ? PlatformIcons[selectedPlatform] : Search);
                                            return <Icon className="w-5 h-5 text-blue-500" />;
                                        })()}
                                    </div>
                                    <span className={selectedCategory ? 'text-gray-900' : 'text-gray-400'}>
                                        {CATEGORIES.find(c => c.id === selectedCategory)?.name || 'Select Category'}
                                    </span>
                                    <ChevronRight className={`absolute right-5 w-5 h-5 text-gray-400 transition-transform duration-300 ${openDropdown === 'category' ? '-rotate-90' : 'rotate-90'}`} />
                                </button>

                                <AnimatePresence>
                                    {openDropdown === 'category' && (
                                        <motion.div 
                                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                            className="absolute left-0 right-0 top-full mt-2 bg-white border border-smm-border rounded-[32px] shadow-2xl z-[100] max-h-[350px] overflow-y-auto p-2 space-y-1"
                                        >
                                            {CATEGORIES.filter(c => selectedPlatform === 'all' || c.platform === selectedPlatform).map(cat => {
                                                const Icon = PlatformIcons[cat.platform] || Search;
                                                const isSelected = selectedCategory === cat.id;
                                                return (
                                                    <button 
                                                        key={cat.id}
                                                        onClick={() => {
                                                            setSelectedCategory(cat.id);
                                                            setSelectedServiceId(null);
                                                            setOpenDropdown(null);
                                                        }}
                                                        className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                                                    >
                                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isSelected ? 'bg-blue-600 text-white' : 'bg-gray-50 text-blue-500'}`}>
                                                            <Icon className="w-5 h-5" />
                                                        </div>
                                                        <div className="flex-1 text-left">
                                                            <div className="flex items-center gap-2">
                                                                <span className={`text-sm font-black ${isSelected ? 'text-blue-600' : 'text-gray-900'}`}>{cat.name}</span>
                                                                <span className="bg-blue-600 text-white text-[7px] px-1.5 py-0.5 rounded font-black">NEW</span>
                                                            </div>
                                                        </div>
                                                        {isSelected && <div className="w-2 h-2 bg-blue-600 rounded-full" />}
                                                    </button>
                                                );
                                            })}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Custom Service Selection */}
                        {selectedCategory && (
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest pl-1">Service</label>
                                <div className="relative">
                                    <button 
                                        onClick={() => setOpenDropdown(openDropdown === 'service' ? null : 'service')}
                                        className={`w-full bg-white border-2 ${openDropdown === 'service' ? 'border-blue-500 shadow-lg shadow-blue-500/10' : 'border-blue-500/20'} rounded-2xl py-4 pl-12 pr-6 text-sm font-bold shadow-sm outline-none transition-all flex items-center text-left`}
                                    >
                                        <div className="absolute left-4">
                                            {(() => {
                                                const service = SERVICES.find(s => s.id === selectedServiceId);
                                                const cat = CATEGORIES.find(c => c.id === selectedCategory);
                                                const platform = service?.platform || cat?.platform || selectedPlatform;
                                                const Icon = PlatformIcons[platform] || Search;
                                                return <Icon className="w-5 h-5 text-blue-500" />;
                                            })()}
                                        </div>
                                        <span className={selectedServiceId ? 'text-gray-900' : 'text-gray-400'}>
                                            {SERVICES.find(s => s.id === selectedServiceId)?.name || 'Select Service'}
                                        </span>
                                        <ChevronRight className={`absolute right-5 w-5 h-5 text-gray-400 transition-transform duration-300 ${openDropdown === 'service' ? '-rotate-90' : 'rotate-90'}`} />
                                    </button>

                                    <AnimatePresence>
                                        {openDropdown === 'service' && (
                                            <motion.div 
                                                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                                className="absolute left-0 right-0 top-full mt-2 bg-white border border-smm-border rounded-[32px] shadow-2xl z-[100] max-h-[350px] overflow-y-auto p-2 space-y-1"
                                            >
                                                {SERVICES.filter(s => s.category === selectedCategory).map(service => {
                                                    const cat = CATEGORIES.find(c => c.id === selectedCategory);
                                                    const Icon = PlatformIcons[cat?.platform || 'telegram'] || Search;
                                                    const isSelected = selectedServiceId === service.id;
                                                    return (
                                                        <button 
                                                            key={service.id}
                                                            onClick={() => {
                                                                setSelectedServiceId(service.id);
                                                                setOpenDropdown(null);
                                                            }}
                                                            className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                                                        >
                                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isSelected ? 'bg-blue-600 text-white' : 'bg-gray-50 text-blue-500'}`}>
                                                                <Icon className="w-5 h-5" />
                                                            </div>
                                                            <div className="flex-1 text-left">
                                                                <div className="flex items-center gap-2 flex-wrap">
                                                                    <span className={`text-sm font-black leading-tight ${isSelected ? 'text-blue-600' : 'text-gray-900'}`}>{service.name}</span>
                                                                    <span className="bg-blue-600 text-white text-[7px] px-1.5 py-0.5 rounded font-black shrink-0">NEW</span>
                                                                </div>
                                                                <div className="flex items-center gap-2 mt-1">
                                                                    <span className="text-[10px] font-bold text-gray-400">ID: {service.id}</span>
                                                                    <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 rounded">৳{service.pricePer1000.toFixed(2)}/1000</span>
                                                                </div>
                                                            </div>
                                                            {isSelected && <div className="w-2 h-2 bg-blue-600 rounded-full shrink-0" />}
                                                        </button>
                                                    );
                                                })}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        )}

                        {selectedServiceId && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="p-4 bg-blue-50/50 border border-blue-100/50 rounded-2xl space-y-2">
                                <div className="flex items-start gap-2">
                                    <AlertTriangle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                                    <div>
                                        <h5 className="text-[11px] font-black text-gray-900 uppercase">Service Description</h5>
                                        <p className="text-[10px] text-gray-600 font-bold leading-relaxed mt-1">
                                            🔥 যখন সার্ভিসের ডিমান্ড বেশি হবে তখন অনেক সময় একটু দেরিতে কমপ্লিট হতে পারে। 🔥 একই লিংকে একসাথে দুইটি অর্ডার করবেন ন... Tap to read more
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest pl-1">Post / Link</label>
                            <input 
                                type="text" 
                                placeholder="Enter post link" 
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-sm font-bold shadow-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-gray-300"
                                value={orderLink}
                                onChange={(e) => setOrderLink(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest pl-1">Quantity</label>
                            <input 
                                type="number" 
                                placeholder="Enter quantity" 
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-sm font-bold shadow-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-gray-300"
                                value={orderQuantity}
                                onChange={(e) => setOrderQuantity(e.target.value)}
                            />
                        </div>

                        <div className="p-6 bg-gray-50/50 border border-gray-100 rounded-[32px] space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-gray-500">Selected Service</span>
                                <span className="text-xs font-black text-blue-600 max-w-[150px] text-right truncate">
                                    {selectedService ? selectedService.name : 'None'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-gray-500">Minimum Quantity</span>
                                <span className="text-xs font-black text-blue-600">{selectedService ? selectedService.min : 0}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-gray-500">Rate / 1000</span>
                                <span className="text-xs font-black text-blue-600">৳{selectedService ? selectedService.pricePer1000.toFixed(4) : '0.0000'}</span>
                            </div>
                            <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                                <span className="text-xs font-bold text-gray-500">Total Charge</span>
                                <span className="text-lg font-black text-blue-600">৳{selectedService && orderQuantity ? (selectedService.pricePer1000 * parseInt(orderQuantity) / 1000).toFixed(4) : '0.0000'}</span>
                            </div>
                        </div>

                        <button 
                            onClick={handlePlaceOrder}
                            className="w-full bg-blue-600 text-white font-black py-4 rounded-[20px] shadow-lg shadow-blue-500/20 active:scale-95 transition-all text-xs uppercase tracking-widest"
                        >
                            Place Order
                        </button>
                    </div>
                 </div>

                 {/* Custom Background Icons (From Screenshot) */}
                 <div className="fixed inset-0 pointer-events-none z-0 opacity-10 overflow-hidden">
                    <Zap className="absolute top-[20%] right-[-20px] w-40 h-40 text-orange-400 rotate-12" />
                    <ShoppingBag className="absolute bottom-[10%] left-[-20px] w-40 h-40 text-blue-400 -rotate-12" />
                 </div>
            </motion.div>
          )}

          {activeTab === 'referral' && (
            <motion.div 
              key="referral"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6 pb-24"
            >
              {/* Referral Header - Match Screenshot */}
              <div className="mx-5 mt-6 p-8 bg-gradient-to-br from-[#1E90FF] to-[#1E6BFF] rounded-[44px] text-white shadow-xl relative overflow-hidden">
                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-10">
                        <div>
                            <h2 className="text-3xl font-black tracking-tight">Referral Program</h2>
                            <p className="text-blue-100 text-xs opacity-90 mt-1">Deposit 5% bonus • Order 1% bonus</p>
                        </div>
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center border border-white/30">
                            <PlusCircle className="w-8 h-8 text-white" />
                        </div>
                    </div>

</div>
              </div>

              {/* Refer Leaderboard Banner */}
              <div className="mx-4 p-1 bg-gradient-to-r from-gray-900 to-blue-900 rounded-[28px] shadow-lg">
                <div className="bg-gradient-to-r from-gray-900 via-blue-800 to-blue-600 rounded-[26px] p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-[18px] flex items-center justify-center border border-white/10">
                            <Gift className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-white leading-tight">Refer Leaderboard</h3>
                            <p className="text-[10px] font-bold text-blue-100 opacity-80 mt-1">Top 10 referrer list দেখতে এখানে click করুন</p>
                        </div>
                    </div>
                    <button className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20 active:scale-95 transition-all">
                        <ChevronRight className="w-5 h-5 text-white" />
                    </button>
                </div>
              </div>

              {/* Your Referral Details */}
              <div className="mx-4 bg-white/50 p-5 rounded-[28px] border border-smm-border/50 space-y-5">
                <h3 className="text-lg font-black text-[#1a1a1a]">Your Referral Details</h3>
                
                <div className="bg-gray-50/50 p-4 rounded-[20px] border border-gray-100 space-y-3">
                    <div>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 pl-1 opacity-60">Referral Code</p>
                        <p className="text-lg font-black text-gray-900 pl-1">7228630025</p>
                    </div>
                    <button className="w-full bg-blue-600 text-white font-black py-3 rounded-[14px] shadow-lg shadow-blue-500/20 active:scale-95 transition-all text-xs tracking-widest uppercase">
                        Copy Code
                    </button>
                </div>

                <div className="bg-gray-50/50 p-4 rounded-[20px] border border-gray-100 space-y-3">
                    <div>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 pl-1 opacity-60">Referral Link</p>
                        <p className="text-[12px] font-bold text-gray-900 pl-1 break-all leading-relaxed">https://t.me/mjboosttop_bot/app?startapp=7228630025</p>
                    </div>
                    <div className="space-y-2">
                        <button className="w-full bg-blue-600 text-white font-black py-3 rounded-[14px] shadow-lg shadow-blue-500/20 active:scale-95 transition-all text-xs tracking-widest uppercase">
                            Copy Link
                        </button>
                        <button className="w-full bg-blue-50 text-blue-600 font-black py-3 rounded-[14px] active:scale-95 transition-all flex items-center justify-center gap-2 text-xs tracking-widest uppercase">
                            Share
                            <Share2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
              </div>

              {/* Referral History Section */}
              <div className="mx-4 space-y-3">
                <h3 className="text-lg font-black text-[#1a1a1a] pl-2">Referral History</h3>
                <div className="bg-white/50 p-6 rounded-[28px] border border-smm-border/50 border-dashed flex flex-col items-center justify-center text-center">
                    <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-3">
                        <History className="w-6 h-6 text-gray-300" />
                    </div>
                    <p className="text-xs font-bold text-gray-400">No referral bonus history found</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Validation Modal */}
          <AnimatePresence>
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-white rounded-[28px] p-6 w-full max-w-xs shadow-2xl relative overflow-hidden"
                    >
                        <button onClick={() => setShowModal(false)} className="absolute right-4 top-4 p-2 bg-gray-50 rounded-full text-gray-400 z-10">
                            <ChevronRight className="w-4 h-4 rotate-45" />
                        </button>
                        
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-red-50 rounded-[20px] flex items-center justify-center mb-4">
                                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                    <AlertTriangle className="w-6 h-6 text-red-500" />
                                </div>
                            </div>

                            {modalType === 'category-missing' ? (
                                <>
                                    <h3 className="text-xl font-black text-gray-900 mb-1 leading-tight">Category Missing</h3>
                                    <p className="text-xs font-bold text-gray-400 leading-relaxed mb-6">আগে একটি category select করুন।</p>
                                </>
                            ) : modalType === 'service-missing' ? (
                                <>
                                    <h3 className="text-xl font-black text-gray-900 mb-1 leading-tight">Service Missing</h3>
                                    <p className="text-xs font-bold text-gray-400 leading-relaxed mb-6">আগে একটি service select করুন।</p>
                                </>
                            ) : modalType === 'balance' ? (
                                <>
                                    <h3 className="text-xl font-black text-gray-900 mb-1 leading-tight">Insufficient Balance</h3>
                                    <p className="text-xs font-bold text-gray-400 leading-relaxed max-w-[220px] mb-6">
                                        আপনার balance ৳0.0000। এই order-এর জন্য ৳{selectedService && orderQuantity ? (selectedService.pricePer1000 * parseInt(orderQuantity) / 1000).toFixed(4) : '0.0000'} লাগবে।
                                    </p>
                                </>
                            ) : modalType === 'transaction-missing' ? (
                                <>
                                    <h3 className="text-xl font-black text-gray-900 mb-1 leading-tight">Transaction ID Required</h3>
                                    <p className="text-xs font-bold text-gray-400 leading-relaxed mb-6">Please enter transaction id.</p>
                                </>
                            ) : modalType === 'amount-missing' ? (
                                <>
                                    <h3 className="text-xl font-black text-gray-900 mb-1 leading-tight">Amount Required</h3>
                                    <p className="text-xs font-bold text-gray-400 leading-relaxed mb-6">Please enter a valid amount.</p>
                                </>
                            ) : modalType === 'gateway-missing' ? (
                                <>
                                    <h3 className="text-xl font-black text-gray-900 mb-1 leading-tight">Gateway Required</h3>
                                    <p className="text-xs font-bold text-gray-400 leading-relaxed mb-6">আগে একটি Payment Gateway select করুন।</p>
                                </>
                            ) : (
                                <>
                                    <h3 className="text-xl font-black text-gray-900 mb-1 leading-tight">Link Required</h3>
                                    <p className="text-xs font-bold text-gray-400 leading-relaxed mb-6">Order করার জন্য valid link দিতে হবে।</p>
                                </>
                            )}
                            
                            <button 
                                onClick={() => setShowModal(false)}
                                className="w-full bg-blue-600 text-white font-black py-4 rounded-[20px] shadow-xl shadow-blue-500/20 active:scale-95 transition-all text-sm uppercase tracking-widest"
                            >
                                Close
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
          </AnimatePresence>
        </AnimatePresence>
      </main>

      {/* Floating Bottom Navigation - Match Screenshot */}
      <nav className="fixed bottom-6 left-5 right-5 h-20 bg-white/95 backdrop-blur-xl border border-white/50 rounded-full shadow-[0_20px_40px_rgba(0,0,0,0.1)] flex items-center justify-around z-50 px-2 overflow-visible">
        <NavIconButton active={activeTab === 'new-order'} onClick={() => setActiveTab('new-order')} icon={ShoppingBag} label="New Order" />
        <NavIconButton active={activeTab === 'history'} onClick={() => setActiveTab('history')} icon={History} label="History" />
        
        {/* Center Button - Deposit (As per latest screenshot) */}
        <div className="relative -top-6 translate-y-[-2px]">
            <button 
                onClick={() => setActiveTab('deposit')}
                className={`w-16 h-16 rounded-[24px] flex flex-col items-center justify-center gap-1 transition-all duration-300 ${activeTab === 'deposit' ? 'bg-blue-600 text-white shadow-[0_12px_24px_rgba(37,99,235,0.4)] scale-110' : 'bg-white text-blue-500 shadow-xl border border-blue-50'}`}
            >
                <HandCoins className={`w-7 h-7 ${activeTab === 'deposit' ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                <span className="text-[7px] font-black uppercase tracking-tighter">Deposit</span>
            </button>
        </div>

        <NavIconButton active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} icon={User} label="Profile" />
        <NavIconButton active={activeTab === 'chat'} onClick={() => setActiveTab('chat')} icon={MessageCircle} label="Chat" />
      </nav>
    </div>
  );
}

function StatBox({ label, value, full }: { label: string, value: string, full?: boolean }) {
    return (
        <div className={`${full ? 'col-span-2' : ''} bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex flex-col items-center justify-center text-center`}>
            <p className="text-[9px] font-black uppercase tracking-[2px] text-blue-100 opacity-60 mb-1">{label}</p>
            <p className="text-xl font-black">{value}</p>
        </div>
    )
}

function NavIconButton({ active, onClick, icon: Icon, label }: { active: boolean, onClick: () => void, icon: LucideIcon, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center gap-1.5 transition-all w-14 ${active ? 'text-blue-600 scale-105' : 'text-gray-400 hover:text-gray-600'}`}
    >
      <Icon className={`w-5 h-5 ${active ? 'stroke-[2.5px]' : 'stroke-2'}`} />
      <span className="text-[8px] font-black uppercase tracking-tight">{label}</span>
      {active && <motion.div layoutId="nav-dot" className="w-1 h-1 bg-blue-600 rounded-full" />}
    </button>
  );
}

function InfoCard({ label, value }: { label: string, value: string }) {
    return (
        <div className="bg-white/50 backdrop-blur-sm p-5 rounded-3xl border border-smm-border shadow-sm">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
            <p className="text-sm font-black text-gray-900 leading-tight">{value}</p>
        </div>
    )
}

function InfoItem({ label, value, icon: Icon }: { label: string, value: string, icon: LucideIcon }) {
    return (
        <div className="flex items-center gap-4 group">
            <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors shrink-0">
                <Icon className="w-5 h-5" />
            </div>
            <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">{label}</p>
                <p className="text-sm font-black text-gray-900 leading-tight">{value}</p>
            </div>
        </div>
    )
}

function CategoryCard({ cat, onClick }: { cat: Category, onClick: () => void, key?: string | number }) {
    const Icon = PlatformIcons[cat.platform] || Send;
    return (
        <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className="w-full bg-white p-6 rounded-3xl border border-smm-border flex items-center gap-5 group transition-all"
        >
            <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                <Icon className="w-7 h-7 text-gray-400 group-hover:text-blue-500 transition-colors" />
            </div>
            <div className="flex-1 text-left">
                <h4 className="font-black text-gray-900 leading-tight">{cat.name}</h4>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Quality Services Available</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500 transition-colors" />
        </motion.button>
    )
}

function StatListCard({ icon: Icon, label, value, color }: { icon: LucideIcon, label: string, value: string, color: string }) {
    return (
        <div className="bg-white p-5 rounded-3xl border border-smm-border shadow-sm flex items-center justify-between group active:scale-[0.98] transition-all">
            <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color}`}>
                    <Icon className="w-6 h-6 stroke-[2.5px]" />
                </div>
                <div className="flex flex-col">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
                    <p className="text-xl font-black text-gray-900">{value}</p>
                </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-200" />
        </div>
    )
}

function ActionMenuCard({ icon: Icon, title, desc, onClick }: { icon: LucideIcon, title: string, desc: string, onClick?: () => void }) {
    return (
        <button 
            onClick={onClick}
            className="w-full bg-white p-5 rounded-3xl border border-smm-border shadow-sm flex items-center gap-5 group active:scale-[0.98] transition-all text-left"
        >
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Icon className="w-7 h-7 stroke-[2.5px]" />
            </div>
            <div className="flex-1">
                <h4 className="font-black text-gray-900 leading-tight">{title}</h4>
                <p className="text-[10px] text-gray-400 font-bold leading-relaxed mt-0.5">{desc}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
        </button>
    )
}
