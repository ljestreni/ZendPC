import { usePage, router, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import debounce from 'lodash/debounce';

export default function CartDrawer({ isOpen, onClose }) {
    const { cart } = usePage().props;
    const [tempQuantities, setTempQuantities] = useState({});

    // Sync local state when cart props change (on mount or after server sync)
    useEffect(() => {
        if (cart?.items) {
            const initial = {};
            cart.items.forEach(item => {
                initial[item.id] = item.quantity;
            });
            setTempQuantities(initial);
        }
    }, [cart?.items]);

    // Backend sync debounced
    const debouncedSync = useCallback(
        debounce((id, quantity) => {
            router.post(route('cart.update'), { product_id: id, quantity }, { 
                preserveScroll: true, 
                preserveState: true,
                only: ['cart']
            });
        }, 500),
        []
    );

    const handleUpdate = (id, delta) => {
        const current = tempQuantities[id] || 0;
        const next = current + delta;
        if (next < 1) return;

        // Visual update (instant)
        setTempQuantities(prev => ({ ...prev, [id]: next }));
        // Debounced backend sync
        debouncedSync(id, next);
    };

    const removeItem = (id) => {
        router.post(route('cart.remove'), { product_id: id }, { 
            preserveScroll: true, 
            preserveState: true,
            only: ['cart']
        });
    };

    const checkout = () => {
        onClose();
        router.get(route('checkout.index'));
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                    />
                    
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-[400px] max-w-[90vw] bg-[#080a11]/95 backdrop-blur-xl border-l border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] z-[101] flex flex-col"
                    >
                        <div className="p-6 border-b border-emerald-500/20 flex justify-between items-center">
                            <h2 className="text-xl font-black text-white italic tracking-wider flex items-center gap-3">
                                <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                MI CESTA
                            </h2>
                            <button onClick={onClose} className="text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-xl transition-colors">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto styled-scrollbar p-6 space-y-4">
                            {!cart || cart.items.length === 0 ? (
                                <div className="text-center text-slate-500 mt-32">
                                    <svg className="w-16 h-16 mx-auto mb-6 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    <p className="font-black tracking-[0.2em] uppercase text-sm text-slate-400 relative">
                                        Tu cesta está vacía
                                    </p>
                                </div>
                            ) : (
                                cart.items.map((item) => (
                                    <div key={item.id} className="flex gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/30 transition-colors group">
                                        <div className="w-20 h-20 rounded-xl bg-white p-2 flex-shrink-0 flex items-center justify-center overflow-hidden">
                                            <img src={item.image} alt={item.name} className="max-w-full max-h-full object-contain mix-blend-multiply drop-shadow-sm" />
                                        </div>
                                        <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                                            <div>
                                                <Link href={route('catalog.show', item.slug)} className="text-sm font-bold text-slate-200 leading-tight hover:text-emerald-400 line-clamp-2 transition-colors" onClick={onClose}>
                                                    {item.name}
                                                </Link>
                                                <div className="text-emerald-400 font-black text-sm mt-1">{item.price}€</div>
                                            </div>
                                            <div className="flex items-center justify-between mt-3">
                                                <div className="flex items-center bg-black/40 rounded-lg p-1 border border-white/5 relative z-10">
                                                    <button onClick={() => handleUpdate(item.id, -1)} className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 rounded-md transition-colors">-</button>
                                                    <div className="w-8 text-center text-xs font-bold text-white">
                                                        {tempQuantities[item.id] ?? item.quantity}
                                                    </div>
                                                    <button onClick={() => handleUpdate(item.id, 1)} className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 rounded-md transition-colors">+</button>
                                                </div>
                                                <button onClick={() => removeItem(item.id)} className="text-slate-500 hover:text-red-400 transition-colors p-2 -mr-2 relative z-10" title="Eliminar">
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {cart && cart.items.length > 0 && (
                            <div className="p-6 border-t border-emerald-500/20 bg-[#0a0c16]/50">
                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-slate-400 font-bold uppercase tracking-widest text-xs">Total Pedido</span>
                                    <span className="text-2xl font-black text-white italic">{cart.total_price.toFixed(2)}€</span>
                                </div>
                                <button onClick={checkout} className="w-full py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-[0.2em] border border-emerald-500/50 shadow-[0_0_20px_rgba(16, 185, 129,0.3)] transition-all flex items-center justify-center gap-3">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    Procesar Pedido
                                </button>
                                <button onClick={() => router.post(route('cart.clear'), {}, { 
                                    preserveScroll: true, 
                                    preserveState: true,
                                    only: ['cart']
                                })} className="w-full mt-4 py-2 text-xs font-bold text-slate-500 hover:text-red-400 uppercase tracking-widest transition-colors flex items-center justify-center gap-2">
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    Vaciar Cesta
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
