import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Modal from '@/Components/Modal';

export default function Index({ pedidos }) {
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);
    const [orderToCancel, setOrderToCancel] = useState(null);

    const handleCancelOrder = (order) => {
        setOrderToCancel(order);
        setIsCancelConfirmOpen(true);
    };

    const confirmCancel = () => {
        if (!orderToCancel) return;
        router.post(route('orders.cancel', orderToCancel.id), {}, {
            onSuccess: () => {
                setIsCancelConfirmOpen(false);
                setOrderToCancel(null);
                setSelectedOrder(null);
            }
        });
    };

    const getStatusLabel = (status) => {
        const labels = {
            'pending': 'PENDIENTE',
            'processing': 'EN PROCESO',
            'completed': 'COMPLETADO',
            'cancelled': 'CANCELADO',
        };
        return labels[status] || status;
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

    return (
        <AuthenticatedLayout
            header={
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="relative"
                >
                    <div className="absolute -left-4 top-0 bottom-0 w-1 bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
                    <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase text-white mb-2">
                        Mis <span className="text-emerald-500">Pedidos</span>
                    </h2>
                    <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px] flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Registro histórico de adquisiciones de hardware
                    </p>
                </motion.div>
            }
        >
            <Head title="Mis Pedidos" />

            <div className="py-12 relative z-10">
                <div className="space-y-8">
                    {pedidos && pedidos.length > 0 ? (
                        pedidos.map((pedido, idx) => (
                            <motion.div 
                                key={pedido.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="glass-panel rounded-[2.5rem] overflow-hidden border border-white/5 hover:border-emerald-500/20 transition-all group bg-[#0a0c14]/80 backdrop-blur-xl"
                            >
                                <div className="p-8 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                                    <div className="flex items-center gap-8">
                                        <div className="w-20 h-20 rounded-[1.5rem] bg-emerald-500/10 border border-emerald-500/10 flex items-center justify-center text-emerald-500 shadow-inner group-hover:scale-105 transition-transform duration-500">
                                            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                                        </div>
                                        <div>
                                            <div className="flex flex-wrap items-center gap-4 mb-2">
                                                <h4 className="text-2xl font-black italic uppercase text-white tracking-tighter">{pedido.order_number}</h4>
                                                <span className={`text-[10px] font-black uppercase px-4 py-1.5 rounded-xl border ${getStatusColor(pedido.status)} shadow-lg`}>
                                                    {getStatusLabel(pedido.status)}
                                                </span>
                                            </div>
                                            <div className="text-slate-500 text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                                                <svg className="w-3.5 h-3.5 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                Registrado: {new Date(pedido.created_at).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-wrap items-center gap-10">
                                        <div className="text-left md:text-right">
                                            <div className="text-slate-600 text-[10px] font-black uppercase tracking-widest mb-1">Inversión Neta</div>
                                            <div className="text-3xl font-black text-white italic leading-none tracking-tighter group-hover:text-emerald-400 transition-colors">{Number(pedido.total).toLocaleString('es-ES')} €</div>
                                        </div>
                                        <div className="flex gap-3">
                                            <button 
                                                onClick={() => setSelectedOrder(pedido)}
                                                className="px-8 py-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all text-[10px] font-black uppercase tracking-widest text-emerald-400 hover:text-emerald-300 italic flex items-center gap-2 shadow-inner"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                                Ver Detalles
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Component Preview in Order */}
                                <div className="px-10 pb-10 flex gap-4 overflow-x-auto custom-scrollbar-hide">
                                    {pedido.items.map((item, idx) => (
                                        <div key={idx} className="flex-shrink-0 relative group/item">
                                            <div className="w-16 h-16 rounded-2xl bg-white p-3 flex items-center justify-center overflow-hidden shadow-2xl group-hover/item:scale-110 transition-transform duration-300">
                                                {item.product && <img src={item.product.image} alt={item.product.name} className="w-full h-full object-contain mix-blend-multiply opacity-80 group-hover/item:opacity-100 transition-opacity" />}
                                            </div>
                                            <div className="absolute -top-2 -right-2 bg-emerald-500 text-black text-[9px] font-black w-5 h-5 flex items-center justify-center rounded-lg shadow-lg">
                                                x{item.quantity}
                                            </div>
                                        </div>
                                    ))}
                                    <div className="flex-grow"></div>
                                    <div className="text-[10px] text-slate-700 font-black uppercase tracking-[0.3em] self-end italic opacity-40">
                                        ZEND_LOGISTICS_PROTOCOL_V2
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="py-32 text-center flex flex-col items-center glass-panel rounded-[3rem] border border-white/5 bg-white/[0.01]">
                            <div className="w-24 h-24 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center text-emerald-500/30 mb-8 shadow-inner">
                                 <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                            </div>
                            <h3 className="text-3xl font-black italic uppercase text-white mb-3 tracking-tighter">Sin Manifiestos de Pedido</h3>
                            <p className="text-slate-500 mb-10 max-w-sm font-medium uppercase tracking-widest text-[11px] leading-relaxed">Aún no has realizado ninguna adquisición en ZendPC. Visita el catálogo para empezar tu despliegue.</p>
                            <Link href={route('catalog.index')} className="px-12 py-6 bg-emerald-600 text-white rounded-[2rem] font-black uppercase tracking-[0.3em] shadow-[0_0_30px_rgba(16, 185, 129,0.4)] hover:bg-emerald-500 hover:scale-105 active:scale-95 transition-all text-xs italic">
                                Explorar Catálogo
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal de Detalles del Pedido */}
            <Modal show={!!selectedOrder} onClose={() => setSelectedOrder(null)} maxWidth="5xl" panelClasses="rounded-[2.5rem] bg-transparent">
                {selectedOrder && (
                    <div className="p-6 bg-[#0a0c14] border border-white/10 rounded-[2.5rem] relative overflow-hidden backdrop-blur-3xl shadow-2xl">
                        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-[120px] -mr-40 -mt-40"></div>
                        
                        <div className="flex justify-between items-start mb-6 relative z-10">
                            <div>
                                <h3 className="text-xl font-black italic uppercase text-white tracking-tighter leading-none mb-1">Detalles del <span className="text-emerald-500">Manifiesto</span></h3>
                                <div className="text-slate-500 text-[8px] font-black uppercase tracking-[0.4em] flex items-center gap-2">
                                    <div className="w-1 h-1 rounded-full bg-emerald-500"></div>
                                    REGISTRO_ID: {selectedOrder.order_number}
                                </div>
                            </div>
                            <button onClick={() => setSelectedOrder(null)} className="p-2 bg-white/5 hover:bg-white/10 text-slate-500 hover:text-white transition-all rounded-lg border border-white/5">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <div className="space-y-4 relative z-10">
                            <div className="glass-panel p-5 rounded-[1.5rem] border border-white/5 shadow-inner bg-white/[0.01]">
                                <div className="text-[8px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-3 flex items-center gap-2">
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                                    Configuración de Componentes
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
                                        <div className="text-emerald-500/50 text-[8px] font-black uppercase tracking-[0.4em] mb-1">Liquidación del Manifiesto</div>
                                        <div className="text-emerald-500 text-[10px] font-black uppercase italic tracking-widest flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                            Total Hardware Configurado
                                        </div>
                                    </div>
                                    <div className="text-4xl font-black text-white italic tracking-tighter drop-shadow-2xl">{Number(selectedOrder.total).toLocaleString('es-ES')} €</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="glass-panel p-6 rounded-[2rem] border border-white/5 bg-white/[0.01]">
                                    <div className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        Protocolo de Envío
                                    </div>
                                    <div className="text-xs text-slate-300 space-y-2 font-medium">
                                        <p className="font-black text-white uppercase italic text-lg tracking-tighter leading-none mb-1">{selectedOrder.address}</p>
                                        <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">{selectedOrder.postal_code} {selectedOrder.city}</p>
                                    </div>
                                </div>
                                <div className="glass-panel p-6 rounded-[2rem] border border-white/5 bg-white/[0.01]">
                                    <div className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        Estado Operativo
                                    </div>
                                    <div className="flex items-center gap-4 mb-4">
                                        <span className={`text-[10px] font-black uppercase px-6 py-2 rounded-xl border ${getStatusColor(selectedOrder.status)} shadow-2xl`}>
                                            {getStatusLabel(selectedOrder.status)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex gap-4">
                            <button 
                                onClick={() => setSelectedOrder(null)}
                                className="flex-1 py-4 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white rounded-[1.5rem] font-black uppercase tracking-[0.4em] text-[9px] transition-all italic border border-white/5 shadow-inner"
                            >
                                [ CERRAR ]
                            </button>
                            {selectedOrder.status === 'pending' && (
                                <button 
                                    onClick={() => handleCancelOrder(selectedOrder)}
                                    className="px-6 py-4 bg-red-600/10 text-red-500 hover:bg-red-600/20 rounded-[1.5rem] font-black uppercase tracking-[0.4em] text-[9px] transition-all italic border border-red-500/20"
                                >
                                    ABORTAR
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </Modal>

            {/* Modal de Confirmación de Cancelación */}
            <Modal show={isCancelConfirmOpen} onClose={() => setIsCancelConfirmOpen(false)} maxWidth="md" panelClasses="rounded-[3rem] bg-transparent">
                <div className="p-10 text-center bg-[#0a0c14] border border-white/10 rounded-[3rem] shadow-2xl">
                    <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center text-red-500 mx-auto mb-8 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    </div>
                    <h3 className="text-3xl font-black italic uppercase text-white mb-3 tracking-tighter">¿Abortar Manifiesto?</h3>
                    <p className="text-slate-500 mb-10 font-medium text-sm uppercase tracking-widest leading-relaxed">Esta acción cancelará el pedido <span className="text-white font-black">{orderToCancel?.order_number}</span> de forma inmediata. No se puede revertir el proceso de cancelación.</p>
                    
                    <div className="flex gap-4">
                        <button 
                            onClick={() => setIsCancelConfirmOpen(false)}
                            className="flex-1 py-5 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all italic border border-white/5"
                        >
                            Mantener Pedido
                        </button>
                        <button 
                            onClick={confirmCancel}
                            className="flex-1 py-5 bg-red-600 text-white hover:bg-red-500 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all italic shadow-[0_0_30px_rgba(220,38,38,0.4)]"
                        >
                            Confirmar Aborto
                        </button>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
