import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, usePage } from "@inertiajs/react";

export default function Index({ auth, categorias }) {
    const { flash } = usePage().props;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div>
                    <h2 className="text-3xl font-extrabold tracking-tight text-white mb-2">
                        Gestión de <span className="text-zend-500">Categorías</span>
                    </h2>
                    <p className="text-slate-400">Administra las categorías de los componentes del configurador.</p>
                </div>
            }
        >
            <Head title="Admin Categorías" />

            <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {flash.mensaje && (
                    <div className="bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 px-4 py-3 rounded-xl relative mb-6 flex items-center gap-3">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        <span className="block sm:inline">{flash.mensaje}</span>
                    </div>
                )}

                <div className="glass-panel rounded-3xl overflow-hidden shadow-2xl">
                    <div className="p-6 border-b border-dark-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-dark-bg/50">
                        <h3 className="text-xl font-bold text-white">Lista de Categorías</h3>
                        <Link
                            href={route("admin.categories.create")}
                            className="btn-primary py-2 px-6 flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                            Nueva Categoría
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-dark-card/50 border-b border-dark-border">
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-widest">Nombre</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-widest hidden md:table-cell">Slug</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-widest hidden lg:table-cell">Descripción</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-widest text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-dark-border">
                                {categorias && categorias.map((category) => (
                                    <tr key={category.id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-white group-hover:text-zend-400 transition-colors">{category.name}</div>
                                        </td>
                                        <td className="px-6 py-4 hidden md:table-cell">
                                            <span className="text-sm font-mono text-slate-400 bg-dark-bg px-2 py-1 rounded-md border border-dark-border">{category.slug}</span>
                                        </td>
                                        <td className="px-6 py-4 hidden lg:table-cell">
                                            <div className="text-sm text-slate-400 truncate max-w-xs">{category.description || '-'}</div>
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-3 whitespace-nowrap">
                                            <Link
                                                href={route("admin.categories.edit", category.id)}
                                                className="inline-flex items-center gap-1 text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                                Editar
                                            </Link>
                                            <Link
                                                href={route("admin.categories.destroy", category.id)}
                                                method="delete"
                                                as="button"
                                                className="inline-flex items-center gap-1 text-sm font-medium text-red-500 hover:text-red-400 transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                Eliminar
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        
                        {(!categorias || categorias.length === 0) && (
                            <div className="py-12 text-center flex flex-col items-center">
                                <div className="w-16 h-16 bg-dark-bg border border-dark-border rounded-full flex items-center justify-center text-slate-500 mb-4">
                                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                                </div>
                                <h4 className="text-white font-medium">Sin categorías</h4>
                                <p className="text-slate-500 text-sm mt-1">Aún no has creado ninguna categoría.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
