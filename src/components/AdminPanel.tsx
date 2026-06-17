import React, { useState, useEffect } from 'react';
import { X, Save, Plus, Trash2, Image as ImageIcon, Settings, ShoppingBag, List } from 'lucide-react';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc, collection, getDocs, updateDoc, deleteDoc, addDoc } from 'firebase/firestore';

interface AdminPanelProps {
  onClose: () => void;
  telegramId: string;
}

export default function AdminPanel({ onClose, telegramId }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'settings' | 'categories' | 'services' | 'slider'>('settings');
  const [settings, setSettings] = useState({
    depositNumber: '',
    depositUrl: '',
    autoPaymentUrl: '',
    brandKey: '',
    notice: ''
  });
  const [categories, setCategories] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [sliderImages, setSliderImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch settings
      const settingsSnap = await getDoc(doc(db, 'settings', 'global'));
      if (settingsSnap.exists()) {
        setSettings(settingsSnap.data() as any);
      }

      // Fetch categories
      const categoriesSnap = await getDocs(collection(db, 'categories'));
      setCategories(categoriesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      // Fetch services
      const servicesSnap = await getDocs(collection(db, 'services'));
      setServices(servicesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      // Fetch slider images
      const sliderSnap = await getDocs(collection(db, 'slider_images'));
      setSliderImages(sliderSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      await setDoc(doc(db, 'settings', 'global'), settings);
      alert('Settings saved successfuly!');
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  };

  const addCategory = async () => {
    const name = prompt('Category Name:');
    if (!name) return;
    try {
      await addDoc(collection(db, 'categories'), { name, order: categories.length });
      fetchData();
    } catch (error) { console.error(error); }
  };

  const addService = async () => {
    const name = prompt('Service Name:');
    if (!name) return;
    try {
      await addDoc(collection(db, 'services'), {
        name,
        categoryId: categories[0]?.id || '',
        pricePer1000: 1,
        description: '',
        minOrder: 10,
        maxOrder: 100000,
        icon: 'tiktok'
      });
      fetchData();
    } catch (error) { console.error(error); }
  };

  const updateService = async (id: string, data: any) => {
    try {
      await updateDoc(doc(db, 'services', id), data);
    } catch (error) { console.error(error); }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-end sm:items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl h-[85vh] rounded-t-[32px] sm:rounded-[32px] overflow-hidden flex flex-col">
        <div className="p-6 border-b flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-gray-900">Admin Control Panel</h2>
            <p className="text-xs text-gray-500 font-bold">Manage your Mini App settings</p>
          </div>
          <button onClick={onClose} className="p-2 bg-gray-100 rounded-full">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex border-b bg-gray-50/50">
          <TabButton active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={Settings} label="Settings" />
          <TabButton active={activeTab === 'categories'} onClick={() => setActiveTab('categories')} icon={List} label="Categories" />
          <TabButton active={activeTab === 'services'} onClick={() => setActiveTab('services')} icon={ShoppingBag} label="Services" />
          <TabButton active={activeTab === 'slider'} onClick={() => setActiveTab('slider')} icon={ImageIcon} label="Slider" />
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'settings' && (
            <div className="space-y-4">
              <InputField label="Manual Deposit Number" value={settings.depositNumber} onChange={v => setSettings({...settings, depositNumber: v})} />
              <InputField label="Manual Deposit URL" value={settings.depositUrl} onChange={v => setSettings({...settings, depositUrl: v})} />
              <InputField label="Auto Payment URL" value={settings.autoPaymentUrl} onChange={v => setSettings({...settings, autoPaymentUrl: v})} />
              <InputField label="Brand Key" value={settings.brandKey} onChange={v => setSettings({...settings, brandKey: v})} />
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Notice</label>
                <textarea 
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-[18px] p-3 text-sm font-bold focus:border-blue-500 outline-none h-32"
                  value={settings.notice}
                  onChange={e => setSettings({...settings, notice: e.target.value})}
                />
              </div>
              <button 
                onClick={saveSettings}
                className="w-full bg-blue-600 text-white font-black py-4 rounded-[20px] flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
              >
                <Save className="w-5 h-5" /> Save All Settings
              </button>
            </div>
          )}

          {activeTab === 'categories' && (
            <div className="space-y-4">
              <button onClick={addCategory} className="w-full bg-blue-50 text-blue-600 font-black py-3 rounded-[16px] flex items-center justify-center gap-2">
                <Plus className="w-5 h-5" /> Add New Category
              </button>
              {categories.map(cat => (
                <div key={cat.id} className="p-4 bg-gray-50 rounded-[20px] flex items-center justify-between border-2 border-transparent hover:border-blue-100">
                  <span className="font-black text-gray-800">{cat.name}</span>
                  <button onClick={async () => { await deleteDoc(doc(db, 'categories', cat.id)); fetchData(); }} className="text-red-500 p-2"><Trash2 className="w-5 h-5" /></button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'services' && (
            <div className="space-y-4">
              <button onClick={addService} className="w-full bg-blue-50 text-blue-600 font-black py-3 rounded-[16px] flex items-center justify-center gap-2">
                <Plus className="w-5 h-5" /> Add New Service
              </button>
              {services.map(svc => (
                <div key={svc.id} className="p-4 bg-white border-2 border-gray-100 rounded-[24px] space-y-3">
                  <div className="flex items-center justify-between">
                    <input 
                      className="font-black text-gray-800 bg-transparent border-none outline-none flex-1"
                      value={svc.name}
                      onChange={e => updateService(svc.id, { name: e.target.value })}
                    />
                    <button onClick={async () => { await deleteDoc(doc(db, 'services', svc.id)); fetchData(); }} className="text-red-500 p-2"><Trash2 className="w-5 h-5" /></button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <InputField label="Price /1k" value={svc.pricePer1000.toString()} onChange={v => updateService(svc.id, { pricePer1000: parseFloat(v) || 0 })} />
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Category</label>
                      <select 
                        className="w-full bg-gray-50 border-2 border-gray-100 rounded-[14px] px-3 py-2 text-xs font-bold"
                        value={svc.categoryId}
                        onChange={e => updateService(svc.id, { categoryId: e.target.value })}
                      >
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon: Icon, label }: any) {
  return (
    <button onClick={onClick} className={`flex-1 p-4 flex flex-col items-center gap-1 transition-all ${active ? 'bg-white text-blue-600' : 'text-gray-400 hover:text-gray-500'}`}>
      <Icon className={`w-5 h-5 ${active ? 'stroke-[2.5px]' : 'stroke-2'}`} />
      <span className="text-[9px] font-black uppercase tracking-wider">{label}</span>
      {active && <div className="w-1 h-1 bg-blue-600 rounded-full mt-1" />}
    </button>
  );
}

function InputField({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) {
  return (
    <div className="space-y-1 flex-1">
      <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">{label}</label>
      <input 
        className="w-full bg-gray-50 border-2 border-gray-100 rounded-[18px] px-4 py-3 text-sm font-bold focus:border-blue-500 outline-none transition-all"
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  );
}
