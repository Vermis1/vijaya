import { Metadata } from 'next';
import Link from 'next/link';
import RegisterForm from '@/components/auth/RegisterForm';

export const metadata: Metadata = {
  title: 'Registrarse - Vijaya',
  description: 'Crea tu cuenta en Vijaya',
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-vijaya-cream bg-texture py-12 px-6">
      <div className="w-full max-w-md animate-fade-in">
        {/* Logo */}
        <Link href="/" className="flex justify-center mb-10">
          <div className="flex items-center space-x-3">
            <div className="w-14 h-14 bg-vijaya-olive rounded-full flex items-center justify-center">
              <span className="text-white text-3xl">🌿</span>
            </div>
            <div className="text-4xl font-heading font-bold text-vijaya-black">
              Vijaya
            </div>
          </div>
        </Link>

        {/* Card */}
        <div className="vijaya-card p-8 md:p-10 bg-white">
          <h1 className="text-4xl font-heading font-bold text-vijaya-black mb-3 text-center">
            Únete
          </h1>
          <p className="text-gray-600 text-center mb-8">
            Forma parte de la comunidad
          </p>

          <RegisterForm />

          {/* Links */}
          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-600">
              ¿Ya tienes cuenta?{' '}
              <Link href="/login" className="text-vijaya-olive font-semibold hover:text-vijaya-green transition-colors">
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>

        {/* Terms */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Al registrarte, aceptas nuestros{' '}
            <Link href="/terms" className="text-vijaya-olive hover:text-vijaya-green transition-colors">
              Términos
            </Link>{' '}
            y{' '}
            <Link href="/privacy" className="text-vijaya-olive hover:text-vijaya-green transition-colors">
              Privacidad
            </Link>
          </p>
        </div>

        {/* Back to home */}
        <div className="mt-4 text-center">
          <Link href="/" className="inline-flex items-center text-sm text-gray-600 hover:text-vijaya-olive transition-colors font-medium">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}