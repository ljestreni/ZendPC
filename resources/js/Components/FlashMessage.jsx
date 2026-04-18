import React, { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FlashMessage() {
    const { flash } = usePage().props;
    const [isVisible, setIsVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [type, setType] = useState('success');

    useEffect(() => {
        if (flash.success || flash.mensaje) {
            setMessage(flash.success || flash.mensaje);
            setType('success');
            setIsVisible(true);
        } else if (flash.error) {
            setMessage(flash.error);
            setType('error');
            setIsVisible(true);
        }
    }, [flash]);

    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                setIsVisible(false);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [isVisible]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                    className="fixed bottom-10 right-10 z-[100] max-w-md w-full"
                >
                    <div className={`p-1 rounded-[1.5rem] overflow-hidden ${
                        type === 'success' 
                        ? 'bg-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.2)]' 
                        : 'bg-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.2)]'
                    }`}>
                        <div className="bg-[#0f121d] rounded-[1.4rem] p-5 flex items-center gap-4 border border-white/5 relative overflow-hidden">
                            {/* Accent line */}
                            <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                                type === 'success' ? 'bg-emerald-500 shadow-[0_0_10px_emerald]' : 'bg-red-500 shadow-[0_0_10px_red]'
                            }`}></div>
                            
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                                type === 'success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                            }`}>
                                {type === 'success' ? (
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                                ) : (
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                )}
                            </div>

                            <div className="flex-grow">
                                <div className={`text-[9px] font-black uppercase tracking-[0.2em] mb-1 ${
                                    type === 'success' ? 'text-emerald-500' : 'text-red-500'
                                }`}>
                                    {type === 'success' ? 'Misión de Sistema Éxitosa' : 'Interrupción de Protocolo'}
                                </div>
                                <div className="text-white text-sm font-bold leading-tight">{message}</div>
                            </div>

                            <button onClick={() => setIsVisible(false)} className="text-slate-600 hover:text-white transition-colors">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
