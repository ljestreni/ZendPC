import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Modal from '@/Components/Modal';
import axios from 'axios';

export default function Index({ users, stats, auth }) {
    const [inspectingUser, setInspectingUser] = useState(null);
    const [editingUser, setEditingUser] = useState(null);
    const [loadingOrders, setLoadingOrders] = useState(false);

    const { data, setData, put, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
    });

    useEffect(() => {
        if (editingUser) {
            setData({
                name: editingUser.name,
                email: editingUser.email,
                password: '',
            });
        }
    }, [editingUser]);

    const handleRoleChange = (userId, newRole) => {
        if (confirm('¿Estás seguro de cambiar el rol de este usuario?')) {
            router.patch(route('admin.users.updateRole', userId), {
                role: newRole,
            });
        }
    };

    const handleDeleteUser = (userId) => {
        if (confirm('¿ESTÁS SEGURO? Esta acción es irreversible y eliminará todos los datos asociados al usuario.')) {
            router.delete(route('admin.users.destroy', userId));
        }
    };

    const handleInspectUser = async (userId) => {
        setLoadingOrders(true);
        try {
            const response = await axios.get(route('admin.users.show', userId));
            setInspectingUser(response.data);
        } catch (error) {
            console.error('Error al cargar órdenes del usuario', error);
        } finally {
            setLoadingOrders(false);
        }
    };

    const handleEditUser = (user) => {
        setEditingUser(user);
    };

    const handleUpdateUser = (e) => {
        e.preventDefault();
        put(route('admin.users.update', editingUser.id), {
            onSuccess: () => {
                setEditingUser(null);
                reset();
            },
        });
    };

    const handleOrderStatusChange = (orderId, newStatus) => {
        router.patch(route('admin.orders.updateStatus', orderId), {
            status: newStatus,
        }, {
            onSuccess: () => {
                handleInspectUser(inspectingUser.id);
            }
        });
    };

    const getStatusColor = (status) => {
        const colors = {
            'pending': 'text-amber-400 bg-amber-400/10 border-amber-400/20',
            'processing': 'text-blue-400 bg-blue-400/10 border-blue-400/20',
            'completed': 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
            'cancelled': 'text-red-400 bg-red-400/10 border-red-400/20',
        };
        return colors[status] || 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    };

    const translateStatus = (status) => {
        const translations = {
            'pending': 'PENDIENTE',
            'processing': 'PROCESANDO',
            'completed': 'COMPLETADA',
            'cancelled': 'CANCELADA',
        };
        return translations[status] || status;
    };

    const canManageUser = (targetUser) => {
        if (auth.user.id === targetUser.id) return false;
        if (auth.user.role === 'super_admin') return true;
        if (auth.user.role === 'admin' && targetUser.role === 'user') return true;
        return false;
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <AuthenticatedLayout
            header={
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="relative"
                >
                    <div className="absolute -left-4 top-0 bottom-0 w-1 bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
                    <h2 className="text-4xl font-black italic tracking-tighter text-white uppercase leading-none mb-2">
                        Gestión de <span className="text-emerald-500">Usuarios</span>
                    </h2>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Administración de Cuentas y Privilegios
                    </p>
                </motion.div>
            }
        >
            <Head title="Admin - Usuarios" />

            <div className="py-12 relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Statistics Cards */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-12"
                >
                    <div className="glass-panel p-5 rounded-[2rem] border border-white/5 bg-white/[0.02] relative overflow-hidden group hover:border-emerald-500/30 transition-all">
                        <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Total Usuarios</div>
                        <div className="text-2xl font-black text-white italic tracking-tighter mb-1">{stats.total_users}</div>
                        <div className="text-[8px] text-emerald-500 font-bold uppercase tracking-widest">Activos</div>
                    </div>

                    <div className="glass-panel p-5 rounded-[2rem] border border-white/5 bg-white/[0.02] relative overflow-hidden group hover:border-red-500/30 transition-all">
                        <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Super Admins</div>
                        <div className="text-2xl font-black text-white italic tracking-tighter mb-1">{stats.super_admins}</div>
                        <div className="text-[8px] text-red-500 font-bold uppercase tracking-widest">Control Total</div>
                    </div>

                    <div className="glass-panel p-5 rounded-[2rem] border border-white/5 bg-white/[0.02] relative overflow-hidden group hover:border-blue-500/30 transition-all">
                        <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Administradores</div>
                        <div className="text-2xl font-black text-white italic tracking-tighter mb-1">{stats.admins}</div>
                        <div className="text-[8px] text-blue-500 font-bold uppercase tracking-widest">Gestión Operativa</div>
                    </div>

                    <div className="glass-panel p-5 rounded-[2rem] border border-white/5 bg-white/[0.02] relative overflow-hidden group hover:border-amber-500/30 transition-all">
                        <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Estándar</div>
                        <div className="text-2xl font-black text-white italic tracking-tighter mb-1">{stats.standard_users}</div>
                        <div className="text-[8px] text-amber-500 font-bold uppercase tracking-widest">Registrados</div>
                    </div>

                    <div className="glass-panel p-5 rounded-[2rem] border border-white/5 bg-white/[0.02] relative overflow-hidden group hover:border-purple-500/30 transition-all">
                        <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Google Auth</div>
                        <div className="text-2xl font-black text-white italic tracking-tighter mb-1">{stats.google_users}</div>
                        <div className="text-[8px] text-purple-500 font-bold uppercase tracking-widest">Federados</div>
                    </div>
                </motion.div>

                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="glass-panel rounded-[2.5rem] overflow-hidden border border-white/5 shadow-[0_0_50px_rgba(0,0,0,0.3)] bg-[#0a0c14]/80 backdrop-blur-xl"
                >
                    <div className="p-8 border-b border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-gradient-to-r from-white/[0.02] to-transparent">
                        <div>
                            <h3 className="text-lg font-black text-white italic uppercase tracking-tighter">Manifiesto de Usuarios</h3>
                            <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest mt-1">Jerarquía de acceso y privilegios</p>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-white/[0.01] border-b border-white/5">
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">IDENTIDAD</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">AUTENTICACIÓN</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">ACTIVIDAD</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">ROL_SISTEMA</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 text-right">ACCIONES</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {users.data.map((user) => (
                                    <motion.tr 
                                        key={user.id} 
                                        variants={itemVariants}
                                        className="hover:bg-emerald-500/[0.03] transition-all group"
                                    >
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-emerald-500 font-black italic text-lg shadow-inner group-hover:border-emerald-500/30 transition-all">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-black text-white uppercase tracking-tight leading-none mb-1 group-hover:text-emerald-400 transition-colors">{user.name}</div>
                                                    <div className="text-[10px] text-slate-500 font-bold tracking-tight opacity-60 italic">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            {user.google_id ? (
                                                <div className="flex items-center gap-2 text-[9px] font-black text-purple-400 uppercase tracking-widest bg-purple-400/5 border border-purple-400/10 px-3 py-1.5 rounded-xl w-fit shadow-inner">
                                                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                                    </svg>
                                                    GOOGLE_AUTH
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl w-fit shadow-inner">
                                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                                    INTERNAL_AUTH
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="text-[10px] text-slate-300 font-black uppercase tracking-widest mb-1">{user.orders_count} PEDIDOS</div>
                                            <div className="text-[8px] text-slate-500 font-bold uppercase tracking-[0.2em]">Registrado: {new Date(user.created_at).toLocaleDateString()}</div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="relative group/sel max-w-[140px]">
                                                <select 
                                                    value={user.role}
                                                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                                    disabled={!canManageUser(user)}
                                                    className={`w-full bg-black/60 border rounded-2xl text-[9px] font-black uppercase tracking-widest px-4 py-2 pr-10 focus:ring-emerald-500/30 focus:border-emerald-500/50 appearance-none bg-none cursor-pointer hover:bg-black/80 transition-all outline-none shadow-inner ${
                                                        user.role === 'super_admin' ? 'text-red-400 border-red-500/20' :
                                                        user.role === 'admin' ? 'text-blue-400 border-blue-500/20' :
                                                        'text-slate-300 border-white/5'
                                                    } ${!canManageUser(user) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                >
                                                    <option value="user" className="bg-[#0a0c14]">ESTÁNDAR</option>
                                                    <option value="admin" className="bg-[#0a0c14]">ADMINISTRADOR</option>
                                                    <option value="super_admin" className="bg-[#0a0c14]">SUPER_ADMIN</option>
                                                </select>
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 transition-colors group-hover/sel:text-emerald-500">
                                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right whitespace-nowrap">
                                            <div className="flex items-center gap-3 justify-end">
                                                <button 
                                                    onClick={() => handleInspectUser(user.id)}
                                                    className="bg-white/5 border border-white/5 rounded-2xl text-[9px] font-black uppercase tracking-widest text-emerald-400 px-5 py-2.5 hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all flex items-center gap-2 shadow-inner group/btn"
                                                    title="Explorar Actividad"
                                                >
                                                    {loadingOrders && inspectingUser?.id === user.id ? (
                                                        <svg className="animate-spin h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                                    ) : (
                                                        <svg className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                                    )}
                                                    EXPLORAR
                                                </button>
                                                <button 
                                                    onClick={() => handleEditUser(user)}
                                                    disabled={!canManageUser(user)}
                                                    className={`p-2.5 rounded-xl border border-white/5 bg-white/5 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 hover:border-blue-500/30 transition-all shadow-inner ${
                                                        !canManageUser(user) ? 'opacity-20 cursor-not-allowed' : ''
                                                    }`}
                                                    title="Editar Datos"
                                                >
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteUser(user.id)}
                                                    disabled={!canManageUser(user)}
                                                    className={`p-2.5 rounded-xl border border-white/5 bg-white/5 text-red-500/50 hover:text-red-500 hover:bg-red-500/10 hover:border-red-500/30 transition-all shadow-inner ${
                                                        !canManageUser(user) ? 'opacity-20 cursor-not-allowed' : ''
                                                    }`}
                                                    title="Eliminar Usuario"
                                                >
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>

                {/* Pagination */}
                <div className="mt-12 flex justify-center gap-3">
                    {users.links.map((link, idx) => (
                        <Link
                            key={idx}
                            href={link.url || '#'}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                            className={`px-6 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest border transition-all ${
                                link.active 
                                ? 'bg-emerald-600 text-white border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.4)] italic scale-110' 
                                : 'bg-white/[0.02] text-slate-500 border-white/5 hover:text-white hover:border-white/20 hover:bg-white/5'
                            } ${!link.url && 'opacity-20 cursor-not-allowed'}`}
                        />
                    ))}
                </div>
            </div>

            {/* Modal de Inspección de Usuario */}
            <Modal show={!!inspectingUser} onClose={() => setInspectingUser(null)} maxWidth="6xl" panelClasses="rounded-[2.5rem] bg-transparent">
                {inspectingUser && (
                    <div className="p-8 bg-[#0a0c14] border border-white/10 rounded-[2.5rem] relative overflow-hidden backdrop-blur-3xl shadow-2xl">
                        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-[120px] -mr-40 -mt-40"></div>
                        
                        <div className="flex justify-between items-start mb-8 relative z-10">
                            <div>
                                <h3 className="text-2xl font-black italic uppercase text-white tracking-tighter leading-none mb-1.5">Expediente de <span className="text-emerald-500">Actividad</span></h3>
                                <div className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                    USUARIO: {inspectingUser.name}
                                </div>
                            </div>
                            <button onClick={() => setInspectingUser(null)} className="p-3 bg-white/5 hover:bg-white/10 text-slate-500 hover:text-white transition-all rounded-xl border border-white/5">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <div className="space-y-6 relative z-10">
                            <div className="glass-panel p-6 rounded-[2rem] border border-white/5 shadow-inner bg-white/[0.01]">
                                <div className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                                    Historial de Transacciones
                                </div>

                                {inspectingUser.orders.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead>
                                                <tr className="text-[8px] font-black uppercase tracking-widest text-slate-500 border-b border-white/5">
                                                    <th className="pb-4">Nº PEDIDO</th>
                                                    <th className="pb-4">FECHA</th>
                                                    <th className="pb-4">INVERSIÓN</th>
                                                    <th className="pb-4">ESTADO</th>
                                                    <th className="pb-4 text-right">ACCIONES</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5">
                                                {inspectingUser.orders.map((order) => (
                                                    <tr key={order.id} className="group/row">
                                                        <td className="py-4 text-[11px] font-black text-white italic tracking-tighter">{order.order_number}</td>
                                                        <td className="py-4 text-[10px] text-slate-400 font-bold">{new Date(order.created_at).toLocaleDateString()}</td>
                                                        <td className="py-4 text-[11px] font-black text-white tracking-tighter">{Number(order.total).toLocaleString('es-ES')} €</td>
                                                        <td className="py-4">
                                                            <span className={`text-[8px] font-black uppercase px-2 py-1 rounded-lg border ${getStatusColor(order.status)}`}>
                                                                {translateStatus(order.status)}
                                                            </span>
                                                        </td>
                                                        <td className="py-4 text-right">
                                                            <div className="relative group/osel inline-block">
                                                                <select 
                                                                    value={order.status}
                                                                    onChange={(e) => handleOrderStatusChange(order.id, e.target.value)}
                                                                    className="bg-black/40 border border-white/5 rounded-xl text-[8px] font-black uppercase tracking-widest text-slate-400 pl-3 pr-8 py-1.5 focus:ring-emerald-500/30 focus:border-emerald-500/50 appearance-none cursor-pointer hover:bg-black/60 transition-all outline-none"
                                                                >
                                                                    <option value="pending" className="bg-[#0a0c14]">PENDIENTE</option>
                                                                    <option value="processing" className="bg-[#0a0c14]">PROCESANDO</option>
                                                                    <option value="completed" className="bg-[#0a0c14]">COMPLETADA</option>
                                                                    <option value="cancelled" className="bg-[#0a0c14]">CANCELADA</option>
                                                                </select>
                                                                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-600">
                                                                    <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="py-12 text-center">
                                        <div className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Sin actividad transaccional registrada</div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mt-8">
                            <button 
                                onClick={() => setInspectingUser(null)}
                                className="w-full py-4 bg-white/5 hover:bg-white/10 text-slate-500 hover:text-white rounded-[1.5rem] font-black uppercase tracking-[0.4em] text-[9px] transition-all italic border border-white/5"
                            >
                                [ CERRAR EXPEDIENTE ]
                            </button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Modal de Edición de Usuario */}
            <Modal show={!!editingUser} onClose={() => setEditingUser(null)} maxWidth="2xl" panelClasses="bg-transparent border-none shadow-none rounded-[2.5rem]">
                <form onSubmit={handleUpdateUser} className="p-8 bg-[#0a0c14] border border-white/10 rounded-[2.5rem] relative overflow-hidden backdrop-blur-3xl shadow-2xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[100px] -mr-32 -mt-32"></div>
                    
                    <div className="flex justify-between items-start mb-8 relative z-10">
                        <div>
                            <h3 className="text-2xl font-black italic uppercase text-white tracking-tighter leading-none mb-1.5">Modificar <span className="text-blue-400">Credenciales</span></h3>
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">Actualización de identidad y seguridad</p>
                        </div>
                        <button type="button" onClick={() => setEditingUser(null)} className="p-2 text-slate-500 hover:text-white transition-colors">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>

                    <div className="space-y-6 relative z-10">
                        <div>
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Nombre Completo</label>
                            <input 
                                type="text"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white text-sm focus:ring-blue-500/30 focus:border-blue-500/50 transition-all outline-none"
                                placeholder="Nombre del usuario"
                            />
                            {errors.name && <div className="text-red-500 text-[10px] mt-1 ml-1 font-bold italic uppercase tracking-widest">{errors.name}</div>}
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Correo Electrónico</label>
                            <input 
                                type="email"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white text-sm focus:ring-blue-500/30 focus:border-blue-500/50 transition-all outline-none"
                                placeholder="email@ejemplo.com"
                            />
                            {errors.email && <div className="text-red-500 text-[10px] mt-1 ml-1 font-bold italic uppercase tracking-widest">{errors.email}</div>}
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Nueva Contraseña (Opcional)</label>
                            <input 
                                type="password"
                                value={data.password}
                                onChange={e => setData('password', e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white text-sm focus:ring-blue-500/30 focus:border-blue-500/50 transition-all outline-none"
                                placeholder="Dejar en blanco para mantener la actual"
                            />
                            {errors.password && <div className="text-red-500 text-[10px] mt-1 ml-1 font-bold italic uppercase tracking-widest">{errors.password}</div>}
                        </div>
                    </div>

                    <div className="mt-10 flex gap-4">
                        <button 
                            type="button"
                            onClick={() => setEditingUser(null)}
                            className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-slate-500 hover:text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all italic border border-white/5"
                        >
                            CANCELAR
                        </button>
                        <button 
                            type="submit"
                            disabled={processing}
                            className="flex-[2] py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all shadow-[0_0_30px_rgba(37,99,235,0.3)] disabled:opacity-50"
                        >
                            {processing ? 'ACTUALIZANDO...' : 'GUARDAR CAMBIOS'}
                        </button>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
