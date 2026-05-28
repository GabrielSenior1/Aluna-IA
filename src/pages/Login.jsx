import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (username.toLowerCase() === 'admin' && password === 'admin125') {
      navigate('/dashboard');
    } else {
      setError('Credenciales incorrectas');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row font-body-lg overflow-hidden">
      
      {/* Left Side: Brand and Background */}
      <div className="relative w-full md:w-1/2 h-64 md:h-screen bg-surface-container-highest flex flex-col justify-end p-10 overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center transform transition-transform duration-[10s] hover:scale-110"
          style={{ backgroundImage: "url('./login-bg.png')" }}
        >
          {/* Gradient Overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#001a41] via-[#001a41]/60 to-transparent"></div>
        </div>

        {/* Content over image */}
        <div className="relative z-10">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 shadow-lg border border-white/20">
            <img src="./logo.png" alt="Logo" className="w-12 h-12 rounded-xl object-cover" />
          </div>
          <h1 className="text-display-lg font-display-lg text-white font-bold leading-tight drop-shadow-md">
            El futuro del monitoreo del agua.
          </h1>
          <p className="text-body-lg text-secondary-fixed mt-4 drop-shadow-md max-w-md">
            Monitoreo inteligente, en tiempo real y sin sesgos para la comunidad del Río Gaira.
          </p>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full md:w-1/2 h-[calc(100vh-16rem)] md:h-screen flex items-center justify-center bg-background px-6">
        <div className="w-full max-w-md">
          
          <div className="mb-10">
            <h2 className="text-headline-lg font-headline-lg font-bold text-on-surface mb-2">Bienvenido de nuevo</h2>
            <p className="text-body-lg text-on-surface-variant">Ingresa tus credenciales para acceder a la estación GAIRA-01.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="p-4 bg-error-container/50 border border-error-container text-error rounded-xl text-body-sm flex items-center gap-2 animate-pulse">
                <span className="material-symbols-outlined text-[20px]">error</span>
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="block text-label-caps font-label-caps text-on-surface-variant">USUARIO</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-outline">person</span>
                </div>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-surface-container-highest/50 border border-outline-variant/30 rounded-xl pl-12 pr-4 py-3.5 text-body-lg text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
                  placeholder="Ej: Admin"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-label-caps font-label-caps text-on-surface-variant">CONTRASEÑA</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-outline">lock</span>
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-surface-container-highest/50 border border-outline-variant/30 rounded-xl pl-12 pr-4 py-3.5 text-body-lg text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit" 
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="w-full bg-primary text-on-primary rounded-xl py-3.5 mt-8 text-body-lg font-bold hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-primary/30 flex items-center justify-center gap-2 relative overflow-hidden group"
            >
              <span>Ingresar al Sistema</span>
              <span className={`material-symbols-outlined transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`}>arrow_forward</span>
              {/* Shine effect */}
              <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-[shine_1s_ease-in-out]"></div>
            </button>
          </form>
          
        </div>
      </div>
      
    </div>
  );
}
