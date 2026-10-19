import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';
import BottomNav from './components/BottomNav';
import Dashboard from './screens/Dashboard';
import Results from './screens/Results';
import Survey from './screens/Survey';
import Subjects from './screens/Subjects';
import Profile from './screens/Profile';
import { Screen, Subject } from './types';
import * as api from './services/api';

function Login({ onLogin, loading, error }: { onLogin: (email: string, password: string) => void; loading: boolean; error: string }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const handleLogin = () => {
    if (!email || !password) {
      setLocalError('Por favor completa todos los campos.');
      return;
    }
    if (!email.endsWith('@soyudemedellin.edu.co')) {
      setLocalError('Debes usar tu correo institucional @soyudemedellin.edu.co');
      return;
    }
    setLocalError('');
    onLogin(email, password);
  };

  const shownError = localError || error;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="flex flex-col min-h-screen items-center justify-center px-6 editorial-glow">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-2">
          <div className="w-20 h-20 bg-primary rounded-3xl mx-auto flex items-center justify-center shadow-xl shadow-primary/20">
            <span className="text-4xl">🎓</span>
          </div>
          <h1 className="text-3xl font-black text-on-surface tracking-tight">VSJ Alerta Temprana</h1>
          <p className="text-on-surface-variant text-sm font-medium">Universidad de Medellín</p>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant/50" />
            <input
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setLocalError(''); }}
              placeholder="correo@soyudemedellin.edu.co"
              className="w-full bg-surface-container-lowest rounded-2xl pl-12 pr-4 py-4 text-sm font-semibold text-on-surface outline-none shadow-sm border border-on-surface/5 focus:border-primary/30 transition-colors"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant/50" />
            <input
              type="password"
              value={password}
              onChange={e => { setPassword(e.target.value); setLocalError(''); }}
              placeholder="Contraseña"
              className="w-full bg-surface-container-lowest rounded-2xl pl-12 pr-4 py-4 text-sm font-semibold text-on-surface outline-none shadow-sm border border-on-surface/5 focus:border-primary/30 transition-colors"
            />
          </div>

          {shownError && (
            <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl px-4 py-3">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <p className="text-red-600 text-xs font-semibold">{shownError}</p>
            </motion.div>
          )}

          <button onClick={handleLogin} disabled={loading}
            className="w-full bg-primary text-on-primary font-black py-4 rounded-2xl shadow-xl shadow-primary/20 active:scale-95 transition-all text-base mt-2 disabled:opacity-60 flex items-center justify-center gap-2">
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </div>

        <p className="text-center text-xs text-on-surface-variant/50 font-medium">
          Solo para estudiantes con correo institucional UdeM
        </p>
      </div>
    </motion.div>
  );
}

export default function App() {
  const [loggedIn, setLoggedIn] = useState(() => !!api.getToken());
  const [currentScreen, setScreen] = useState<Screen>('home');
  const [loadingData, setLoadingData] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [lastSurveyDate, setLastSurveyDate] = useState<string | null>(null);
  const [risk, setRisk] = useState<api.RiesgoResponse>({
    puntaje: 0,
    notasScore: 0,
    surveyScore: 0,
    nivel: 'Sin datos',
    recomendacion: 'Registra tus notas y completa la encuesta para ver tu resultado.',
    mostrarContacto: false,
  });

  // Carga los datos reales del backend (materias, encuesta, riesgo) una vez
  // que sabemos que hay un token guardado.
  const loadData = async () => {
    setLoadingData(true);
    try {
      const [materias, encuesta, riesgo] = await Promise.all([
        api.getMaterias(),
        api.getEncuesta(),
        api.getRiesgo(),
      ]);
      setSubjects(materias);
      setLastSurveyDate(encuesta.fechaRespuesta);
      setRisk(riesgo);
    } catch (err) {
      if (err instanceof api.ApiError && err.status === 401) {
        // El token venció o es inválido: cerramos sesión.
        api.clearToken();
        setLoggedIn(false);
      }
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (loggedIn) {
      loadData();
    } else {
      setLoadingData(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedIn]);

  const handleLogin = async (email: string, password: string) => {
    setLoginLoading(true);
    setLoginError('');
    try {
      const { token } = await api.login(email, password);
      api.setToken(token);
      setLoggedIn(true);
    } catch (err) {
      setLoginError(err instanceof api.ApiError ? err.message : 'No se pudo iniciar sesión. Intenta de nuevo.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    api.clearToken();
    setLoggedIn(false);
    setScreen('home');
    setSubjects([]);
    setLastSurveyDate(null);
  };

  const handleUpdateSubjects = async (newSubjects: Subject[]) => {
    // Actualización optimista: se ve el cambio de inmediato en pantalla...
    setSubjects(newSubjects);
    try {
      // ...y se confirma contra el backend, que devuelve los id reales.
      const saved = await api.replaceMaterias(newSubjects);
      setSubjects(saved);
      const riesgo = await api.getRiesgo();
      setRisk(riesgo);
    } catch (err) {
      if (err instanceof api.ApiError && err.status === 401) {
        api.clearToken();
        setLoggedIn(false);
      } else {
        // Si falla el guardado, recargamos desde el backend para no quedar desincronizados.
        loadData();
      }
    }
  };

  const handleSurveyComplete = async (answers: number[]) => {
    try {
      await api.postEncuesta(answers);
      const [encuesta, riesgo] = await Promise.all([api.getEncuesta(), api.getRiesgo()]);
      setLastSurveyDate(encuesta.fechaRespuesta);
      setRisk(riesgo);
      setScreen('results');
    } catch (err) {
      if (err instanceof api.ApiError && err.status === 401) {
        api.clearToken();
        setLoggedIn(false);
      }
      // Si fue otro error (ej. intentó responder antes de los 7 días), el estado
      // de bloqueo real lo vuelve a mostrar Survey.tsx en el próximo render
      // porque lastSurveyDate no cambió.
    }
  };

  if (!loggedIn) {
    return (
      <div className="w-full max-w-md mx-auto" style={{ height: '100dvh' }}>
        <Login onLogin={handleLogin} loading={loginLoading} error={loginError} />
      </div>
    );
  }

  if (loadingData) {
    return (
      <div className="w-full max-w-md mx-auto flex items-center justify-center" style={{ height: '100dvh' }}>
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <Dashboard setScreen={setScreen} score={risk.puntaje} recommendation={risk.recomendacion} />;
      case 'results':
        return <Results score={risk.puntaje} notasScore={risk.notasScore} surveyScore={risk.surveyScore} />;
      case 'survey':
        if (subjects.length === 0) {
          return (
            <div className="flex flex-col items-center justify-center text-center space-y-4 py-20">
              <span className="text-5xl">📚</span>
              <h2 className="text-2xl font-black text-on-surface">Primero registra tus notas</h2>
              <p className="text-on-surface-variant text-sm font-medium">Necesitas tener al menos una materia registrada antes de hacer la encuesta.</p>
              <button onClick={() => setScreen('subjects')} className="mt-4 bg-primary text-on-primary font-black px-8 py-3 rounded-xl">Ir a Notas</button>
            </div>
          );
        }
        return <Survey onComplete={handleSurveyComplete} lastSurveyDate={lastSurveyDate} />;
      case 'subjects':
        return <Subjects subjects={subjects} onUpdate={handleUpdateSubjects} />;
      case 'profile':
        return <Profile onLogout={handleLogout} />;
      default:
        return <Dashboard setScreen={setScreen} score={risk.puntaje} recommendation={risk.recomendacion} />;
    }
  };

  return (
    <div className="min-h-screen">
      <div className="w-full max-w-md mx-auto relative" style={{ height: '100dvh' }}>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-on-surface/10 rounded-full z-[60]" />
        <main className="absolute inset-0 overflow-y-auto pt-12 pb-40 px-6 scroll-smooth editorial-glow">
          {renderScreen()}
        </main>
        <BottomNav currentScreen={currentScreen} setScreen={setScreen} />
      </div>
    </div>
  );
}
