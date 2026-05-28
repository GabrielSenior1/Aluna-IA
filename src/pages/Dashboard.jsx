import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { firebaseService } from '../services/firebaseService';

// Configuración de Estados del Río Ciénaga (Bueno, Malo, Normal)
const statusConfig = {
  "Óptimo": {
    bg: "bg-[#e6f4ea] text-[#137333] border-[#c3e6cb] dark:bg-[#137333]/25 dark:text-[#a3e6b5]",
    icon: "check_circle",
    title: "Ciénaga Saludable e Ideal",
    desc: "El pH equilibrado y la baja conductividad descartan contaminación. La temperatura templada acelerará el metabolismo de especies como la Lisa y el Róbalo, haciéndolas muy receptivas a las redes.",
    bannerBg: "from-success/20 to-secondary/15 bg-gradient-to-br border-success/30",
    bannerBadgeBg: "bg-[#e6f4ea] text-[#137333] dark:bg-[#137333]/40 dark:text-[#a3e6b5]",
    bannerBadgeText: "ESTADO ÓPTIMO",
    bannerTitle: "Condición del Agua: Óptima para Pesca",
    bannerDesc: "Las condiciones actuales son excelentes para la actividad pesquera artesanal. Agua limpia y sana.",
    bannerIcon: "waves"
  },
  "Crítico": {
    bg: "bg-error-container/45 text-error border-error-container/30 dark:bg-error/20 dark:text-error-container",
    icon: "warning",
    title: "Alerta por Contaminación/Estrés",
    desc: "pH fuertemente ácido detectado en la Ciénaga. La altísima conductividad sugiere escorrentías agrícolas con pesticidas o vertimientos químicos nocivos. La temperatura superior a 32°C disminuye drásticamente el oxígeno disuelto. Peligro de asfixia en cardúmenes. No se recomienda la pesca.",
    bannerBg: "from-error/15 to-transparent bg-gradient-to-b border-error/35",
    bannerBadgeBg: "bg-error text-on-primary font-extrabold animate-pulse",
    bannerBadgeText: "ALERTA CRÍTICA",
    bannerTitle: "Condición del Agua: Peligro / Vertimientos",
    bannerDesc: "Valores críticos detectados. Posible vertimiento contaminante o escorrentía ácida. Pesca desaconsejada.",
    bannerIcon: "gpp_bad"
  },
  "Regular": {
    bg: "bg-warning/15 text-[#b78103] border-warning/35 dark:bg-[#b78103]/20 dark:text-warning",
    icon: "info",
    title: "Condiciones Regulares / Intermedias",
    desc: "El pH y la conductividad están dentro de límites tolerables, típicos del período de transición de mareas en la Ciénaga. El agua está algo cálida, por lo que los peces podrían estar buscando corrientes rápidas o refugios con sombra en los manglares.",
    bannerBg: "from-warning/10 to-transparent bg-gradient-to-b border-warning/30",
    bannerBadgeBg: "bg-warning/20 text-[#b78103] dark:bg-[#b78103]/40 dark:text-warning",
    bannerBadgeText: "ESTADO REGULAR",
    bannerTitle: "Condición del Agua: Estable pero Intermedia",
    bannerDesc: "Condiciones estables de transición de marea. Se recomienda buscar corrientes y sombra de manglares.",
    bannerIcon: "info"
  }
};

// Secuencias de escenarios de simulación
const simulationScenarios = [
  {
    ph: 7.38,
    conductivity: 210,
    temperature: 27.5,
    status: "Óptimo",
    description: "Bueno: Agua pura, pH neutro ideal y temperatura templada para pesca."
  },
  {
    ph: 5.42,
    conductivity: 480,
    temperature: 32.1,
    status: "Crítico",
    description: "Malo: Escorrentía ácida o vertimiento contaminante de alta salinidad y calor térmico."
  },
  {
    ph: 6.65,
    conductivity: 315,
    temperature: 29.2,
    status: "Regular",
    description: "Normal: Valores tolerables de transición, agua dulce ligeramente cálida."
  }
];

export default function Dashboard() {
  const navigate = useNavigate();

  // Estados del medidor (Inicia encendido y conectándose al prototipo por defecto)
  const [isMeterOn, setIsMeterOn] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState('connecting'); // disconnected -> connecting -> connected
  const [currentPH, setCurrentPH] = useState(7.35);
  const [currentCond, setCurrentCond] = useState(210);
  const [currentTemp, setCurrentTemp] = useState(27.8);

  // Estados de datos e historial
  const [readings, setReadings] = useState([]);
  const [latestSavedReading, setLatestSavedReading] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  // Estados del Cargador de 10 Segundos
  const [progressPercent, setProgressPercent] = useState(0);
  const [progressLog, setProgressLog] = useState('');
  const [scenarioIndex, setScenarioIndex] = useState(0); // Ciclador: 0=Bueno, 1=Malo, 2=Normal

  // Toast notification
  const [toastMessage, setToastMessage] = useState(null);

  // Cargar historial de lecturas iniciales
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setIsLoadingHistory(true);
        const data = await firebaseService.getReadings();
        setReadings(data);
        if (data.length > 0) {
          setLatestSavedReading(data[0]);
        }
      } catch (err) {
        console.error("Error al cargar historial:", err);
      } finally {
        setIsLoadingHistory(false);
      }
    };
    fetchHistory();
  }, []);

  // Efecto para simular la conexión cuando se enciende el medidor
  useEffect(() => {
    let connectionTimeout;
    if (isMeterOn) {
      setConnectionStatus('connecting');
      connectionTimeout = setTimeout(() => {
        setConnectionStatus('connected');
        // Valores iniciales realistas de la Ciénaga
        setCurrentPH(7.35);
        setCurrentCond(210);
        setCurrentTemp(27.8);
      }, 1500);
    } else {
      setConnectionStatus('disconnected');
    }

    return () => clearTimeout(connectionTimeout);
  }, [isMeterOn]);

  // Efecto para hacer fluctuar los valores levemente mientras esté encendido y conectado (y no guardando)
  useEffect(() => {
    let fluctuationInterval;
    if (isMeterOn && connectionStatus === 'connected' && !isSaving) {
      fluctuationInterval = setInterval(() => {
        setCurrentPH(prev => {
          const delta = (Math.random() - 0.5) * 0.15;
          const next = prev + delta;
          return Math.min(Math.max(next, 6.8), 8.2);
        });
        setCurrentCond(prev => {
          const delta = Math.round((Math.random() - 0.5) * 6);
          const next = prev + delta;
          return Math.min(Math.max(next, 180), 280);
        });
        setCurrentTemp(prev => {
          const delta = (Math.random() - 0.5) * 0.2;
          const next = prev + delta;
          return Math.min(Math.max(next, 25.5), 29.5);
        });
      }, 2000);
    }

    return () => clearInterval(fluctuationInterval);
  }, [isMeterOn, connectionStatus, isSaving]);

  // Mostrar toast sutil
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Guardar medición en Firebase (Con un temporizador exacto de 10 segundos y logs progresivos)
  const handleSaveToFirebase = () => {
    if (!isMeterOn || connectionStatus !== 'connected') {
      showToast("⚠️ Enciende el medidor para tomar la lectura.");
      return;
    }

    setIsSaving(true);
    setProgressPercent(0);
    setProgressLog("🔍 Inicializando secuencia de lectura en CIENAGA-01...");

    const progressSteps = [
      { pct: 10, log: "📡 Localizando dispositivo medidor vía enlace de radio LoRa..." },
      { pct: 20, log: "📶 Estableciendo handshake seguro en frecuencia de 915 MHz..." },
      { pct: 30, log: "🔋 Diagnóstico de hardware: Batería 88% • Señal fuerte (RSSI: -72 dBm)" },
      { pct: 40, log: "🧪 Limpiando electrodo de vidrio y estabilizando lectura de pH..." },
      { pct: 50, log: "⚡ Midiendo conductancia eléctrica de fluidos disueltos en Ciénaga..." },
      { pct: 60, log: "🌡️ Calibrando sensor térmico y compensando temperatura activa..." },
      { pct: 70, log: "📦 Compilando telemetría final: estampando firma digital..." },
      { pct: 80, log: "☁️ Enviando paquete de datos cifrados a la colección de Firebase Firestore..." },
      { pct: 90, log: "💾 Almacenando réplica local persistente para uso sin conexión..." },
      { pct: 100, log: "✅ ¡Sincronización de base de datos exitosa!" }
    ];

    let currentStepIndex = 0;
    const interval = setInterval(() => {
      if (currentStepIndex < progressSteps.length) {
        const step = progressSteps[currentStepIndex];
        setProgressPercent(step.pct);
        setProgressLog(step.log);
        currentStepIndex++;
      } else {
        clearInterval(interval);
        
        // Ejecutar el guardado real con el escenario correspondiente una vez pasados los 10 segundos
        finalizeSave();
      }
    }, 1000); // 10 pasos de 1 segundo cada uno = 10 segundos de carga exacta
  };

  // Guardado real de datos tras los 10 segundos
  const finalizeSave = async () => {
    // Tomar el escenario secuencial actual
    const targetScenario = simulationScenarios[scenarioIndex];

    try {
      // 1. Forzar los gauges visuales en vivo a reflejar exactamente los valores que guardamos
      setCurrentPH(targetScenario.ph);
      setCurrentCond(targetScenario.conductivity);
      setCurrentTemp(targetScenario.temperature);

      // 2. Guardar en el servicio simulador de Firebase
      const saved = await firebaseService.saveReading({
        ph: targetScenario.ph,
        conductivity: targetScenario.conductivity,
        temperature: targetScenario.temperature
      });

      // Sobrescribir el estado para inyectar el status exacto del escenario
      saved.status = targetScenario.status;

      // 3. Actualizar estados locales del Dashboard de inmediato
      setReadings(prev => [saved, ...prev]);
      setLatestSavedReading(saved);
      
      // 4. Mostrar alerta Toast Premium
      showToast(`💾 ¡Medición ${targetScenario.status} guardada con éxito en Firebase Firestore!`);

      // 5. Ciclar el índice para el siguiente clic (Bueno -> Malo -> Normal -> Bueno)
      setScenarioIndex(prev => (prev + 1) % simulationScenarios.length);
    } catch (err) {
      console.error(err);
      showToast("❌ Error al guardar datos en la base de datos.");
    } finally {
      setIsSaving(false);
      setProgressPercent(0);
      setProgressLog('');
    }
  };

  // Transferir datos al chatbot
  const handleTransferToChat = (reading) => {
    if (!reading) return;
    navigate('/chat', { state: { reading } });
  };

  // Buscar configuración del estado actual (por defecto Óptimo si no hay lecturas)
  const activeStatus = latestSavedReading ? latestSavedReading.status : "Óptimo";
  const activeConfig = statusConfig[activeStatus] || statusConfig["Óptimo"];

  return (
    <div className="bg-background text-on-background min-h-screen font-body-lg text-body-lg antialiased pb-24 md:pb-8">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-inverse-surface text-inverse-on-surface px-6 py-3.5 rounded-xl shadow-lg border border-outline-variant/30 flex items-center gap-3 animate-bounce">
          <span className="material-symbols-outlined text-primary text-[20px]">cloud_sync</span>
          <span className="text-body-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* MODAL OVERLAY DE CARGA - 10 SEGUNDOS DE SINCRONIZACIÓN REALISTA */}
      {isSaving && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-center p-6">
          <div className="glass-card max-w-lg w-full rounded-[2rem] p-8 border border-outline-variant/20 shadow-2xl space-y-6 text-center">
            
            <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
              {/* Círculo animado */}
              <div className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
              <span className="material-symbols-outlined text-primary text-[42px] animate-pulse">cloud_sync</span>
            </div>

            <div className="space-y-2">
              <h3 className="text-headline-lg font-bold text-on-surface">Hardware Link Activo</h3>
              <p className="text-body-sm text-on-surface-variant">Sincronizando telemetría física con base de datos Firebase Firestore...</p>
            </div>

            {/* Barra de Progreso */}
            <div className="space-y-2">
              <div className="w-full bg-surface-container-high rounded-full h-3 overflow-hidden border border-outline-variant/10">
                <div 
                  className="bg-gradient-to-r from-primary to-secondary h-full transition-all duration-300 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-[11px] font-bold text-neutral">
                <span>PORCENTAJE: {progressPercent}%</span>
                <span>TIEMPO RESTANTE: {10 - Math.round(progressPercent / 10)}s</span>
              </div>
            </div>

            {/* Log de Consola de Hardware */}
            <div className="bg-surface-container-lowest/80 border border-outline-variant/15 p-4 rounded-xl text-left font-mono text-[12px] text-primary h-16 flex items-center overflow-hidden">
              <span className="animate-pulse mr-1.5">▶</span> {progressLog}
            </div>

            <div className="text-[10px] text-neutral">
              No cierre la ventana. Adquisición de parámetros de Ciénaga en proceso físico.
            </div>

          </div>
        </div>
      )}

      {/* Header Premium (Sin Login) */}
      <header className="fixed top-0 w-full z-40 bg-surface/85 backdrop-blur-xl border-b border-outline-variant/15 shadow-sm flex justify-between items-center px-margin-mobile md:px-margin-desktop h-16 transition-all duration-300">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-md">
            <span className="material-symbols-outlined text-white text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>water_drop</span>
          </div>
          <span className="text-headline-md font-headline-md font-bold text-primary">Aluna IA</span>
          <span className="hidden sm:inline-block bg-primary/10 text-primary text-[11px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Ciénaga Conectada</span>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/dashboard" className="text-primary font-bold hover:bg-surface-container-high/40 transition-colors px-3 py-2 rounded-lg duration-150 flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">waves</span> Estación Ciénaga
          </Link>
          <Link to="/chat" className="text-on-surface-variant hover:text-primary transition-colors px-3 py-2 rounded-lg duration-150 flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">assistant</span> Aluna Chat
          </Link>
          <Link to="/hardware" className="text-on-surface-variant hover:text-primary transition-colors px-3 py-2 rounded-lg duration-150 flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">map</span> Hardware
          </Link>
        </nav>

        <div className="flex items-center gap-3 text-primary">
          <span className={`material-symbols-outlined transition-colors p-2 rounded-full cursor-pointer active:scale-95 duration-150 ${isMeterOn && connectionStatus === 'connected' ? 'text-success animate-pulse' : 'text-neutral'}`} title={isMeterOn ? 'Medidor Conectado' : 'Medidor Apagado'}>
            sensors
          </span>
          <span className="hidden sm:inline-block bg-surface-container-high text-on-surface-variant px-3 py-1 rounded-full text-label-caps font-semibold">
            Firebase: Mock Activo
          </span>
        </div>
      </header>
      
      {/* Canvas Principal */}
      <main className="pt-24 px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto space-y-stack-lg">
        
        {/* Sección de Encabezado */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h2 className="text-display-lg text-on-surface mb-1">Río Ciénaga</h2>
            <p className="text-body-lg text-on-surface-variant">Estación Principal • Sector Desembocadura</p>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Botón de Encendido General de Medidor */}
            <div className="glass-card flex items-center gap-4 px-5 py-2.5 rounded-xl border border-outline-variant/35 shadow-sm w-full md:w-auto justify-between">
              <div className="flex items-center gap-2.5">
                <span className={`w-3 h-3 rounded-full ${isMeterOn ? 'bg-success animate-ping' : 'bg-neutral'}`}></span>
                <span className="text-body-sm font-bold text-on-surface">
                  {isMeterOn ? 'Medidor Encendido' : 'Medidor Apagado'}
                </span>
              </div>
              <button 
                onClick={() => setIsMeterOn(!isMeterOn)}
                className={`px-4 py-1.5 rounded-lg text-body-sm font-bold transition-all duration-200 ${isMeterOn ? 'bg-error text-on-error hover:bg-error/95 shadow-md active:scale-95' : 'bg-primary text-on-primary hover:bg-primary/95 shadow-md active:scale-95'}`}
              >
                {isMeterOn ? 'Apagar' : 'Encender'}
              </button>
            </div>
          </div>
        </div>

        {/* TARJETA DINÁMICA DE ESTADO ACTUAL - REACTIVA AL GUARDAR */}
        <div className={`glass-card rounded-[2rem] p-8 md:p-10 relative overflow-hidden transition-all duration-500 border ${activeConfig.bannerBg}`}>
          <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
            <span className="material-symbols-outlined text-[120px] text-primary">{activeConfig.bannerIcon}</span>
          </div>
          <div className="relative z-10">
            <div className={`inline-flex items-center gap-2 px-4.5 py-1.5 rounded-full mb-6 font-bold text-label-caps tracking-wide ${activeConfig.bannerBadgeBg}`}>
              <span className="w-2.5 h-2.5 rounded-full bg-current animate-pulse"></span>
              <span>{activeConfig.bannerBadgeText}</span>
            </div>
            <h3 className="text-display-lg font-bold text-on-surface mb-3 max-w-2xl leading-tight">
              {activeConfig.bannerTitle}
            </h3>
            <p className="text-headline-md text-on-surface-variant max-w-2xl font-medium">
              {activeConfig.bannerDesc}
            </p>
          </div>
        </div>

        {/* MÓDULO INTERACTIVO DE MEDIDOR DE SENSORES */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-stack-lg">
          
          {/* Lado Izquierdo: Simulador de Hardware */}
          <div className="lg:col-span-8 glass-card rounded-[2rem] p-6 md:p-8 relative overflow-hidden border border-outline-variant/20 shadow-md">
            
            {/* Animación del Agua de Fondo */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-5">
              <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-secondary via-primary to-transparent animate-pulse"></div>
            </div>

            <div className="relative z-10 flex flex-col h-full justify-between">
              
              <div className="flex justify-between items-center mb-6">
                <div>
                  <span className="text-label-caps text-primary uppercase font-bold tracking-wider">Consola del Sensor</span>
                  <h3 className="text-headline-lg text-on-surface">Lectura en Tiempo Real</h3>
                </div>
                
                {/* Conexión de Estado */}
                <div className="flex items-center gap-2">
                  {connectionStatus === 'disconnected' && (
                    <span className="text-body-sm bg-surface-container-high text-on-surface-variant px-3 py-1 rounded-full flex items-center gap-1.5 font-bold">
                      <span className="w-2.5 h-2.5 rounded-full bg-neutral"></span>
                      Sin Conexión
                    </span>
                  )}
                  {connectionStatus === 'connecting' && (
                    <span className="text-body-sm bg-primary-fixed/30 text-primary px-3 py-1 rounded-full flex items-center gap-1.5 font-bold animate-pulse">
                      <span className="w-2.5 h-2.5 rounded-full bg-primary animate-ping"></span>
                      Sincronizando Sensor...
                    </span>
                  )}
                  {connectionStatus === 'connected' && (
                    <span className="text-body-sm bg-success/15 text-success px-3 py-1 rounded-full flex items-center gap-1.5 font-bold">
                      <span className="w-2.5 h-2.5 rounded-full bg-success"></span>
                      Medidor Activo
                    </span>
                  )}
                </div>
              </div>

              {/* Panel de Visualización del Sensor */}
              {connectionStatus === 'disconnected' ? (
                // Estado Apagado
                <div className="flex flex-col items-center justify-center py-12 px-6 border-2 border-dashed border-outline-variant/40 rounded-2xl bg-surface-container-lowest/40 my-4 text-center">
                  <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center text-outline mb-4">
                    <span className="material-symbols-outlined text-[36px]">power_off</span>
                  </div>
                  <h4 className="text-headline-md text-on-surface-variant font-bold mb-1">Medidor Apagado</h4>
                  <p className="text-body-sm text-neutral max-w-sm">
                    Enciende el medidor usando el botón superior para conectar los sensores de pH, conductividad y temperatura.
                  </p>
                </div>
              ) : connectionStatus === 'connecting' ? (
                // Estado Conectando
                <div className="flex flex-col items-center justify-center py-12 px-6 rounded-2xl bg-surface-container-lowest/20 my-4 text-center">
                  <div className="relative w-16 h-16 mb-4 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
                    <span className="material-symbols-outlined text-primary text-[28px]">wifi_find</span>
                  </div>
                  <h4 className="text-headline-md text-primary font-bold mb-1">Buscando Hardware</h4>
                  <p className="text-body-sm text-on-surface-variant max-w-xs">
                    Estableciendo conexión bluetooth de baja energía con el medidor sumergible en el Río Ciénaga...
                  </p>
                </div>
              ) : (
                // Estado Conectado (Simulando Sensor en Vivo)
                <div className="grid grid-cols-1 md:grid-cols-3 gap-stack-md my-4">
                  
                  {/* pH Card */}
                  <div className="bg-surface-container-lowest/80 border border-outline-variant/15 p-5 rounded-2xl hover:shadow-md transition-shadow relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-red-500 via-green-500 to-blue-500"></div>
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-body-sm font-bold text-on-surface-variant">Potencial de Hidrógeno</span>
                      <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">science</span>
                    </div>
                    <div className="text-display-lg text-on-surface font-extrabold my-2">
                      {currentPH.toFixed(2)}
                    </div>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-body-sm text-on-surface-variant">pH actual</span>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                        (currentPH >= 7.0 && currentPH <= 7.8) ? 'bg-success/15 text-success' : 'bg-error/15 text-error animate-pulse'
                      }`}>
                        {(currentPH >= 7.0 && currentPH <= 7.8) ? 'IDEAL' : 'CRÍTICO'}
                      </span>
                    </div>
                  </div>

                  {/* Conductividad Card */}
                  <div className="bg-surface-container-lowest/80 border border-outline-variant/15 p-5 rounded-2xl hover:shadow-md transition-shadow relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-secondary"></div>
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-body-sm font-bold text-on-surface-variant">Conductividad</span>
                      <span className="material-symbols-outlined text-secondary group-hover:scale-110 transition-transform">electric_bolt</span>
                    </div>
                    <div className="text-display-lg text-on-surface font-extrabold my-2">
                      {currentCond} <span className="text-body-sm font-bold text-neutral">µS/cm</span>
                    </div>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-body-sm text-on-surface-variant">Sales/Minerales</span>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                        currentCond < 250 ? 'bg-success/15 text-success' : currentCond < 350 ? 'bg-warning/15 text-warning' : 'bg-error/15 text-error animate-pulse'
                      }`}>
                        {currentCond < 250 ? 'EXCELENTE' : currentCond < 350 ? 'MODERADO' : 'CRÍTICO'}
                      </span>
                    </div>
                  </div>

                  {/* Temperatura Card */}
                  <div className="bg-surface-container-lowest/80 border border-outline-variant/15 p-5 rounded-2xl hover:shadow-md transition-shadow relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-tertiary"></div>
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-body-sm font-bold text-on-surface-variant">Temperatura</span>
                      <span className="material-symbols-outlined text-tertiary group-hover:scale-110 transition-transform">device_thermostat</span>
                    </div>
                    <div className="text-display-lg text-on-surface font-extrabold my-2">
                      {currentTemp.toFixed(1)} <span className="text-body-sm font-bold text-neutral">°C</span>
                    </div>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-body-sm text-on-surface-variant">Calidez Térmica</span>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                        currentTemp < 29 ? 'bg-success/15 text-success' : currentTemp < 31 ? 'bg-warning/15 text-[#b78103]' : 'bg-error/15 text-error animate-pulse'
                      }`}>
                        {currentTemp < 29 ? 'ESTABLE' : currentTemp < 31 ? 'CÁLIDA' : 'CRÍTICA'}
                      </span>
                    </div>
                  </div>

                </div>
              )}

              {/* Botón de Sincronización en Firebase */}
              <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-3">
                <div className="text-[13px] text-on-surface-variant flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-primary">tips_and_updates</span>
                  <span>
                    {connectionStatus === 'connected' 
                      ? `Próximo guardado: Escenario ${simulationScenarios[scenarioIndex].status} (Haz clic para alternar)` 
                      : "Enciende y conecta el dispositivo para habilitar la sincronización."}
                  </span>
                </div>
                <button
                  onClick={handleSaveToFirebase}
                  disabled={isSaving || connectionStatus !== 'connected'}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-primary-container text-on-primary px-6 py-3.5 rounded-xl font-bold hover:shadow-lg hover:shadow-primary/20 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none"
                >
                  <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>cloud_upload</span>
                  Tomar y Guardar Lectura (Firebase)
                </button>
              </div>

            </div>
          </div>

          {/* Lado Derecho: Aluna IA Quick Insight (Pasar datos al Chatbot) */}
          <div className="lg:col-span-4 flex flex-col justify-between glass-card rounded-[2rem] p-6 md:p-8 bg-gradient-to-br from-primary-container/10 via-secondary-container/5 to-transparent border border-outline-variant/20 shadow-md">
            
            <div className="space-y-6">
              <div className="flex items-center gap-2 bg-primary/10 text-primary px-3.5 py-1.5 rounded-full w-max">
                <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>assistant</span>
                <span className="text-[11px] font-bold uppercase tracking-wider">Análisis Inteligente</span>
              </div>

              <h3 className="text-headline-lg font-bold text-on-surface leading-tight">Aluna IA Insight</h3>
              
              {latestSavedReading ? (
                <div className="space-y-4">
                  <p className="text-body-sm text-on-surface-variant">
                    Última medición registrada en la base de datos de Firebase:
                  </p>
                  
                  {/* Tarjeta de Resumen Compacta */}
                  <div className="bg-surface-container/60 p-4.5 rounded-xl border border-outline-variant/10 space-y-2">
                    <div className="flex justify-between items-center text-body-sm">
                      <span className="font-semibold text-on-surface-variant flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px] text-primary">science</span> pH
                      </span>
                      <span className="font-bold text-on-surface">{latestSavedReading.ph}</span>
                    </div>
                    <div className="flex justify-between items-center text-body-sm">
                      <span className="font-semibold text-on-surface-variant flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px] text-secondary">electric_bolt</span> Conductividad
                      </span>
                      <span className="font-bold text-on-surface">{latestSavedReading.conductivity} µS/cm</span>
                    </div>
                    <div className="flex justify-between items-center text-body-sm">
                      <span className="font-semibold text-on-surface-variant flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px] text-tertiary">device_thermostat</span> Temp
                      </span>
                      <span className="font-bold text-on-surface">{latestSavedReading.temperature} °C</span>
                    </div>
                    <div className="pt-2 border-t border-outline-variant/10 text-[11px] text-neutral text-right">
                      Sincronizado: {new Date(latestSavedReading.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                  </div>

                  {/* Diagnóstico rápido reactivo */}
                  <div className={`p-4 rounded-xl text-body-sm flex gap-3 items-start border transition-colors duration-300 ${activeConfig.bg}`}>
                    <span className="material-symbols-outlined text-[22px] shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>
                      {activeConfig.icon}
                    </span>
                    <div>
                      <h4 className="font-bold text-[14px]">{activeConfig.title}</h4>
                      <p className="text-xs mt-1 leading-relaxed opacity-95">
                        {activeConfig.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-neutral text-body-sm space-y-3">
                  <span className="material-symbols-outlined text-[48px] text-outline/30 animate-pulse">cloud_off</span>
                  <p>Inicia el medidor y presiona "Tomar y Guardar Lectura" para registrar datos históricos.</p>
                </div>
              )}
            </div>

            <div className="mt-8">
              <button
                disabled={!latestSavedReading}
                onClick={() => handleTransferToChat(latestSavedReading)}
                className="w-full bg-primary text-on-primary py-3.5 rounded-xl font-bold hover:bg-primary/95 transition-all duration-200 shadow-md active:scale-95 flex items-center justify-center gap-2.5 disabled:opacity-40 disabled:pointer-events-none group"
              >
                <span>Pasar Datos a Aluna Chatbot</span>
                <span className="material-symbols-outlined text-[20px] transition-transform duration-300 group-hover:translate-x-1">arrow_forward</span>
              </button>
            </div>

          </div>

        </div>

        {/* TABLA HISTÓRICA DE MEDICIONES (FIREBASE FIRESTORE SIMULATED) */}
        <div className="glass-card rounded-[2rem] p-6 md:p-8 border border-outline-variant/20 shadow-md">
          <div className="flex justify-between items-center mb-6">
            <div>
              <span className="text-label-caps text-neutral uppercase font-semibold">Almacenamiento Conectado</span>
              <h3 className="text-headline-md font-bold text-on-surface">Historial de Lecturas (Firebase Firestore)</h3>
            </div>
            
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-label-caps font-bold">
              {readings.length} Registros
            </span>
          </div>

          {isLoadingHistory ? (
            <div className="flex justify-center items-center py-12">
              <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            </div>
          ) : readings.length === 0 ? (
            <div className="py-12 text-center text-neutral">
              <span className="material-symbols-outlined text-[48px] mb-3">cloud_off</span>
              <p className="font-semibold">Historial vacío</p>
              <p className="text-body-sm text-neutral mt-1">Conecta el medidor y toma lecturas para registrar datos.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-outline-variant/25 text-label-caps font-bold text-on-surface-variant text-[12px] tracking-wider">
                    <th className="py-4.5 px-4">Fecha y Hora</th>
                    <th className="py-4.5 px-4">Estación</th>
                    <th className="py-4.5 px-4">pH</th>
                    <th className="py-4.5 px-4">Conductividad</th>
                    <th className="py-4.5 px-4">Temperatura</th>
                    <th className="py-4.5 px-4">Calidad</th>
                    <th className="py-4.5 px-4 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/15 text-body-sm">
                  {readings.map((reading) => (
                    <tr key={reading.id} className="hover:bg-surface-container/30 transition-colors">
                      <td className="py-4 px-4 font-semibold text-on-surface">
                        {new Date(reading.timestamp).toLocaleDateString([], {day:'2-digit', month:'short'})}{' '}
                        <span className="text-neutral font-normal text-xs">
                          {new Date(reading.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-on-surface-variant">
                        {reading.location}
                      </td>
                      <td className="py-4 px-4 font-mono font-bold text-primary">
                        {reading.ph.toFixed(1)}
                      </td>
                      <td className="py-4 px-4 font-mono font-bold text-secondary">
                        {reading.conductivity} µS/cm
                      </td>
                      <td className="py-4 px-4 font-mono font-bold text-tertiary">
                        {reading.temperature.toFixed(1)} °C
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          reading.status === 'Óptimo' 
                            ? 'bg-success/10 text-success' 
                            : reading.status === 'Crítico' 
                            ? 'bg-error/10 text-error animate-pulse' 
                            : 'bg-warning/10 text-[#b78103]'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            reading.status === 'Óptimo' 
                              ? 'bg-success' 
                              : reading.status === 'Crítico' 
                              ? 'bg-error' 
                              : 'bg-warning'
                          }`}></span>
                          {reading.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => handleTransferToChat(reading)}
                          className="inline-flex items-center gap-1 bg-surface-container-high text-primary hover:bg-primary hover:text-on-primary px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95"
                          title="Enviar esta lectura específica al Chatbot para consultoría"
                        >
                          <span className="material-symbols-outlined text-[14px]">assistant</span>
                          Consultar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </main>
      
      {/* BottomNavBar (Móvil Únicamente) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-45 flex justify-around items-center h-16 bg-surface/85 backdrop-blur-xl border-t border-outline-variant/15 shadow-lg pb-safe">
        <Link to="/dashboard" className="flex flex-col items-center justify-center active:scale-90 transition-transform duration-150 text-primary font-bold">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>waves</span>
          <span className="text-[10px] uppercase font-bold mt-1">Estación</span>
        </Link>
        <Link to="/chat" className="flex flex-col items-center justify-center active:scale-90 transition-transform duration-150 text-on-surface-variant hover:text-primary">
          <span className="material-symbols-outlined">assistant</span>
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
