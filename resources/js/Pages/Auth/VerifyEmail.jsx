import { Head, Link, useForm } from '@inertiajs/react';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <div className="min-h-screen bg-dark-bg flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-zend-600/20 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-600/20 rounded-full blur-[120px] pointer-events-none"></div>
            
            <Head title="Verificar Correo" />

            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 flex flex-col items-center">
                <Link href="/" className="flex items-center gap-3">
                    <img src="/logo.png" alt="ZendPC Logo" className="w-16 h-16 object-contain drop-shadow-[0_0_15px_rgba(52, 211, 153,0.5)] rounded-2xl" />
                    <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-zend-400 to-zend-200 tracking-tight">ZendPC</h1>
                </Link>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
                    Verifica tu Identidad
                </h2>
                <div className="mt-4 mb-4 text-center text-sm text-slate-400 leading-relaxed">
                    ¡Gracias por registrarte! Antes de comenzar, por favor verifica tu dirección de correo electrónico haciendo clic en el enlace que acabamos de enviarte. Si no has recibido el correo, con gusto te enviaremos otro.
                </div>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <div className="glass-panel py-8 px-4 shadow sm:rounded-2xl sm:px-10 border border-dark-border text-center">
                    {status === 'verification-link-sent' && (
                        <div className="mb-6 text-sm font-medium text-emerald-400 bg-emerald-400/10 p-4 rounded-xl border border-emerald-500/20 italic">
                            Se ha enviado un nuevo enlace de verificación a la dirección de correo electrónico que proporcionaste durante el registro.
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full btn-primary flex justify-center py-3 text-lg"
                            >
                                Reenviar Correo de Verificación
                            </button>
                        </div>

                        <div className="flex items-center justify-center">
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="text-sm text-slate-500 hover:text-white underline transition-colors focus:outline-none"
                            >
                                Cerrar Sesión
                            </Link>
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
