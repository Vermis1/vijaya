import { Metadata } from 'next';
import Link from 'next/link';
import RegisterForm from '@/components/auth/RegisterForm';

export const metadata: Metadata = {
  title: 'Registrarse - Vijaya',
  description: 'Crea tu cuenta en Vijaya',
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-vijaya-beige to-vijaya-lime/20 py-12 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex justify-center mb-8">
          <div className="text-4xl font-heading font-bold text-vijaya-green">
            Vijaya
          </div>
        </Link>

        {/* Card */}
        <div className="vijaya-card p-8">
          <h1 className="text-3xl font-heading font-bold text-vijaya-black mb-2 text-center">
            Únete a Vijaya
          </h1>
          <p className="text-gray-600 text-center mb-8">
            Crea tu cuenta y forma parte de la comunidad
          </p>

          <RegisterForm />

          {/* Links */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿Ya tienes cuenta?{' '}
              <Link href="/login" className="text-vijaya-green font-medium hover:underline">
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>

        {/* Terms */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Al registrarte, aceptas nuestros{' '}
            <Link href="/terms" className="text-vijaya-green hover:underline">
              Términos de Servicio
            </Link>{' '}
            y{' '}
            <Link href="/privacy" className="text-vijaya-green hover:underline">
              Política de Privacidad
            </Link>
          </p>
        </div>

        {/* Back to home */}
        <div className="mt-4 text-center">
          <Link href="/" className="text-sm text-gray-600 hover:text-vijaya-green transition-colors">
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}