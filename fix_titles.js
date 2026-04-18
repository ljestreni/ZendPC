import fs from 'fs';

const overrides = {
    'resources/js/Pages/Dashboard.jsx': '<Head title="Mi Taller" />',
    'resources/js/Pages/Checkout/Index.jsx': '<Head title="Checkout" />',
    'resources/js/Pages/Catalog/Index.jsx': '<Head title="Catálogo" />',
    'resources/js/Pages/Catalog/Show.jsx': '<Head title={producto.name} />',
    'resources/js/Pages/Profile/Edit.jsx': '<Head title="Perfil" />',
    'resources/js/Pages/Auth/Login.jsx': '<Head title="Iniciar Sesión" />',
    'resources/js/Pages/Auth/Register.jsx': '<Head title="Registro" />'
};

for (const [file, correctTitle] of Object.entries(overrides)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/<Head title=([\s\S]*?)\/>/g, correctTitle);
    fs.writeFileSync(file, content);
}
console.log('Fixed titles');
