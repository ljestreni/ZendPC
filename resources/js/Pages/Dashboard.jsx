import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ configuracionesGuardadas }) {
    const totalSpent = configuracionesGuardadas.reduce((acc, config) => acc + parseFloat(config.total_price), 0);
    const buildCount = configuracionesGuardadas.length;

    return (
        <AuthenticatedLayout
            header={
                <div className="relative z-10">
                    <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase text-white mb-2">
                        Mi <span className="text-emerald-500">Taller</span>
                    </h2>
                    <p className="text-slate-400 font-medium uppercase tracking-[0.2em] text-[10px]">Espacio de trabajo de grado industrial.</p>
                </div>
            }
        >
            <Head title="Mi Taller - ZendPC" />
            <div className="py-12 relative z-10">

                {/* User Stats Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="glass-card-premium p-8 rounded-[2rem] flex items-center gap-6 border border-white/5 hover:border-emerald-500/20 transition-all">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 border border-emerald-500/10 shadow-[0_0_20px_rgba(16, 185, 129,0.2)]">
                             <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" /></svg>
                        </div>
                        <div>
                             <div className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Montajes Totales</div>
                             <div className="text-3xl font-black text-white italic tracking-tighter leading-none">{buildCount}</div>
                        </div>
                    </div>
                    
                    <div className="glass-card-premium p-8 rounded-[2rem] flex items-center gap-6 border border-white/5 hover:border-emerald-500/20 transition-all">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 border border-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                             <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <div>
                             <div className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Valor del Portfolio</div>
                             <div className="text-3xl font-black text-white italic tracking-tighter leading-none">{totalSpent.toLocaleString('es-ES')} <span className="text-emerald-500 text-xl">€</span></div>
                        </div>
                    </div>

                    <div className="flex flex-col justify-center">
                         <Link href={route('builder.index')} className="px-10 py-5 bg-emerald-600 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(16, 185, 129,0.4)] hover:bg-emerald-500 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 text-sm italic">
                             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                             Nuevo Proyecto
                         </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {configuracionesGuardadas && configuracionesGuardadas.length > 0 ? (
                        configuracionesGuardadas.map((config) => (
                            <div key={config.id} className="glass-card-premium rounded-[2.5rem] overflow-hidden flex flex-col group border border-white/5 hover:border-emerald-500/30 transition-all duration-500">
                                <div className="h-28 bg-white/[0.02] border-b border-white/5 p-8 flex justify-between items-center group-hover:bg-white/[0.04] transition-colors">
                                     <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(16, 185, 129,0.2)]">
                                          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                     </div>
                                     <div className="text-right">
                                          <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-2">Manifiesto de Montaje</div>
                                          <div className="text-2xl font-black text-white italic leading-none">{Number(config.total_price).toLocaleString('es-ES')} €</div>
                                     </div>
                                </div>
                                
                                <div className="p-8 flex-grow">
                                     <h3 className="text-xl font-black italic uppercase tracking-tight text-white mb-6 group-hover:text-emerald-300 transition-colors leading-tight">{config.name}</h3>
                                     
                                     {/* Mocking a list of components based on logic if available or just placeholders */}
                                     {/* Usually savedConfig has a components JSON */}
                                     <div className="text-sm text-slate-400 space-y-2">
                                          <div className="flex items-center gap-2">
                                               <div className="w-1.5 h-1.5 rounded-full bg-zend-500"></div>
                                               <span>Configuración balanceada</span>
                                          </div>
                                          <div className="flex items-center gap-2">
                                               <div className="w-1.5 h-1.5 rounded-full bg-slate-600"></div>
                                               <span>Actualizado: {new Date(config.updated_at).toLocaleDateString()}</span>
                                          </div>
                                     </div>
                                </div>

                                <div className="p-4 bg-dark-bg/50 border-t border-dark-border flex gap-2">
                                     <a 
                                         href={route('export.config.pdf', config.id)}
                                         target="_blank"
                                         rel="noopener noreferrer"
                                         className="btn-secondary flex-1 text-center py-2 px-0 text-sm flex items-center justify-center gap-2"
                                     >
                                         <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                                         Ficha PDF
                                     </a>
                                     <button className="btn-secondary w-12 flex items-center justify-center p-0">
                                          <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                     </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center flex flex-col items-center glass-panel rounded-3xl">
                            <div className="w-20 h-20 bg-dark-border rounded-full flex items-center justify-center text-slate-600 mb-6">
                                 <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Aún no hay proyectos</h3>
                            <p className="text-slate-400 mb-8 max-w-sm">Parece que tu taller está vacío. Empieza a configurar tu próxima bestia ahora mismo.</p>
                            <Link href={route('builder.index')} className="btn-primary py-3 px-8">
                                Ir al Configurador
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

