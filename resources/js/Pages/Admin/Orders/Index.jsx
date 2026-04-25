import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Modal from '@/Components/Modal';

export default function Index({ orders, stats }) {
    const [selectedOrder, setSelectedOrder] = useState(null);

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

    const handleStatusChange = (orderId, newStatus) => {
        router.patch(route('admin.orders.updateStatus', orderId), {
            status: newStatus,
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
                        Arsenal de <span className="text-emerald-500">Adquisiciones</span>
                    </h2>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Terminal de Control Logístico y Flujo de Hardware
                    </p>
                </motion.div>
            }
        >
            <Head title="Admin - Pedidos" />

            <div className="py-12 relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Statistics Cards */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
                >
                    <div className="glass-panel p-6 rounded-[2rem] border border-white/5 bg-white/[0.02] relative overflow-hidden group hover:border-emerald-500/30 transition-all">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-3xl -mr-12 -mt-12 group-hover:bg-emerald-500/10 transition-colors"></div>
                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Facturación Total</div>
                        <div className="text-3xl font-black text-white italic tracking-tighter mb-1">{Number(stats.total_revenue).toLocaleString('es-ES')} €</div>
                        <div className="text-[9px] text-emerald-500 font-bold uppercase tracking-widest flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                            +{stats.monthly_growth}% vs mes anterior
                        </div>
                    </div>

                    <div className="glass-panel p-6 rounded-[2rem] border border-white/5 bg-white/[0.02] relative overflow-hidden group hover:border-amber-500/30 transition-all">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-3xl -mr-12 -mt-12 group-hover:bg-amber-500/10 transition-colors"></div>
                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Pedidos Pendientes</div>
                        <div className="text-3xl font-black text-white italic tracking-tighter mb-1">{stats.pending_orders}</div>
                        <div className="text-[9px] text-amber-500 font-bold uppercase tracking-widest">Requieren Intervención</div>
                    </div>

                    <div className="glass-panel p-6 rounded-[2rem] border border-white/5 bg-white/[0.02] relative overflow-hidden group hover:border-blue-500/30 transition-all">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-3xl -mr-12 -mt-12 group-hover:bg-blue-500/10 transition-colors"></div>
                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Volumen Total</div>
                        <div className="text-3xl font-black text-white italic tracking-tighter mb-1">{stats.total_orders}</div>
                        <div className="text-[9px] text-blue-500 font-bold uppercase tracking-widest">Histórico de Pedidos</div>
                    </div>

                    <div className="glass-panel p-6 rounded-[2rem] border border-white/5 bg-emerald-500/10 relative overflow-hidden group hover:bg-emerald-500/20 transition-all">
                         <div className="h-full flex flex-col justify-center items-center text-center">
                            <svg className="w-10 h-10 text-emerald-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <div className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em]">Sistema Operativo</div>
                         </div>
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
                            <h3 className="text-lg font-black text-white italic uppercase tracking-tighter">Manifiestos de Entrega</h3>
                            <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest mt-1">Monitoreo de transacciones y estados de envío</p>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-white/[0.01] border-b border-white/5">
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">ID_PROTOCOLO</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">SUJETO_CLIENTE</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">INVERSIÓN</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">ESTADO_OPERATIVO</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">FECHA_REGISTRO</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 text-right">ACCIONES</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {orders.data.map((order) => (
                                    <motion.tr 
                                        key={order.id} 
                                        variants={itemVariants}
                                        className="hover:bg-emerald-500/[0.03] transition-all group"
                                    >
                                        <td className="px-8 py-6">
                                            <div className="text-sm font-black text-white italic group-hover:text-emerald-400 transition-colors uppercase tracking-tighter">{order.order_number}</div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="text-sm font-black text-slate-200 uppercase tracking-tight leading-none mb-1">{order.user.name}</div>
                                            <div className="text-[10px] text-slate-500 font-bold tracking-tight opacity-60">{order.user.email}</div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="text-lg font-black text-white italic tracking-tighter">{parseFloat(order.total).toLocaleString('es-ES')} €</div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`text-[9px] font-black uppercase px-3 py-1.5 rounded-xl border ${getStatusColor(order.status)} whitespace-nowrap shadow-inner`}>
                                                {translateStatus(order.status)}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{new Date(order.created_at).toLocaleDateString()}</div>
                                        </td>
                                        <td className="px-8 py-6 text-right whitespace-nowrap">
                                            <div className="flex items-center gap-3 justify-end">
                                                <button 
                                                    onClick={() => setSelectedOrder(order)}
                                                    className="bg-white/5 border border-white/5 rounded-2xl text-[9px] font-black uppercase tracking-widest text-emerald-400 px-5 py-2.5 hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all flex items-center gap-2 shadow-inner group/btn"
                                                >
                                                    <svg className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                                    EXPLORAR
                                                </button>
                                                <div className="relative group/sel">
                                                    <select 
                                                        value={order.status}
                                                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                        className="bg-black/60 border border-white/5 rounded-2xl text-[9px] font-black uppercase tracking-widest text-slate-300 px-5 py-2.5 pr-10 focus:ring-emerald-500/30 focus:border-emerald-500/50 appearance-none bg-none cursor-pointer hover:bg-black/80 transition-all outline-none shadow-inner"
                                                    >
                                                        <option value="pending" className="bg-[#0a0c14]">PENDIENTE</option>
                                                        <option value="processing" className="bg-[#0a0c14]">PROCESANDO</option>
                                                        <option value="completed" className="bg-[#0a0c14]">COMPLETADO</option>
                                                        <option value="cancelled" className="bg-[#0a0c14]">CANCELADO</option>
                                                    </select>
                                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 transition-colors group-hover/sel:text-emerald-500">
                                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                                                    </div>
                                                </div>
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
                    {orders.links.map((link, idx) => (
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

            {/* Modal de Detalles del Pedido */}
            <Modal show={!!selectedOrder} onClose={() => setSelectedOrder(null)} maxWidth="5xl" panelClasses="rounded-[2.5rem] bg-transparent">
                {selectedOrder && (
                    <div className="p-6 bg-[#0a0c14] border border-white/10 rounded-[2.5rem] relative overflow-hidden backdrop-blur-3xl shadow-2xl">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[100px] -mr-32 -mt-32"></div>
                        
                        <div className="flex justify-between items-start mb-8 relative z-10">
                            <div>
                                <h3 className="text-2xl font-black italic uppercase text-white tracking-tighter leading-none mb-1.5">Manifiesto de <span className="text-emerald-500">Adquisición</span></h3>
                                <div className="text-slate-500 text-[9px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                    ID_OPERACIÓN: {selectedOrder.order_number}
                                </div>
                            </div>
                            <button onClick={() => setSelectedOrder(null)} className="p-3 bg-white/5 hover:bg-white/10 text-slate-500 hover:text-white transition-all rounded-xl border border-white/5">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <div className="space-y-6 relative z-10">
                            <div className="glass-panel p-6 rounded-[2rem] border border-white/5 shadow-inner bg-white/[0.01]">
                                <div className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                                    Carga de Hardware Digitalizado
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-x-6 gap-y-1.5 max-h-[45vh] overflow-y-auto pr-2 custom-scrollbar">
                                    {selectedOrder.items.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0 lg:last:border-b last:lg:border-0 hover:bg-emerald-500/[0.02] transition-colors px-2 rounded-xl">
                                            <div className="w-12 h-12 rounded-lg bg-white p-2 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-lg">
                                                <img src={item.product?.image} alt={item.product?.name} className="w-full h-full object-contain mix-blend-multiply" />
                                            </div>
                                            <div className="flex-grow min-w-0">
                                                <div className="text-white font-black italic uppercase tracking-tighter leading-tight mb-0.5 text-xs truncate">{item.product?.name}</div>
                                                <div className="text-slate-500 text-[8px] font-black uppercase tracking-widest flex items-center gap-1">
                                                    <span>x{item.quantity}</span>
                                                    <span className="w-0.5 h-0.5 rounded-full bg-white/10"></span>
                                                    <span>{Number(item.price).toLocaleString('es-ES')} €</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-6 pt-6 border-t border-emerald-500/20 flex justify-between items-end">
                                    <div>
                                        <div className="text-emerald-500/50 text-[8px] font-black uppercase tracking-[0.3em] mb-1">Total Liquidación</div>
                                        <div className="text-emerald-500 text-[10px] font-black uppercase italic tracking-widest flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                            Inversión Neta de Hardware
                                        </div>
                                    </div>
                                    <div className="text-3xl font-black text-white italic tracking-tighter shadow-emerald-500/20 drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]">{Number(selectedOrder.total).toLocaleString('es-ES')} €</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="glass-panel p-6 rounded-[2rem] border border-white/5 bg-white/[0.01]">
                                    <div className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        Logística
                                    </div>
                                    <div className="text-xs text-slate-300 space-y-2 font-medium">
                                        <p className="font-black text-white uppercase italic text-base tracking-tighter leading-none">{selectedOrder.user?.name}</p>
                                        <p className="text-emerald-500/80 font-black uppercase italic text-sm tracking-tight leading-tight">{selectedOrder.address}</p>
                                        <p className="text-slate-500 font-black uppercase tracking-[0.2em] text-[9px]">{selectedOrder.postal_code} {selectedOrder.city}</p>
                                    </div>
                                </div>
                                <div className="glass-panel p-6 rounded-[2rem] border border-white/5 bg-white/[0.01] flex flex-col justify-between">
                                    <div>
                                        <div className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            Estado
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className={`text-[10px] font-black uppercase px-6 py-2 rounded-xl border ${getStatusColor(selectedOrder.status)} shadow-lg`}>
                                                {translateStatus(selectedOrder.status)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8">
                            <motion.button 
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                onClick={() => setSelectedOrder(null)}
                                className="w-full py-4 bg-white/5 hover:bg-white/10 text-slate-500 hover:text-white rounded-[1.5rem] font-black uppercase tracking-[0.4em] text-[9px] transition-all italic border border-white/5 shadow-inner"
                            >
                                [ CERRAR ]
                            </motion.button>
                        </div>
                    </div>
                )}
            </Modal>
        </AuthenticatedLayout>
    );
}


