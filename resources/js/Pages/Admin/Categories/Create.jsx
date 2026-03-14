import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Create({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        image: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.categories.store'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div>
                    <h2 className="text-3xl font-extrabold tracking-tight text-white mb-2">
                        Nueva <span className="text-zend-500">Categoría</span>
                    </h2>
                    <p className="text-slate-400">Añade un nuevo tipo de componente al catálogo.</p>
                </div>
            }
        >
            <Head title="Crear Categoría" />

            <div className="py-12 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="glass-panel p-8 rounded-3xl shadow-2xl">
                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <label className="block text-slate-300 text-sm font-semibold mb-2" htmlFor="name">
                                Nombre de la Categoría
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="w-full bg-dark-bg/50 border border-dark-border text-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-zend-500 focus:border-transparent transition-all placeholder-slate-600"
                                placeholder="Ej: Tarjetas Gráficas"
                            />
                            {errors.name && <div className="text-red-400 text-sm mt-2 flex items-center gap-1"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>{errors.name}</div>}
                        </div>

                        <div>
                            <label className="block text-slate-300 text-sm font-semibold mb-2" htmlFor="description">
                                Descripción
                            </label>
                            <textarea
                                id="description"
                                value={data.description}
                                rows="4"
                                onChange={(e) => setData('description', e.target.value)}
                                className="w-full bg-dark-bg/50 border border-dark-border text-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-zend-500 focus:border-transparent transition-all placeholder-slate-600"
                                placeholder="Breve descripción de los componentes de esta categoría..."
                            />
                            {errors.description && <div className="text-red-400 text-sm mt-2 flex items-center gap-1"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>{errors.description}</div>}
                        </div>

                        <div>
                            <label className="block text-slate-300 text-sm font-semibold mb-2" htmlFor="image">
                                URL de la Imagen
                            </label>
                            <input
                                id="image"
                                type="text"
                                value={data.image}
                                onChange={(e) => setData('image', e.target.value)}
                                className="w-full bg-dark-bg/50 border border-dark-border text-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-zend-500 focus:border-transparent transition-all placeholder-slate-600"
                                placeholder="https://ejemplo.com/imagen.jpg"
                            />
                            {errors.image && <div className="text-red-400 text-sm mt-2 flex items-center gap-1"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>{errors.image}</div>}
                        </div>

                        <div className="flex items-center justify-end gap-4 pt-6 border-t border-dark-border mt-8">
                            <Link href={route('admin.categories.index')} className="text-slate-400 hover:text-white font-medium transition-colors">
                                Cancelar
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="btn-primary py-3 px-8 flex items-center gap-2"
                            >
                                {processing ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Guardando...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
                                        Crear Categoría
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
