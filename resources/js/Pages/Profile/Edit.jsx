import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-4xl font-extrabold tracking-tight text-white mb-2">
                        Configuración de <span className="text-zend-500">Perfil</span>
                    </h2>
                    <p className="text-slate-400">Administra tu información de cuenta y seguridad.</p>
                </div>
            }
        >
            <Head title="Perfil - ZendPC" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-8 sm:px-6 lg:px-8">
                    <div className="glass-panel p-6 sm:rounded-3xl sm:p-10 border border-dark-border overflow-hidden relative">
                         <div className="absolute top-0 right-0 w-32 h-32 bg-zend-500/5 blur-3xl rounded-full"></div>
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl relative z-10"
                        />
                    </div>

                    <div className="glass-panel p-6 sm:rounded-3xl sm:p-10 border border-dark-border overflow-hidden relative">
                         <div className="absolute bottom-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full"></div>
                        <UpdatePasswordForm className="max-w-xl relative z-10" />
                    </div>

                    <div className="glass-panel p-6 sm:rounded-3xl sm:p-10 border border-red-500/10 overflow-hidden relative">
                        <DeleteUserForm className="max-w-xl" />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
