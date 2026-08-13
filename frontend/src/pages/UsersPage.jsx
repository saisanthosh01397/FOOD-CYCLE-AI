import { useState, useEffect } from 'react';
import { Search, Filter, Shield, UserX, UserCheck, Edit, Key, Download, AlertCircle, RefreshCw } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

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
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Control access, roles, and account security for all platform users.</p>
        </div>
        <div className="flex gap-2">
           <button onClick={fetchUsers} className="px-3 py-2 bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 rounded-xl hover:bg-slate-200 transition-colors"><RefreshCw className="w-5 h-5"/></button>
           <button className="px-4 py-2 bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 font-medium rounded-xl flex items-center gap-2 hover:bg-emerald-100 transition-colors">
             <Download className="w-4 h-4" /> Export Users
           </button>
        </div>
      </div>

      <div className="glass-card flex flex-col min-h-[600px] relative">
        {/* Toolbar */}
        <div className="p-4 border-b dark:border-slate-800 flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-50/50 dark:bg-slate-900/20 rounded-t-2xl">
           <div className="relative w-full md:w-96">
             <Search className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
             <input 
               type="text" 
               placeholder="Search name or email..." 
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               className="w-full pl-10 pr-4 py-2 rounded-lg border dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
             />
           </div>
           
           <div className="relative w-full md:w-48">
             <Filter className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
             <select 
               value={roleFilter}
               onChange={(e) => setRoleFilter(e.target.value)}
               className="w-full pl-9 pr-4 py-2 rounded-lg border dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-emerald-500 outline-none appearance-none"
             >
               <option value="">All Roles</option>
               <option value="Administrator">Administrator</option>
               <option value="Mess Manager">Mess Manager</option>
               <option value="User">User</option>
             </select>
           </div>
        </div>

        {/* Data Grid */}
        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                <th className="p-4 font-semibold text-slate-600 dark:text-slate-300 text-sm">User Details</th>
                <th className="p-4 font-semibold text-slate-600 dark:text-slate-300 text-sm">Role</th>
                <th className="p-4 font-semibold text-slate-600 dark:text-slate-300 text-sm">Status</th>
                <th className="p-4 font-semibold text-slate-600 dark:text-slate-300 text-sm">Stats</th>
                <th className="p-4 font-semibold text-slate-600 dark:text-slate-300 text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center">
                    <div className="flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div></div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-16 text-center text-slate-400">
                    <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>No users found.</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                         <img src={u.avatar || `https://ui-avatars.com/api/?name=${u.full_name}&background=10b981&color=fff`} className="w-10 h-10 rounded-full" />
                         <div>
                            <div className="font-semibold text-sm">{u.full_name}</div>
                            <div className="text-xs text-slate-500">{u.email}</div>
                         </div>
                      </div>
                    </td>
                    <td className="p-4">
                       <select 
                         value={u.role}
                         onChange={(e) => handleRoleChange(u.id, e.target.value)}
                         className={`px-2 py-1 rounded border text-xs font-semibold outline-none ${
                           u.role === 'Administrator' ? 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:border-purple-800 dark:text-purple-400' :
                           u.role === 'Mess Manager' ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-400' :
                           'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:border-emerald-800 dark:text-emerald-400'
                         }`}
                       >
                         <option value="Administrator">Administrator</option>
                         <option value="Mess Manager">Mess Manager</option>
                         <option value="User">User</option>
                       </select>
                    </td>
                    <td className="p-4">
                      {u.is_active ? (
                        <span className="px-2 py-1 bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-md text-xs font-semibold flex items-center gap-1 w-max">
                          <UserCheck className="w-3 h-3" /> Active
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400 rounded-md text-xs font-semibold flex items-center gap-1 w-max">
                          <UserX className="w-3 h-3" /> Inactive
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-xs text-slate-500 space-y-1">
                      <div><strong className="text-slate-700 dark:text-slate-300">{u.total_predictions}</strong> Preds</div>
                      <div><strong className="text-slate-700 dark:text-slate-300">{u.total_image_analyses}</strong> Images</div>
                    </td>
                    <td className="p-4 text-right space-x-2">
                       <button onClick={() => setEditUser(u)} className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors" title="Edit User">
                         <Edit className="w-4 h-4" />
                       </button>
                       <button onClick={() => setResetUser(u)} className="p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/30 rounded-lg transition-colors" title="Reset Password">
                         <Key className="w-4 h-4" />
                       </button>
                       <button 
                         onClick={() => handleToggleStatus(u.id, u.is_active)}
                         className={`p-2 rounded-lg transition-colors ${u.is_active ? 'text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30' : 'text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/30'}`}
                         title={u.is_active ? "Deactivate" : "Activate"}
                       >
                         <Shield className="w-4 h-4" />
                       </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit User Modal */}
      {editUser && (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold mb-4">Edit User</h3>
            <form onSubmit={submitEditUser} className="space-y-4">
               <div>
                  <label className="block text-sm font-medium mb-1">Full Name</label>
                  <input type="text" value={editUser.full_name} onChange={e => setEditUser({...editUser, full_name: e.target.value})} className="w-full px-4 py-2 rounded-lg border dark:border-slate-700 bg-white dark:bg-slate-900 outline-none focus:ring-2 focus:ring-emerald-500" required />
               </div>
               <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input type="email" value={editUser.email} onChange={e => setEditUser({...editUser, email: e.target.value})} className="w-full px-4 py-2 rounded-lg border dark:border-slate-700 bg-white dark:bg-slate-900 outline-none focus:ring-2 focus:ring-emerald-500" required />
               </div>
               <div className="flex justify-end gap-3 pt-4">
                  <button type="button" onClick={() => setEditUser(null)} className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600">Save Changes</button>
               </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {resetUser && (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold mb-4">Reset Password</h3>
            <p className="text-sm text-slate-500 mb-4">Set a new password for <strong>{resetUser.full_name}</strong>.</p>
            <form onSubmit={submitResetPassword} className="space-y-4">
               <div>
                  <label className="block text-sm font-medium mb-1">New Password</label>
                  <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full px-4 py-2 rounded-lg border dark:border-slate-700 bg-white dark:bg-slate-900 outline-none focus:ring-2 focus:ring-emerald-500" required />
               </div>
               <div className="flex justify-end gap-3 pt-4">
                  <button type="button" onClick={() => { setResetUser(null); setNewPassword(''); }} className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-amber-500 text-white rounded-xl hover:bg-amber-600">Reset Password</button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
