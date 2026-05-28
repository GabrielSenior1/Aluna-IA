/**
 * Aluna IA - Firebase & LocalStorage Service
 * 
 * Este servicio gestiona el almacenamiento y sincronización de las lecturas del medidor de agua.
 * Por defecto, funciona en "Modo de Simulación (Offline)" usando LocalStorage para permitir persistencia
 * inmediata sin configurar nada.
 * 
 * GUÍA DE INTEGRACIÓN CON FIREBASE Firestore REAL:
 * 1. Ejecuta: npm install firebase
 * 2. Descomenta las líneas de Firebase abajo y reemplaza la configuración con tus credenciales.
 * 3. Cambia la constante IS_FIREBASE_CONNECTED a true.
 */

// ==========================================
// CONFIGURACIÓN DE FIREBASE (Para activar en producción)
// ==========================================
/*
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "TU_SENDER_ID",
  appId: "TU_APP_ID"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
*/

const IS_FIREBASE_CONNECTED = false; // Cambiar a true cuando configures el SDK de arriba

// Lecturas iniciales de respaldo para pre-poblar el historial si está vacío
const DEFAULT_READINGS = [
  {
    id: "hist-01",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Hace 24 horas
    ph: 7.2,
    conductivity: 195,
    temperature: 26.8,
    status: "Óptimo",
    location: "Estación Río Ciénaga - Desembocadura"
  },
  {
    id: "hist-02",
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // Hace 12 horas
    ph: 7.5,
    conductivity: 220,
    temperature: 27.2,
    status: "Óptimo",
    location: "Estación Río Ciénaga - Desembocadura"
  },
  {
    id: "hist-03",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // Hace 4 horas
    ph: 7.4,
    conductivity: 215,
    temperature: 28.1,
    status: "Óptimo",
    location: "Estación Río Ciénaga - Desembocadura"
  }
];

export const firebaseService = {
  /**
   * Guarda una lectura en Firebase Firestore o LocalStorage (Simulador)
   * @param {Object} reading - Objeto con { ph, conductivity, temperature }
   * @returns {Promise<Object>} - La lectura guardada con su ID y timestamp
   */
  saveReading: async (reading) => {
    const newReading = {
      ph: parseFloat(reading.ph.toFixed(1)),
      conductivity: parseInt(reading.conductivity),
      temperature: parseFloat(reading.temperature.toFixed(1)),
      timestamp: new Date().toISOString(),
      location: "Estación Río Ciénaga - Desembocadura",
      status: (reading.ph >= 6.5 && reading.ph <= 8.5) ? "Óptimo" : "Alerta"
    };

    if (IS_FIREBASE_CONNECTED) {
      try {
        // CÓDIGO FIREBASE Firestore REAL:
        // const docRef = await addDoc(collection(db, "lecturas"), newReading);
        // return { id: docRef.id, ...newReading };
        console.log("Firebase guardado exitoso (simulado por desactivación)");
      } catch (error) {
        console.error("Error guardando en Firebase:", error);
        throw error;
      }
    }

    // MOCK / LOCALSTORAGE LAYER
    return new Promise((resolve) => {
      setTimeout(() => {
        const readings = firebaseService.getOfflineReadings();
        const savedItem = { id: "fb-" + Date.now(), ...newReading };
        readings.unshift(savedItem); // Agregar al inicio
        localStorage.setItem("aluna_readings", JSON.stringify(readings));
        
        console.log("💾 [Firebase Mock] Lectura guardada en la colección 'lecturas':", savedItem);
        resolve(savedItem);
      }, 800); // Pequeña latencia para simular red de Firebase
    });
  },

  /**
   * Recupera todas las lecturas de Firebase Firestore o LocalStorage (Simulador)
   * @returns {Promise<Array>} - Lista de lecturas ordenada por fecha descendente
   */
  getReadings: async () => {
    if (IS_FIREBASE_CONNECTED) {
      try {
        // CÓDIGO FIREBASE Firestore REAL:
        // const q = query(collection(db, "lecturas"), orderBy("timestamp", "desc"));
        // const querySnapshot = await getDocs(q);
        // const list = [];
        // querySnapshot.forEach((doc) => {
        //   list.push({ id: doc.id, ...doc.data() });
        // });
        // return list;
      } catch (error) {
        console.error("Error obteniendo datos de Firebase Firestore:", error);
      }
    }

    // MOCK / LOCALSTORAGE LAYER
    return new Promise((resolve) => {
      setTimeout(() => {
        const readings = firebaseService.getOfflineReadings();
        resolve(readings);
      }, 500); // Latencia de simulación de red
    });
  },

  /**
   * Obtiene lecturas de LocalStorage de manera síncrona interna
   */
  getOfflineReadings: () => {
    const stored = localStorage.getItem("aluna_readings");
    if (!stored) {
      localStorage.setItem("aluna_readings", JSON.stringify(DEFAULT_READINGS));
      return DEFAULT_READINGS;
    }
    return JSON.parse(stored);
  }
};
