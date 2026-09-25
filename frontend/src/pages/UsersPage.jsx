import React, { useState, useEffect } from 'react';
import {
  Search, Filter, Shield, UserX, UserCheck, Edit, Key, Download,
  RefreshCw, Users, Mail, User, X
} from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { Card } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Input, Select } from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import { motion, AnimatePresence } from 'framer-motion';
import { pageDataReveal, staggerContainer, staggerItem } from '../utils/animations';

function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />
        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative bg-[var(--surface)] border border-[var(--border)] shadow-2xl rounded-3xl w-full max-w-md overflow-hidden">
          <div className="p-5 border-b border-[var(--border)] flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
            <h3 className="font-bold text-lg text-[var(--text-primary)] uppercase tracking-wider">{title}</h3>
            <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-colors"><X className="w-5 h-5 text-[var(--text-muted)]" /></button>
          </div>
          <div className="p-6">{children}</div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  
  // Modals
  const [editUser, setEditUser] = useState(null);
  const [passUser, setPassUser] = useState(null);
  const [newRole, setNewRole] = useState('');
  const [newPass, setNewPass] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) { toast.error('Failed to load network access list'); }
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await api.put(`/users/${id}/status`, { is_active: !currentStatus });
      toast.success(`User ${currentStatus ? 'deactivated' : 'activated'} successfully`);
      fetchUsers();
    } catch (error) { toast.error('Status modification failed'); }
  };

  const handleUpdateRole = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/users/${editUser.id}/role`, { role: newRole });
      toast.success('Security clearance updated');
      setEditUser(null);
      fetchUsers();
    } catch (error) { toast.error('Role update failed'); }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/users/${passUser.id}/password`, { new_password: newPass });
      toast.success('Credentials forcefully reset');
      setPassUser(null);
      setNewPass('');
    } catch (error) { toast.error('Password reset failed'); }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.full_name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter ? u.role === roleFilter : true;
    return matchesSearch && matchesRole;
  });

  return (
    <motion.div variants={pageDataReveal} initial="initial" animate="animate" exit="exit" className="space-y-6 max-w-[1600px] mx-auto min-h-[calc(100vh-100px)] flex flex-col">
      <div className="flex items-center justify-between shrink-0 mb-4">
        <div>
          <h1 className="text-3xl font-black text-[var(--text-primary)] tracking-tight flex items-center gap-3">
            <Shield className="w-8 h-8 text-brand-500" /> Network Access
          </h1>
          <p className="text-[var(--text-muted)] font-medium mt-1">Manage platform identities, security clearances, and operational status.</p>
        </div>
      </div>

      <Card className="flex-1 overflow-hidden flex flex-col shadow-2xl rounded-3xl border-[var(--border)] bg-[var(--surface)]">
        {/* Toolbar */}
        <div className="p-4 border-b border-[var(--border)] bg-slate-50/50 dark:bg-slate-900/30 flex flex-col md:flex-row gap-4 shrink-0">
          <div className="flex-1 md:max-w-md relative group">
             <div className="absolute inset-0 bg-brand-500/5 blur-xl group-focus-within:bg-brand-500/20 transition-all rounded-full pointer-events-none" />
             <Input icon={Search} type="text" placeholder="Search identities..." value={search} onChange={(e) => setSearch(e.target.value)} className="h-12 bg-[var(--surface)] rounded-xl relative z-10" />
          </div>
          <div className="flex gap-3">
            <Select icon={Filter} value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="h-12 bg-[var(--surface)] rounded-xl w-48">
              <option value="">All Clearances</option>
              <option value="Administrator">Administrator</option>
              <option value="Mess Manager">Mess Manager</option>
              <option value="User">User</option>
            </Select>
            <Button variant="outline" icon={RefreshCw} onClick={fetchUsers} className="rounded-xl h-12 w-12 flex justify-center items-center shadow-sm" />
          </div>
        </div>

        {/* User Table */}
        <div className="flex-1 overflow-x-auto relative">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-900/50 border-b border-[var(--border)] text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-black">
                <th className="py-4 px-6">Identity</th>
                <th className="py-4 px-6">Clearance</th>
                <th className="py-4 px-6">System Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <motion.tbody variants={staggerContainer} initial="initial" animate="animate">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="border-b border-[var(--border)]"><td className="py-4 px-6"><div className="h-8 w-32 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" /></td><td className="py-4 px-6"><div className="h-4 w-20 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" /></td><td className="py-4 px-6"><div className="h-4 w-16 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" /></td><td className="py-4 px-6 text-right"><div className="h-8 w-24 bg-slate-200 dark:bg-slate-800 rounded inline-block animate-pulse" /></td></tr>
                ))
              ) : filteredUsers.length === 0 ? (
                <tr><td colSpan={4}><div className="flex flex-col items-center justify-center py-24 opacity-50"><Users className="w-12 h-12 text-[var(--text-muted)] mb-4" /><p className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-widest">No Identities Match</p></div></td></tr>
              ) : (
                filteredUsers.map((userRow) => (
                  <motion.tr key={userRow.id} variants={staggerItem} className="border-b border-[var(--border)] hover:bg-brand-500/5 dark:hover:bg-brand-500/10 transition-colors group cursor-default">
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 border border-[var(--border)] text-[var(--text-secondary)] flex items-center justify-center font-bold text-sm shadow-sm group-hover:bg-brand-500 group-hover:text-white group-hover:border-transparent transition-all">
                          {userRow.full_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-[var(--text-primary)]">{userRow.full_name}</p>
                          <p className="text-xs text-[var(--text-muted)] flex items-center gap-1 mt-0.5"><Mail className="w-3 h-3" /> {userRow.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <Badge variant={userRow.role === 'Administrator' ? 'primary' : userRow.role === 'Mess Manager' ? 'warning' : 'secondary'} className="text-[10px]">
                        {userRow.role}
                      </Badge>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <Badge variant={userRow.is_active ? 'success' : 'danger'} className="text-[10px]">
                        {userRow.is_active ? 'Online' : 'Suspended'}
                      </Badge>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => { setEditUser(userRow); setNewRole(userRow.role); }} className="p-2 text-[var(--text-muted)] hover:text-brand-500 hover:bg-brand-500/10 rounded-xl transition-colors outline-none" title="Edit Role"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => setPassUser(userRow)} className="p-2 text-[var(--text-muted)] hover:text-accent-500 hover:bg-accent-500/10 rounded-xl transition-colors outline-none" title="Reset Credentials"><Key className="w-4 h-4" /></button>
                        {userRow.is_active ? (
                           <button onClick={() => handleToggleStatus(userRow.id, true)} className="p-2 text-[var(--text-muted)] hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors outline-none" title="Suspend Access"><UserX className="w-4 h-4" /></button>
                        ) : (
                           <button onClick={() => handleToggleStatus(userRow.id, false)} className="p-2 text-[var(--text-muted)] hover:text-emerald-500 hover:bg-emerald-500/10 rounded-xl transition-colors outline-none" title="Restore Access"><UserCheck className="w-4 h-4" /></button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </motion.tbody>
          </table>
        </div>
      </Card>

      {/* Edit Role Modal */}
      <Modal isOpen={!!editUser} onClose={() => setEditUser(null)} title="Modify Security Clearance">
        <form onSubmit={handleUpdateRole} className="space-y-4">
          <p className="text-sm font-medium text-[var(--text-secondary)] mb-2">Target Identity: <span className="font-bold text-[var(--text-primary)]">{editUser?.full_name}</span></p>
          <div>
            <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1.5">New Clearance Level</label>
            <Select value={newRole} onChange={e => setNewRole(e.target.value)} icon={Shield} className="h-12 bg-[var(--surface-elevated)] dark:bg-slate-950">
              <option value="User">Standard User</option>
              <option value="Mess Manager">Mess Manager</option>
              <option value="Administrator">Administrator</option>
            </Select>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="ghost" onClick={() => setEditUser(null)} className="rounded-xl">Abort</Button>
            <Button type="submit" className="rounded-xl shadow-lg">Confirm Modification</Button>
          </div>
        </form>
      </Modal>

      {/* Reset Pass Modal */}
      <Modal isOpen={!!passUser} onClose={() => setPassUser(null)} title="Force Credential Reset">
        <form onSubmit={handleResetPassword} className="space-y-4">
          <p className="text-sm font-medium text-[var(--text-secondary)] mb-2">Target Identity: <span className="font-bold text-[var(--text-primary)]">{passUser?.full_name}</span></p>
          <div>
            <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1.5">New Credentials</label>
            <Input type="text" placeholder="Type new password" value={newPass} onChange={e => setNewPass(e.target.value)} required icon={Key} className="h-12 bg-[var(--surface-elevated)] dark:bg-slate-950" />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="ghost" onClick={() => setPassUser(null)} className="rounded-xl">Abort</Button>
            <Button type="submit" className="rounded-xl shadow-lg bg-rose-500 hover:bg-rose-600 text-white border-transparent">Execute Reset</Button>
          </div>
        </form>
      </Modal>

    </motion.div>
  );
}
