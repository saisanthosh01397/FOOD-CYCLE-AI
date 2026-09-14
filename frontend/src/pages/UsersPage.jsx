import React, { useState, useEffect } from 'react';
import {
  Search, Filter, Shield, UserX, UserCheck, Edit, Key, Download,
  RefreshCw, Users, Mail, User, X
} from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import PageHeader from '../components/ui/PageHeader';
import { Card } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Input, Select } from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import { motion, AnimatePresence } from 'framer-motion';

// Quick Modal Component
function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-[var(--card)] border border-[var(--border)] shadow-2xl rounded-2xl w-full max-w-md overflow-hidden"
      >
        <div className="p-5 border-b border-[var(--border)] flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/30">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">{title}</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </motion.div>
    </div>
  );
}

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  // Modals state
  const [editUser, setEditUser] = useState(null); // {id, full_name, email}
  const [resetUser, setResetUser] = useState(null); // {id, full_name}
  const [newPassword, setNewPassword] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) {
      toast.error('Failed to load users');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await api.put(`/users/${id}/status`, { is_active: !currentStatus });
      toast.success(currentStatus ? 'User deactivated' : 'User activated');
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to update status');
    }
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      await api.put(`/users/${id}/role`, { role: newRole });
      toast.success('Role updated successfully');
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to update role');
    }
  };

  const submitEditUser = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/users/${editUser.id}`, { full_name: editUser.full_name, email: editUser.email });
      toast.success('User updated successfully');
      setEditUser(null);
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to update user');
    }
  };

  const submitResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    try {
      await api.put(`/users/${resetUser.id}/password`, { new_password: newPassword });
      toast.success('Password reset successfully');
      setResetUser(null);
      setNewPassword('');
    } catch (error) {
      toast.error('Failed to reset password');
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.full_name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter ? u.role === roleFilter : true;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="User Management"
        description="Control access, roles, and account security for all platform users."
      >
        <div className="flex gap-2">
          <Button variant="secondary" icon={RefreshCw} onClick={fetchUsers} className="px-3" />
          <Button variant="outline" icon={Download}>Export Users</Button>
        </div>
      </PageHeader>

      <Card className="overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-[var(--border)] bg-slate-50/50 dark:bg-slate-900/20 flex flex-col md:flex-row gap-3">
          <div className="w-full md:w-96">
            <Input
              icon={Search}
              type="text"
              placeholder="Search name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="w-full md:w-56">
            <Select
              icon={Filter}
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="">All Roles</option>
              <option value="Administrator">Administrator</option>
              <option value="Mess Manager">Mess Manager</option>
              <option value="User">User</option>
            </Select>
          </div>
        </div>

        {/* Data Grid */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border)] bg-slate-50/80 dark:bg-slate-900/30">
                {['User Details', 'Role', 'Status', 'Activity Stats', 'Security Actions'].map((h) => (
                  <th key={h} className="px-5 py-3 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(5)].map((_, j) => (
                      <td key={j} className="px-5 py-4">
                        <div className="h-4 skeleton rounded" style={{ width: j === 0 ? '80%' : j === 4 ? '40%' : '60%', opacity: 1 - j * 0.1 }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        <Users className="w-7 h-7 text-slate-300 dark:text-slate-600" />
                      </div>
                      <p className="font-bold text-slate-900 dark:text-white">No users found</p>
                      <p className="text-sm text-slate-500">Try adjusting your search or filters.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                <AnimatePresence>
                  {filteredUsers.map((u, i) => (
                    <motion.tr
                      key={u.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.25 }}
                      className={`hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group ${!u.is_active ? 'opacity-60 grayscale-[0.5]' : ''}`}
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-brand-500 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                            {u.full_name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                              {u.full_name}
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                              <Mail className="w-3 h-3" /> {u.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <select
                          className="bg-slate-50 dark:bg-slate-900 border border-[var(--border)] text-sm rounded-lg focus:ring-brand-500 focus:border-brand-500 block w-full p-2 font-semibold text-slate-700 dark:text-slate-300 hover:border-slate-400 dark:hover:border-slate-600 transition-colors cursor-pointer"
                          value={u.role}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        >
                          <option value="Administrator">Administrator</option>
                          <option value="Mess Manager">Mess Manager</option>
                          <option value="User">User</option>
                        </select>
                      </td>
                      <td className="px-5 py-4">
                        <Badge variant={u.is_active ? 'success' : 'danger'}>
                          {u.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td className="px-5 py-4">
                        <div className="text-xs space-y-1">
                          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                            <span className="font-bold text-slate-900 dark:text-white">{u.total_predictions}</span> predictions
                          </div>
                          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                            <span className="font-bold text-slate-900 dark:text-white">{u.total_image_analyses}</span> analyses
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 px-2"
                            onClick={() => setEditUser({ id: u.id, full_name: u.full_name, email: u.email })}
                            title="Edit User"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 px-2"
                            onClick={() => setResetUser({ id: u.id, full_name: u.full_name })}
                            title="Reset Password"
                          >
                            <Key className="w-4 h-4" />
                          </Button>
                          <Button
                            variant={u.is_active ? "danger" : "primary"}
                            size="sm"
                            className="h-8 px-2"
                            onClick={() => handleToggleStatus(u.id, u.is_active)}
                            title={u.is_active ? "Deactivate User" : "Activate User"}
                          >
                            {u.is_active ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Edit User Modal */}
      <AnimatePresence>
        {editUser && (
          <Modal isOpen={true} onClose={() => setEditUser(null)} title="Edit User">
            <form onSubmit={submitEditUser} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5 text-slate-700 dark:text-slate-300">Full Name</label>
                <Input
                  icon={User}
                  value={editUser.full_name}
                  onChange={(e) => setEditUser({ ...editUser, full_name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5 text-slate-700 dark:text-slate-300">Email Address</label>
                <Input
                  icon={Mail}
                  type="email"
                  value={editUser.email}
                  onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                  required
                />
              </div>
              <div className="pt-2 flex justify-end gap-3">
                <Button type="button" variant="ghost" onClick={() => setEditUser(null)}>Cancel</Button>
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          </Modal>
        )}
      </AnimatePresence>

      {/* Reset Password Modal */}
      <AnimatePresence>
        {resetUser && (
          <Modal isOpen={true} onClose={() => { setResetUser(null); setNewPassword(''); }} title="Reset Password">
            <form onSubmit={submitResetPassword} className="space-y-4">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                Enter a new password for <strong className="text-slate-900 dark:text-white">{resetUser.full_name}</strong>.
              </p>
              <div>
                <label className="block text-sm font-semibold mb-1.5 text-slate-700 dark:text-slate-300">New Password</label>
                <Input
                  icon={Key}
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  placeholder="At least 6 characters"
                  minLength={6}
                />
              </div>
              <div className="pt-2 flex justify-end gap-3">
                <Button type="button" variant="ghost" onClick={() => { setResetUser(null); setNewPassword(''); }}>Cancel</Button>
                <Button type="submit" variant="danger">Reset Password</Button>
              </div>
            </form>
          </Modal>
        )}
      </AnimatePresence>

    </div>
  );
}
