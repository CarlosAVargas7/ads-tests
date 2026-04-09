import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';

export const SuccessPage: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-center px-4">
            <SEO title="Éxito | Registro Completado" desc="Página de agradecimiento del laboratorio" />
            <div className="text-6xl mb-6">??</div>
            <h1 className="text-4xl font-bold text-gray-100 mb-2">¡Gracias por tu registro!</h1>
            <p className="text-gray-400 mb-8 text-lg max-w-md">
                Esta es la <strong>Thank You Page</strong>. Úsala para configurar conversiones basadas en URL en Google Ads.
            </p>
            <Link to="/" className="text-indigo-400 font-medium hover:underline">
                ? Volver al inicio
            </Link>
        </div>
    );
};
