import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  HeartHandshake, MapPin, Clock, Package, CheckCircle2, ShieldAlert,
  Search, Plus, Leaf, Recycle, Send, AlertTriangle, Phone
} from 'lucide-react';

import api from '../utils/api';
import toast from 'react-hot-toast';
import { Card } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Input, Select } from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import { pageForwardSlide, staggerContainer, staggerItem } from '../utils/animations';

export default function RescuePage() {
  const [activeTab, setActiveTab] = useState('surplus'); // surplus, post, orgs, mine
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [myListings, setMyListings] = useState([]);
  const [orgs, setOrgs] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [safetyConfirmed, setSafetyConfirmed] = useState(false);
  const [formData, setFormData] = useState({
    food_name: '', food_category: 'Cooked Food', quantity: '', unit: 'kg', 
    available_until: '', is_vegetarian: true, packaging: '', description: '', location_area: ''
  });

  const fetchData = async () => {
    try {
      const [listRes, meRes, orgRes, notifRes] = await Promise.all([
        api.get('/rescue/listings'),
        api.get('/rescue/listings/me'),
        api.get('/rescue/organizations'),
        api.get('/rescue/notifications')
      ]);
      setListings(listRes.data);
      setMyListings(meRes.data);
      setOrgs(orgRes.data);
      setNotifications(notifRes.data);
    } catch (e) {
      toast.error('Failed to load rescue network data');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePost = async (e) => {
    e.preventDefault();
    if (!safetyConfirmed) return toast.error('You must confirm food safety guidelines.');
    
    // Convert datetime-local to ISO
    const payload = {
        ...formData,
        available_until: new Date(formData.available_until).toISOString()
    };

    setLoading(true);
    try {
      await api.post('/rescue/listings', payload);
      toast.success('Surplus listing published!');
      setActiveTab('mine');
      fetchData();
    } catch (e) {
      toast.error('Failed to publish listing');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (listingId, orgId) => {
    try {
      await api.post(`/rescue/listings/${listingId}/accept?org_id=${orgId}`);
      toast.success('Listing accepted (simulated organization login).');
      fetchData();
    } catch (e) {
      toast.error('Failed to accept listing');
    }
  };
  
  const updateStatus = async (listingId, status) => {
    try {
      await api.put(`/rescue/listings/${listingId}/status`, { status });
      toast.success('Status updated.');
      fetchData();
    } catch (e) {
      toast.error('Failed to update status');
    }
  };

  return (
    <motion.div variants={pageForwardSlide} initial="initial" animate="animate" exit="exit" className="max-w-[1600px] mx-auto min-h-[calc(100vh-100px)] flex flex-col space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-3xl font-black text-[var(--text-primary)] tracking-tight flex items-center gap-3">
            <HeartHandshake className="w-8 h-8 text-emerald-500" /> FoodCycle Rescue
          </h1>
          <p className="text-[var(--text-muted)] font-medium mt-1">Connect safe surplus food with nearby verified rescue organizations.</p>
        </div>
      </div>

      {/* Nav Tabs */}
      <div className="flex items-center gap-2 border-b border-[var(--border)] pb-2 overflow-x-auto">
        <button onClick={() => setActiveTab('surplus')} className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors whitespace-nowrap ${activeTab === 'surplus' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30' : 'text-[var(--text-muted)] hover:bg-[var(--surface-hover)]'}`}>Available Surplus</button>
        <button onClick={() => setActiveTab('post')} className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === 'post' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30' : 'text-[var(--text-muted)] hover:bg-[var(--surface-hover)]'}`}><Plus className="w-4 h-4"/> Publish Surplus</button>
        <button onClick={() => setActiveTab('mine')} className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors whitespace-nowrap ${activeTab === 'mine' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30' : 'text-[var(--text-muted)] hover:bg-[var(--surface-hover)]'}`}>My Listings & Status</button>
        <button onClick={() => setActiveTab('orgs')} className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors whitespace-nowrap ${activeTab === 'orgs' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30' : 'text-[var(--text-muted)] hover:bg-[var(--surface-hover)]'}`}>Nearby Organizations</button>
        <button onClick={() => setActiveTab('notifs')} className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors whitespace-nowrap ${activeTab === 'notifs' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30' : 'text-[var(--text-muted)] hover:bg-[var(--surface-hover)]'}`}>Notifications {notifications.length > 0 && <span className="ml-2 bg-brand-500 text-white rounded-full px-2 py-0.5 text-[10px]">{notifications.length}</span>}</button>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        
        {/* POST TAB */}
        {activeTab === 'post' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7">
              <Card className="p-6 rounded-3xl border-[var(--border)] relative overflow-hidden group shadow-2xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl -mr-10 -mt-10" />
                <h3 className="text-lg font-bold text-[var(--text-primary)] uppercase tracking-wider mb-6 flex items-center gap-2 relative z-10"><Package className="w-5 h-5 text-emerald-500"/> Listing Details</h3>
                
                <form onSubmit={handlePost} className="space-y-4 relative z-10">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1.5">Food Name</label>
                      <Input required value={formData.food_name} onChange={e => setFormData({...formData, food_name: e.target.value})} placeholder="e.g. Mixed Veg Curry" className="bg-[var(--surface-hover)]" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1.5">Category</label>
                      <Select required value={formData.food_category} onChange={e => setFormData({...formData, food_category: e.target.value})} className="bg-[var(--surface-hover)]">
                        <option value="Cooked Food">Cooked Food</option>
                        <option value="Raw Vegetables">Raw Vegetables</option>
                        <option value="Baked Goods">Baked Goods</option>
                        <option value="Packaged">Packaged</option>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1.5">Quantity</label>
                      <Input type="number" step="0.1" required value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} placeholder="20" className="bg-[var(--surface-hover)]" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1.5">Unit</label>
                      <Select value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})} className="bg-[var(--surface-hover)]">
                        <option value="kg">kg</option>
                        <option value="L">L</option>
                        <option value="portions">Portions</option>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1.5">Available Until</label>
                      <Input type="datetime-local" required value={formData.available_until} onChange={e => setFormData({...formData, available_until: e.target.value})} className="bg-[var(--surface-hover)]" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1.5">Location Area (Approximate)</label>
                      <Input icon={MapPin} required value={formData.location_area} onChange={e => setFormData({...formData, location_area: e.target.value})} placeholder="e.g. Downtown Campus" className="bg-[var(--surface-hover)]" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1.5">Packaging</label>
                      <Input required value={formData.packaging} onChange={e => setFormData({...formData, packaging: e.target.value})} placeholder="e.g. 5x Stainless Steel Trays" className="bg-[var(--surface-hover)]" />
                    </div>
                  </div>
                  
                  <div className="flex gap-4 items-center mt-2 p-3 bg-[var(--surface-hover)] rounded-xl border border-[var(--border)]">
                    <label className="flex items-center gap-2 cursor-pointer text-sm font-bold text-[var(--text-secondary)]">
                      <input type="checkbox" checked={formData.is_vegetarian} onChange={e => setFormData({...formData, is_vegetarian: e.target.checked})} className="rounded text-brand-500 bg-[var(--surface)] border-[var(--border)]"/>
                      Vegetarian Only
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-sm font-bold text-[var(--text-secondary)]">
                      <input type="checkbox" checked={formData.requires_pickup} onChange={e => setFormData({...formData, requires_pickup: e.target.checked})} className="rounded text-brand-500 bg-[var(--surface)] border-[var(--border)]"/>
                      Requires Pickup
                    </label>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1.5">Description (Optional)</label>
                    <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-[var(--surface-hover)] border-[var(--border)] rounded-xl p-3 text-sm text-[var(--text-primary)]" rows="2" placeholder="Any specific instructions..." />
                  </div>

                  <Button type="submit" size="lg" className="w-full h-12 mt-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xl shadow-emerald-500/20 text-sm" disabled={loading}>
                    {loading ? 'Publishing...' : 'Publish Rescue Listing'}
                  </Button>
                </form>
              </Card>
            </div>
            
            <div className="lg:col-span-5">
              <Card className="p-6 rounded-3xl border-amber-500/30 bg-amber-500/5 shadow-xl relative overflow-hidden">
                <div className="flex items-center gap-2 mb-6">
                  <ShieldAlert className="w-6 h-6 text-amber-500" />
                  <h3 className="text-lg font-black text-amber-500 uppercase tracking-wider">Food Safety Checklist</h3>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="p-3 bg-[var(--surface)] rounded-xl border border-[var(--border)] text-sm text-[var(--text-secondary)]">
                    <span className="font-bold text-[var(--text-primary)]">Temperature Control:</span> Food must have been kept above 60°C or below 5°C since preparation.
                  </div>
                  <div className="p-3 bg-[var(--surface)] rounded-xl border border-[var(--border)] text-sm text-[var(--text-secondary)]">
                    <span className="font-bold text-[var(--text-primary)]">Contamination Free:</span> Food must not have been served to the public (e.g., left on buffet plates). Only unserved kitchen surplus is eligible.
                  </div>
                  <div className="p-3 bg-[var(--surface)] rounded-xl border border-[var(--border)] text-sm text-[var(--text-secondary)]">
                    <span className="font-bold text-[var(--text-primary)]">Expiration:</span> Do not publish expired items. 
                  </div>
                </div>

                <div className="p-4 border border-amber-500/30 bg-amber-500/10 rounded-xl mb-4">
                  <p className="text-xs font-bold text-amber-500 mb-2 flex items-center gap-2"><AlertTriangle className="w-4 h-4"/> LEGAL DISCLAIMER</p>
                  <p className="text-xs text-[var(--text-muted)] font-medium leading-relaxed">
                    FoodCycle AI acts strictly as a communication platform. We do not make medical or food-safety guarantees. Final food-safety responsibility remains exclusively with the donor and the receiving authorized food operator.
                  </p>
                </div>

                <label className="flex items-center gap-3 cursor-pointer p-4 bg-[var(--surface)] rounded-xl border border-[var(--border)] hover:border-amber-500/50 transition-colors">
                  <input type="checkbox" checked={safetyConfirmed} onChange={e => setSafetyConfirmed(e.target.checked)} className="w-5 h-5 rounded text-amber-500 bg-[var(--surface)] border-[var(--border)]"/>
                  <span className="text-sm font-bold text-[var(--text-primary)]">I confirm this food is safe for human consumption and complies with the checklist.</span>
                </label>
              </Card>
            </div>
          </div>
        )}

        {/* AVAILABLE SURPLUS TAB */}
        {activeTab === 'surplus' && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {listings.map(l => (
              <Card key={l.id} className="p-5 rounded-3xl border-[var(--border)] hover:border-emerald-500/30 transition-all shadow-lg flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-black text-[var(--text-primary)]">{l.food_name}</h3>
                    <p className="text-sm font-medium text-[var(--text-muted)]">{l.food_category} • {l.is_vegetarian ? 'Veg' : 'Non-Veg'}</p>
                  </div>
                  <Badge variant="success" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/30">{l.status}</Badge>
                </div>
                
                <div className="space-y-2 mb-6 flex-1">
                  <p className="text-sm flex items-center gap-2 text-[var(--text-secondary)]"><Package className="w-4 h-4 text-emerald-500"/> {l.quantity} {l.unit} ({l.packaging})</p>
                  <p className="text-sm flex items-center gap-2 text-[var(--text-secondary)]"><MapPin className="w-4 h-4 text-emerald-500"/> {l.location_area}</p>
                  <p className="text-sm flex items-center gap-2 text-[var(--text-secondary)]"><Clock className="w-4 h-4 text-amber-500"/> Until {new Date(l.available_until).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                </div>
                
                {orgs.length > 0 && l.status === 'POSTED' && (
                  <div className="border-t border-[var(--border)] pt-4 mt-auto">
                    <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase mb-2">Simulate Org Acceptance:</p>
                    <Select onChange={(e) => handleAccept(l.id, e.target.value)} className="w-full text-xs h-8" defaultValue="">
                      <option value="" disabled>Select NGO to claim...</option>
                      {orgs.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                    </Select>
                  </div>
                )}
              </Card>
            ))}
            {listings.length === 0 && (
              <div className="col-span-full py-20 flex flex-col items-center justify-center opacity-50">
                <Leaf className="w-16 h-16 text-[var(--text-muted)] mb-4" />
                <p className="font-bold">No active surplus listings right now.</p>
              </div>
            )}
          </div>
        )}

        {/* MY LISTINGS TAB */}
        {activeTab === 'mine' && (
          <div className="space-y-4">
            {myListings.map(l => (
              <Card key={l.id} className="p-5 rounded-3xl border-[var(--border)] flex flex-col md:flex-row gap-6 justify-between items-center bg-[var(--surface-hover)]">
                <div>
                  <h3 className="text-lg font-black text-[var(--text-primary)]">{l.food_name} <span className="text-sm font-medium text-[var(--text-muted)] ml-2">{l.quantity} {l.unit}</span></h3>
                  <p className="text-sm font-medium text-[var(--text-secondary)] mt-1"><MapPin className="inline w-3 h-3 mr-1"/> {l.location_area} • <Clock className="inline w-3 h-3 mx-1"/> Expires {new Date(l.available_until).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-4">
                  <Badge className={`
                    ${l.status === 'POSTED' ? 'bg-blue-500/10 text-blue-500 border-blue-500/30' : ''}
                    ${l.status === 'CLAIMED' ? 'bg-amber-500/10 text-amber-500 border-amber-500/30' : ''}
                    ${l.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30' : ''}
                  `}>
                    {l.status}
                  </Badge>
                  
                  {l.status === 'CLAIMED' && (
                    <Button onClick={() => updateStatus(l.id, 'COMPLETED')} className="bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg text-xs h-8 px-4 rounded-xl">
                      Mark as Collected
                    </Button>
                  )}
                </div>
              </Card>
            ))}
            {myListings.length === 0 && (
              <p className="text-center text-[var(--text-muted)] py-10">You have no listings.</p>
            )}
          </div>
        )}

        {/* ORGS TAB */}
        {activeTab === 'orgs' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {orgs.map(o => (
              <Card key={o.id} className="p-6 rounded-3xl border-[var(--border)] shadow-md flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-black text-[var(--text-primary)]">{o.name}</h3>
                    {o.is_verified && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                  </div>
                  <p className="text-sm font-bold text-brand-500 mb-4">{o.org_type}</p>
                  
                  <div className="space-y-2 text-sm text-[var(--text-secondary)]">
                    <p className="flex items-center gap-2"><MapPin className="w-4 h-4"/> Serves: {o.service_area}</p>
                    <p className="flex items-center gap-2"><Phone className="w-4 h-4"/> {o.contact_phone}</p>
                  </div>
                </div>
                <Button className="bg-[var(--surface-hover)] border border-[var(--border)] text-[var(--text-primary)] shadow-sm">Contact</Button>
              </Card>
            ))}
          </div>
        )}

        {/* NOTIFICATIONS TAB */}
        {activeTab === 'notifs' && (
          <div className="space-y-4 max-w-3xl">
            {notifications.map(n => (
              <Card key={n.id} className="p-5 rounded-2xl border-[var(--border)] shadow-sm bg-[var(--surface-hover)] flex gap-4 items-start">
                <div className="p-2 bg-brand-500/10 text-brand-500 rounded-full shrink-0">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[var(--text-primary)] font-medium text-sm leading-relaxed">{n.message}</p>
                  <p className="text-xs text-[var(--text-muted)] font-bold mt-2">{new Date(n.created_at).toLocaleString()}</p>
                </div>
              </Card>
            ))}
            {notifications.length === 0 && (
              <p className="text-center text-[var(--text-muted)] py-10">No notifications.</p>
            )}
          </div>
        )}
        
      </div>
    </motion.div>
  );
}
