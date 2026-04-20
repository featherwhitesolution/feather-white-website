import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { User, Shield, Mail, CheckCircle, XCircle, Search, Trash2, Clock, Crown, Key } from 'lucide-react';

const AdminUsers = () => {
    const { userInfo } = useSelector((state) => state.user);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };
            const { data } = await axios.get('/api/users', config);
            setUsers(data);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch users:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userInfo && userInfo.isAdmin) {
            fetchUsers();
        }
    }, [userInfo]);

    const handleToggleAdmin = async (userId) => {
        if (userId === userInfo._id) {
            alert("You cannot demote yourself!");
            return;
        }

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };
            await axios.put(`/api/users/${userId}/admin`, {}, config);
            fetchUsers(); // Refresh list
        } catch (error) {
            alert('Update failed: ' + (error.response?.data?.message || 'Error'));
        }
    };

    const filteredUsers = users.filter(u => 
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="flex flex-col items-center justify-center p-20 animate-pulse text-gold-500">
            <Clock className="animate-spin mb-4" size={48} />
            <p className="font-serif">Loading your community...</p>
        </div>
    );

    return (
        <div className="space-y-6 animate-fade-in-up">
            
            {/* Search Bar */}
            <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-gold-500 transition-all font-black" size={20} />
                <input 
                    type="text" 
                    placeholder="Search for names or emails..."
                    className="w-full bg-navy-800 border-2 border-white/5 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-gold-500 transition-all font-bold shadow-2xl"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Users Table */}
            <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-md">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-navy-800/80 text-[10px] uppercase tracking-[0.2em] font-black text-cream-100/40">
                            <tr>
                                <th className="px-8 py-5">Role</th>
                                <th className="px-8 py-5">User Details</th>
                                <th className="px-8 py-5">Status</th>
                                <th className="px-8 py-5 text-right">Admin Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredUsers.map((user) => (
                                <tr key={user._id} className="hover:bg-white/5 transition-all group">
                                    <td className="px-8 py-6">
                                        {user.isAdmin ? (
                                            <div className="flex items-center space-x-2 text-gold-400 font-black text-xs uppercase bg-gold-400/10 px-3 py-1.5 rounded-full border border-gold-400/20 w-max">
                                                <Crown size={14} />
                                                <span>Admin</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center space-x-2 text-white/40 font-black text-xs uppercase bg-white/5 px-3 py-1.5 rounded-full border border-white/5 w-max">
                                                <User size={14} />
                                                <span>Member</span>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-8">
                                        <div className="flex flex-col">
                                            <span className="text-white font-black text-lg font-serif">{user.name}</span>
                                            <span className="text-gold-500/60 text-xs font-bold flex items-center space-x-1">
                                                <Mail size={12} />
                                                <span>{user.email}</span>
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8">
                                        <div className="flex items-center space-x-2 text-green-400 font-bold text-sm">
                                            <CheckCircle size={16} />
                                            <span>Active</span>
                                        </div>
                                    </td>
                                    <td className="px-8 text-right">
                                        <button 
                                            onClick={() => handleToggleAdmin(user._id)}
                                            className={`p-3 rounded-2xl transition-all border-2 ${
                                                user.isAdmin 
                                                ? 'bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-500/20' 
                                                : 'bg-gold-500/10 border-gold-500/20 text-gold-500 hover:bg-gold-500/20'
                                            }`}
                                            title={user.isAdmin ? 'Revoke Admin' : 'Make Admin'}
                                        >
                                            {user.isAdmin ? <XCircle size={20} /> : <Shield size={20} />}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredUsers.length === 0 && (
                    <div className="p-20 text-center opacity-30 flex flex-col items-center">
                        <Search size={48} className="mb-4" />
                        <p className="font-serif">No users found!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminUsers;
