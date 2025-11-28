import { Metadata } from 'next';
import Link from 'next/link';
import LoginForm from '@/components/auth/LoginForm';

export const metadata: Metadata = {
  title: 'Iniciar Sesión - Vijaya',
  description: 'Inicia sesión en tu cuenta de Vijaya',
};

export default function LoginPage() {
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
            Bienvenido de nuevo
          </h1>
          <p className="text-gray-600 text-center mb-8">
            Ingresa tus credenciales para continuar
          </p>

          <LoginForm />

          {/* Links */}
          <div className="mt-6 text-center space-y-2">
            <Link 
              href="/forgot-password" 
              className="block text-sm text-vijaya-green hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </Link>
            <p className="text-sm text-gray-600">
              ¿No tienes cuenta?{' '}
              <Link href="/register" className="text-vijaya-green font-medium hover:underline">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>

        {/* Back to home */}
        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-gray-600 hover:text-vijaya-green transition-colors">
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}