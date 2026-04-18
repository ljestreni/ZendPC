import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function Index({ cartItems, total }) {
    const { data, setData, post, processing, errors } = useForm({
        address: '',
        city: '',
        postal_code: '',
        phone: '',
        notes: '',
        payment_method: 'card', // Mock
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('checkout.store'));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="relative z-10">
                    <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase text-white mb-2">
                        Finalizar <span className="text-emerald-500">Orden</span>
                    </h2>
                    <p className="text-slate-400 font-medium uppercase tracking-[0.2em] text-[10px]">Verificación de manifiesto y logística de envío.</p>
                </div>
            }
        >
            <Head title="Checkout" />

            <div className="py-12 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    
                    {/* Left Side: Shipping Form */}
                    <div className="lg:col-span-7">
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="glass-card-premium p-8 rounded-[2.5rem] border border-white/5"
                        >
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 border border-emerald-500/10 shadow-[0_0_15px_rgba(16, 185, 129,0.2)]">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-black italic uppercase tracking-tight text-white">Datos de Envío</h3>
                            </div>

                            <form onSubmit={submit} className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 ml-1">Dirección Completa</label>
                                    <input
                                        type="text"
                                        value={data.address}
                                        onChange={e => setData('address', e.target.value)}
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-emerald-500/50 focus:ring-0 transition-all placeholder:text-slate-600"
                                        placeholder="Ej: Calle Gran Vía 1, 4B"
                                        minLength={5}
                                        maxLength={100}
                                        required
                                    />
                                    {errors.address && <div className="text-red-400 text-xs mt-2 ml-1 font-bold italic">{errors.address}</div>}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 ml-1">Ciudad</label>
                                        <input
                                            type="text"
                                            value={data.city}
                                            onChange={e => {
                                                // Permitir solo letras y espacios
                                                const value = e.target.value.replace(/[^a-zA-Z\s\u00C0-\u017F-]/g, '');
                                                setData('city', value);
                                            }}
                                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-emerald-500/50 focus:ring-0 transition-all"
                                            placeholder="Madrid"
                                            pattern="^[\p{L}\s\-]+$"
                                            title="La ciudad solo puede contener letras"
                                            minLength={2}
                                            maxLength={50}
                                            required
                                        />
                                        {errors.city && <div className="text-red-400 text-xs mt-2 ml-1 font-bold italic">{errors.city}</div>}
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 ml-1">Código Postal</label>
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            value={data.postal_code}
                                            onChange={e => {
                                                // Permitir solo números y limitar a 5
                                                const value = e.target.value.replace(/\D/g, '').slice(0, 5);
                                                setData('postal_code', value);
                                            }}
                                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-emerald-500/50 focus:ring-0 transition-all"
                                            placeholder="28001"
                                            pattern="^(?:0[1-9]|[1-4]\d|5[0-2])\d{3}$"
                                            title="Introduce un código postal válido (Ej: 28001)"
                                            maxLength={5}
                                            required
                                        />
                                        {errors.postal_code && <div className="text-red-400 text-xs mt-2 ml-1 font-bold italic">{errors.postal_code}</div>}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 ml-1">Teléfono de Contacto</label>
                                    <input
                                        type="tel"
                                        inputMode="numeric"
                                        value={data.phone}
                                        onChange={e => {
                                            // Solo números, max 9
                                            const value = e.target.value.replace(/\D/g, '').slice(0, 9);
                                            setData('phone', value);
                                        }}
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-emerald-500/50 focus:ring-0 transition-all"
                                        placeholder="600 000 000"
                                        pattern="^[6789]\d{8}$"
                                        title="Introduce un número móvil o fijo de 9 dígitos (ej: 600123456)"
                                        maxLength={9}
                                        required
                                    />
                                    {errors.phone && <div className="text-red-400 text-xs mt-2 ml-1 font-bold italic">{errors.phone}</div>}
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 ml-1">Notas del Pedido (Opcional)</label>
                                    <textarea
                                        value={data.notes}
                                        onChange={e => setData('notes', e.target.value)}
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-emerald-500/50 focus:ring-0 transition-all min-h-[120px]"
                                        placeholder="Ej: Llamar antes de entregar..."
                                    ></textarea>
                                </div>

                                <div className="pt-2 border-t border-white/5">
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4 ml-1">Método de Pago</label>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div 
                                            onClick={() => setData('payment_method', 'card')}
                                            className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${data.payment_method === 'card' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' : 'bg-white/[0.02] border-white/5 text-slate-400 hover:bg-white/[0.04]'}`}
                                        >
                                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                                            <span className="text-[9px] font-black uppercase tracking-widest">Tarjeta</span>
                                        </div>
                                        <div 
                                            onClick={() => setData('payment_method', 'paypal')}
                                            className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${data.payment_method === 'paypal' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' : 'bg-white/[0.02] border-white/5 text-slate-400 hover:bg-white/[0.04]'}`}
                                        >
                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.19a2.008 2.008 0 0 0-1.981 1.661l-1.574 9.926h4.61l1.184-7.513c.082-.517.526-.9 1.05-.9H16c3.051 0 5.626-1.165 6.404-5.111.207-1.049.259-2.008.06-2.906-.118-.58-.337-1.171-.787-1.597l-.271-.284z"/></svg>
                                            <span className="text-[9px] font-black uppercase tracking-widest">PayPal</span>
                                        </div>
                                        <div 
                                            onClick={() => setData('payment_method', 'transfer')}
                                            className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${data.payment_method === 'transfer' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' : 'bg-white/[0.02] border-white/5 text-slate-400 hover:bg-white/[0.04]'}`}
                                        >
                                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" /></svg>
                                            <span className="text-[9px] font-black uppercase tracking-widest">Transferencia</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(16, 185, 129,0.3)] transition-all disabled:opacity-50 flex items-center justify-center gap-3 italic"
                                    >
                                        {processing ? 'Procesando Transmisión...' : (
                                            <>
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                                                Confirmar Pedido Industrial
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>

                    {/* Right Side: Order Summary */}
                    <div className="lg:col-span-5">
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="sticky top-32"
                        >
                            <div className="glass-card-premium rounded-[2.5rem] overflow-hidden border border-white/5">
                                <div className="bg-white/[0.02] p-8 border-b border-white/5">
                                    <h3 className="text-xl font-black italic uppercase tracking-tight text-white mb-1">Resumen del <span className="text-emerald-500">Sistema</span></h3>
                                    <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest">Verificación de componentes</p>
                                </div>
                                
                                <div className="p-8 space-y-6 max-h-[400px] overflow-y-auto custom-scrollbar">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="flex gap-4 items-center">
                                            <div className="w-16 h-16 rounded-xl bg-white flex-shrink-0 p-2 flex items-center justify-center overflow-hidden">
                                                <img src={item.image || '/images/placeholder-component.png'} alt={item.name} className="w-full h-full object-contain mix-blend-multiply drop-shadow-sm" />
                                            </div>
                                            <div className="flex-grow">
                                                <div className="text-xs font-black text-white italic line-clamp-1 uppercase underline decoration-emerald-500/30">{item.name}</div>
                                                <div className="text-[10px] text-slate-500 font-bold">CANTIDAD: {item.quantity}</div>
                                            </div>
                                            <div className="text-sm font-black text-white italic">
                                                {(item.price * item.quantity).toLocaleString('es-ES')} €
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="p-8 bg-emerald-500/5 border-t border-white/10">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <div className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-1">Total Final</div>
                                            <div className="text-4xl font-black text-white italic tracking-tighter leading-none">
                                                {total.toLocaleString('es-ES')} <span className="text-emerald-500 text-2xl">€</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-emerald-500/50 text-[10px] font-black uppercase">IVA Incluido</div>
                                            <div className="text-slate-500 text-[10px] font-black uppercase">Envío Gratuito</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 flex items-center gap-4 px-8 text-slate-500">
                                <svg className="w-5 h-5 flex-shrink-0 text-emerald-500/40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                                <p className="text-[9px] font-bold uppercase tracking-widest leading-relaxed">
                                    Transacción encriptada bajo protocolos de seguridad industrial de ZendPC Core.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
