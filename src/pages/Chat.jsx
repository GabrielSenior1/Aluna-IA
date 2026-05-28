import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Chat() {
  const location = useLocation();
  const currentPath = location.pathname;
  const chatEndRef = useRef(null);

  // Estados de la conversación
  const [messages, setMessages] = useState([
    {
      id: "welc-01",
      sender: 'ai',
      text: '¡Hola, compañero pescador! Soy Aluna IA, tu asistente virtual para la cuenca del Río Ciénaga. Estoy conectada en tiempo real a los sensores. Pregúntame sobre el estado del agua, la marea o recomendaciones para tus redes hoy.'
    }
  ]);
  const [input, setInput] = useState('');
  const [activeReading, setActiveReading] = useState(null);
  const [isAiTyping, setIsAiTyping] = useState(false);

  // Función para procesar y renderizar negritas con ** (evita el texto plano con asteriscos)
  const renderMessageText = (text) => {
    if (!text) return '';
    const parts = text.split('**');
    return parts.map((part, index) => {
      // Los índices impares son los textos que estaban dentro de **
      return index % 2 === 1 ? <strong key={index} className="font-extrabold">{part}</strong> : part;
    });
  };

  // Auto-scroll al final del chat al recibir mensajes
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAiTyping]);

  // EFECTO DE INTEGRACIÓN: Detectar si venimos del Dashboard con una lectura inyectada en el state
  useEffect(() => {
    if (location.state && location.state.reading) {
      const reading = location.state.reading;
      setActiveReading(reading);
      
      // Inyectar el mensaje del usuario con los datos de hardware
      const userMessageText = `Compañero Aluna, he tomado una lectura directa de los sensores en el Río Ciénaga:\n• pH: ${reading.ph}\n• Conductividad: ${reading.conductivity} µS/cm\n• Temperatura: ${reading.temperature}°C\n\n¿Me podrías dar un análisis de estos parámetros y tus mejores recomendaciones para tirar la atarraya hoy?`;
      
      const userMsgId = "injected-user-" + Date.now();
      const newMessages = [
        ...messages,
        {
          id: userMsgId,
          sender: 'user',
          text: userMessageText
        }
      ];
      
      setMessages(newMessages);
      setIsAiTyping(true);

      // Respuesta adaptada de la IA al recibir estos parámetros reales
      setTimeout(() => {
        setIsAiTyping(false);
        
        // Algoritmo de respuesta inteligente contextualizada
        let phComment = "";
        if (reading.ph >= 7.0 && reading.ph <= 7.8) {
          phComment = `El pH de **${reading.ph}** está en un rango neutro-ligeramente alcalino perfecto. Esto significa que el agua tiene una salud biológica excelente en este sector, sin presencia de vertimientos ácidos ni contaminantes industriales.`;
        } else if (reading.ph < 7.0) {
          phComment = `El pH de **${reading.ph}** está un poco bajo (ácido). Si ha llovido en la parte alta de la cuenca, podría ser por escorrentía orgánica natural, pero mantente atento si baja de 6.5.`;
        } else {
          phComment = `El pH de **${reading.ph}** es alcalino. Monitorea si sube de 8.5, ya que niveles muy altos dificultan la respiración de peces jóvenes.`;
        }

        let condComment = "";
        if (reading.conductivity < 250) {
          condComment = `La conductividad de **${reading.conductivity} µS/cm** es baja y saludable. Indica agua de vertiente dulce muy limpia, idónea para especies de agua dulce corriente arriba.`;
        } else if (reading.conductivity >= 250 && reading.conductivity <= 400) {
          condComment = `La conductividad de **${reading.conductivity} µS/cm** es moderada. Es común en la desembocadura debido a la mezcla salobre sutil con el mar Caribe, lo que atrae especies mixtas.`;
        } else {
          condComment = `La conductividad es de **${reading.conductivity} µS/cm**, un valor alto que podría indicar alta salinidad o presencia excesiva de sales minerales.`;
        }

        let tempComment = "";
        if (reading.temperature >= 26 && reading.temperature <= 29) {
          tempComment = `La temperatura de **${reading.temperature}°C** es la ideal para esta época del año en el Caribe Colombiano. El agua cálida acelera el metabolismo de los peces, haciéndolos más propensos a buscar alimento activamente en la superficie o la desembocadura al caer la tarde.`;
        } else if (reading.temperature < 26) {
          tempComment = `El agua está algo fresca (**${reading.temperature}°C**). Los peces como el Sábalo podrían estar en zonas más profundas buscando termoclinas cálidas.`;
        } else {
          tempComment = `El agua está muy cálida (**${reading.temperature}°C**). Los niveles de oxígeno disuelto podrían disminuir un poco; los peces buscarán corrientes rápidas o áreas con sombra vegetal.`;
        }

        const aiResponse = `¡Recibido, compañero! Excelente lectura tomada en la estación del Río Ciénaga. Aquí tienes mi análisis técnico y recomendaciones de pesca basadas en estos datos:

1. 🧪 **Análisis Químico (pH - ${reading.ph}):** ${phComment}

2. ⚡ **Conductividad (${reading.conductivity} µS/cm):** ${condComment}

3. 🌡️ **Temperatura (${reading.temperature}°C):** ${tempComment}

🌊 **Recomendaciones de Pesca para hoy:**
• **Especies Activas:** Con estas condiciones óptimas de agua dulce limpia y temperatura cálida, la **Lisa**, el **Róbalo** y el **Macabí** estarán activos cerca de la desembocadura y manglares.
• **Arte de Pesca Sugerido:** La conductividad baja nos dice que el agua no está densa; te recomiendo usar una **Atarraya de nylon fino (ojo de malla mediano)** para no espantar al cardumen en agua clara.
• **Mejor Hora:** El atardecer (de 4:30 PM a 6:30 PM) será el momento pico, cuando baje el sol y los peces suban a alimentarse en las corrientes del río mezcladas con la brisa costera.

¿Tienes alguna red en particular preparada, o quieres que analicemos algún sector del río específico?`;

        setMessages(prev => [
          ...prev,
          {
            id: "injected-ai-" + Date.now(),
            sender: 'ai',
            text: aiResponse
          }
        ]);
      }, 2500); // Latencia simulando procesamiento neuronal profundo de la IA
      
      // Limpiar el estado de ubicación para evitar inyecciones repetidas al recargar
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Manejo de envío manual de mensajes
  const handleSend = () => {
    if (input.trim()) {
      const userText = input;
      const userMsgId = "user-" + Date.now();
      
      setMessages(prev => [...prev, { id: userMsgId, sender: 'user', text: userText }]);
      setInput('');
      setIsAiTyping(true);

      setTimeout(() => {
        setIsAiTyping(false);
        let reply = "Entendido, compañero. Estoy analizando esa consulta.";
        const lowerInput = userText.toLowerCase();

        if (lowerInput.includes('hola') || lowerInput.includes('buenos días') || lowerInput.includes('buenas') || lowerInput.includes('saludos')) {
          reply = "¡Hola! Qué gusto saludarte, compañero del río. Soy Aluna IA. ¿Qué tal va la jornada de pesca hoy? ¿Quieres que analicemos algún dato?";
        } else if (lowerInput.includes('pesca') || lowerInput.includes('redes') || lowerInput.includes('peces') || lowerInput.includes('lisa')) {
          reply = "Para la pesca de la Lisa en el Río Ciénaga, el pH óptimo es entre 7.2 y 7.6. Si los sensores muestran agua dulce limpia, tira tus redes cerca de las raíces de los manglares en la marea bajante.";
        } else if (lowerInput.includes('temperatura') || lowerInput.includes('calor')) {
          if (activeReading) {
            reply = `Actualmente tenemos una temperatura activa en memoria de **${activeReading.temperature}°C** tomada por tu medidor. Está en un rango excelente. Recuerda que a mayor calor, el oxígeno disminuye, así que busca áreas con corriente en movimiento.`;
          } else {
            reply = "El Río Ciénaga suele mantenerse entre 26°C y 29°C. Te sugiero conectar el medidor en el Dashboard y registrar una lectura para darte un reporte preciso.";
          }
        } else if (lowerInput.includes('ph') || lowerInput.includes('ácido')) {
          if (activeReading) {
            reply = `El pH activo en nuestro análisis es de **${activeReading.ph}**. Como es neutro, los peces no sufren estrés osmótico. Si llegara a bajar de 6.0, repórtalo, ya que podría indicar escorrentías contaminadas.`;
          } else {
            reply = "Un pH de 7.0 a 7.8 es perfecto para el río. Te invito a hacer una lectura física con el sensor en el Dashboard para evaluar el estado actual del agua.";
          }
        } else if (lowerInput.includes('atarraya') || lowerInput.includes('anzuelo') || lowerInput.includes('carnada')) {
          reply = "Si usas atarraya, el agua clara exige lances rápidos y sigilo. Como carnada, el camarón vivo o la carnada blanca fresca son los mejores estimulantes para el Róbalo en la desembocadura.";
        } else if (lowerInput.includes('firebase') || lowerInput.includes('guardar')) {
          reply = "Las lecturas que tomas se guardan automáticamente en la colección de Firebase de forma segura. Eso nos permite llevar un histórico para ver cómo cambia el río según las lluvias o la época del año.";
        }

        setMessages(prev => [
          ...prev,
          {
            id: "ai-" + Date.now(),
            sender: 'ai',
            text: reply
          }
        ]);
      }, 1200);
    }
  };

  return (
    <div className="bg-surface text-on-surface h-screen flex flex-col font-body-lg overflow-hidden pb-16 md:pb-0">
      
      {/* TopAppBar Premium (Sin Login) */}
      <header className="fixed top-0 w-full z-40 bg-surface/85 backdrop-blur-xl border-b border-outline-variant/15 shadow-sm flex justify-between items-center px-margin-mobile md:px-margin-desktop h-16 transition-all duration-300">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-md">
            <span className="material-symbols-outlined text-white text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>water_drop</span>
          </div>
          <span className="text-headline-md font-headline-md font-bold text-primary">Aluna IA</span>
          <span className="hidden sm:inline-block bg-primary/10 text-primary text-[11px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Asistente Virtual</span>
        </div>
        
        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/dashboard" className="text-on-surface-variant hover:text-primary transition-colors px-3 py-2 rounded-lg duration-150 flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">waves</span> Estación Ciénaga
          </Link>
          <Link to="/chat" className="text-primary font-bold hover:bg-surface-container-high/40 transition-colors px-3 py-2 rounded-lg duration-150 flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">assistant</span> Aluna Chat
          </Link>
          <Link to="/hardware" className="text-on-surface-variant hover:text-primary transition-colors px-3 py-2 rounded-lg duration-150 flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">map</span> Hardware
          </Link>
        </nav>

        <div className="flex items-center gap-2 text-primary">
          <span className="material-symbols-outlined hover:bg-surface-container-high/50 transition-colors p-2 rounded-full cursor-pointer active:scale-95 duration-150">
            support_agent
          </span>
        </div>
      </header>
      
      {/* Área del Contenido del Chat */}
      <div className="flex flex-1 pt-16 overflow-hidden relative">
        
        {/* Sidebar Lateral (Desktop) - Muestra el estado del sensor cargado */}
        <aside className="hidden lg:flex w-80 bg-surface-container-low border-r border-outline-variant/15 flex-col h-full relative z-10 shadow-sm p-6">
          <h2 className="text-headline-md font-bold text-on-surface mb-4">Contexto de IA</h2>
          
          <p className="text-body-sm text-on-surface-variant mb-6">
            Aluna analiza los datos activos del medidor para entregarte sugerencias precisas en el Río Ciénaga.
          </p>

          {activeReading ? (
            <div className="space-y-5">
              <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4.5 space-y-4">
                <div className="flex items-center gap-2.5 text-primary">
                  <span className="material-symbols-outlined text-[20px]">sensors</span>
                  <span className="text-label-caps font-bold tracking-wider">Sensores Activos</span>
                </div>
                
                <div className="divide-y divide-outline-variant/10 text-body-sm">
                  <div className="py-2.5 flex justify-between">
                    <span className="text-on-surface-variant font-medium">Potencial pH</span>
                    <span className="font-bold text-primary">{activeReading.ph}</span>
                  </div>
                  <div className="py-2.5 flex justify-between">
                    <span className="text-on-surface-variant font-medium">Conductividad</span>
                    <span className="font-bold text-secondary">{activeReading.conductivity} µS</span>
                  </div>
                  <div className="py-2.5 flex justify-between">
                    <span className="text-on-surface-variant font-medium">Temperatura</span>
                    <span className="font-bold text-tertiary">{activeReading.temperature}°C</span>
                  </div>
                </div>

                <div className="text-[11px] text-neutral text-center bg-surface p-2 rounded-lg border border-outline-variant/5">
                  Estación: Desembocadura
                </div>
              </div>

              <button
                onClick={() => {
                  setActiveReading(null);
                  setMessages(prev => [
                    ...prev,
                    {
                      id: "system-reset-" + Date.now(),
                      sender: 'ai',
                      text: "🔄 Se ha limpiado el contexto del sensor. Ahora puedes chatear libremente o volver al Dashboard para tomar una nueva lectura del medidor."
                    }
                  ]);
                }}
                className="w-full border border-error/30 text-error hover:bg-error/5 py-2.5 rounded-xl text-body-sm font-bold transition-all active:scale-98 flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">delete</span>
                Limpiar Datos Activos
              </button>
            </div>
          ) : (
            <div className="bg-surface-container-high/40 border border-outline-variant/20 rounded-2xl p-6 text-center text-neutral space-y-3">
              <span className="material-symbols-outlined text-[44px] text-outline/35">sensors_off</span>
              <p className="text-body-sm">No hay mediciones activas cargadas en la memoria de Aluna.</p>
              <Link 
                to="/dashboard" 
                className="inline-block text-primary text-xs font-bold hover:underline"
              >
                Ir a Dashboard y conectar medidor →
              </Link>
            </div>
          )}
        </aside>
        
        {/* Canvas de Mensajes */}
        <main className="flex-1 flex flex-col h-full bg-background relative overflow-hidden">
          
          {/* Mobile Sensor Banner */}
          {activeReading && (
            <div className="lg:hidden bg-primary/10 border-b border-primary/20 px-4 py-2.5 flex justify-between items-center text-body-sm font-semibold text-primary">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">sensors</span>
                <span>Datos Activos: pH {activeReading.ph} • Cond {activeReading.conductivity} µS • Temp {activeReading.temperature}°C</span>
              </div>
              <button 
                onClick={() => setActiveReading(null)} 
                className="material-symbols-outlined text-[16px] text-error hover:bg-error/10 p-1 rounded"
              >
                close
              </button>
            </div>
          )}
          
          {/* Caja de Mensajes con Scroll */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 pb-28">
            
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start items-start'}`}>
                
                {msg.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center mr-3 shrink-0 shadow-sm border border-primary/15 mt-0.5">
                    <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>assistant</span>
                  </div>
                )}
                
                <div className={`py-3.5 px-4.5 rounded-2xl shadow-sm text-body-lg whitespace-pre-line leading-relaxed max-w-[85%] md:max-w-[70%] border ${
                  msg.sender === 'user' 
                    ? 'bg-primary text-on-primary border-primary-container rounded-tr-sm' 
                    : 'bg-surface-container-lowest text-on-surface border-outline-variant/15 rounded-tl-sm'
                }`}>
                  {renderMessageText(msg.text)}
                </div>

              </div>
            ))}

            {/* AI Typing Indicator */}
            {isAiTyping && (
              <div className="flex justify-start items-start">
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center mr-3 shrink-0 shadow-sm border border-primary/15 animate-bounce">
                  <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>assistant</span>
                </div>
                <div className="bg-surface-container-lowest text-on-surface border border-outline-variant/15 py-4 px-6 rounded-2xl rounded-tl-sm flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  <span className="text-xs text-neutral font-semibold ml-2">Aluna IA analizando parámetros del río...</span>
                </div>
              </div>
            )}
            
            <div ref={chatEndRef} />
          </div>
          
          {/* Panel de Escritura Inferior */}
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-background via-background/95 to-transparent pt-12">
            <div className="max-w-3xl mx-auto flex items-end gap-2 bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-2.5 shadow-lg">
              
              <div className="flex-1 bg-surface-container/40 rounded-xl border border-outline-variant/10 flex items-center px-4 py-2 min-h-[44px]">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  disabled={isAiTyping}
                  className="w-full bg-transparent border-none focus:outline-none focus:ring-0 text-body-lg text-on-surface placeholder-neutral/70" 
                  placeholder={activeReading ? "Pregúntale a Aluna sobre esta medición..." : "Escribe un mensaje aquí..."} 
                />
              </div>

              {/* Botón de Enviar */}
              <button 
                onClick={handleSend}
                disabled={isAiTyping || !input.trim()}
                className="p-3.5 rounded-xl bg-primary text-on-primary hover:bg-primary/95 transition-all shadow-md active:scale-95 disabled:opacity-40 disabled:pointer-events-none shrink-0 flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  send
                </span>
              </button>

            </div>
          </div>

        </main>
      </div>
      
      {/* BottomNavBar (Móvil Únicamente) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-45 flex justify-around items-center h-16 bg-surface/85 backdrop-blur-xl border-t border-outline-variant/15 shadow-lg pb-safe">
        <Link to="/dashboard" className="flex flex-col items-center justify-center active:scale-90 transition-transform duration-150 text-on-surface-variant hover:text-primary">
          <span className="material-symbols-outlined">waves</span>
          <span className="text-[10px] uppercase font-bold mt-1">Estación</span>
        </Link>
        <Link to="/chat" className="flex flex-col items-center justify-center active:scale-90 transition-transform duration-150 text-primary font-bold">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>assistant</span>
          <span className="text-[10px] uppercase font-bold mt-1">Chatbot</span>
        </Link>
        <Link to="/hardware" className="flex flex-col items-center justify-center active:scale-90 transition-transform duration-150 text-on-surface-variant hover:text-primary">
          <span className="material-symbols-outlined">map</span>
          <span className="text-[10px] uppercase font-bold mt-1">Hardware</span>
        </Link>
      </nav>

    </div>
  );
}
