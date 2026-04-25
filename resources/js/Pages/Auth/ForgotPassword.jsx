import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import { Head, useForm, Link } from '@inertiajs/react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <div className="min-h-screen bg-dark-bg flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-zend-600/20 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-600/20 rounded-full blur-[120px] pointer-events-none"></div>
            
            <Head title="Recuperar Contraseña" />

            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 flex flex-col items-center">
                <Link href="/" className="flex items-center gap-3">
                    <img src="/logo.png" alt="ZendPC Logo" className="w-16 h-16 object-contain drop-shadow-[0_0_15px_rgba(52, 211, 153,0.5)] rounded-2xl" />
                    <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-zend-400 to-zend-200 tracking-tight">ZendPC</h1>
                </Link>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
                    Recuperar Acceso
                </h2>
                <div className="mt-4 mb-4 text-center text-sm text-slate-400 leading-relaxed">
                    ¿Olvidaste tu contraseña? No hay problema. Simplemente dinos tu dirección de correo electrónico y te enviaremos un enlace para restablecerla que te permitirá elegir una nueva.
                </div>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <div className="glass-panel py-8 px-4 shadow sm:rounded-2xl sm:px-10 border border-dark-border">
                    {status && (
                        <div className="mb-6 text-sm font-medium text-emerald-400 bg-emerald-400/10 p-4 rounded-xl border border-emerald-500/20 italic">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <InputLabel htmlFor="email" value="Correo Electrónico" className="text-slate-300" />
                            <div className="mt-1">
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="input-field shadow-inner"
                                    isFocused={true}
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                            </div>
                            <InputError message={errors.email} className="mt-2 text-red-400" />
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full btn-primary flex justify-center py-3 text-lg"
                            >
                                Enviar Enlace de Restablecimiento
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            
            <div className="absolute top-6 left-6 z-20">
                 <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                     <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                     Volver al Inicio
                 </Link>
            </div>
        </div>
    );
}
