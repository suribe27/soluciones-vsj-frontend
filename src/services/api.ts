/**
 * Cliente del backend real de Soluciones VSJ.
 *
 * Reemplaza el uso de localStorage para los datos del estudiante (RF-05 / RNF-05
 * del documento de análisis: mover la lógica y la persistencia al backend).
 * El único dato que sigue viviendo en el navegador es el token JWT, porque así
 * es como funciona la autenticación basada en token (el estándar que reemplaza
 * la sesión falsa que había antes).
 */
import { Subject } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
const TOKEN_KEY = 'vsj-token';

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    let message = `Error ${res.status}`;
    try {
      const body = await res.json();
      message = body.error || message;
    } catch {
      // el backend no devolvió JSON (ej. caído); se mantiene el mensaje genérico
    }
    throw new ApiError(message, res.status);
  }

  if (res.status === 204) {
    return undefined as T;
  }
  return res.json() as Promise<T>;
}

// ---------- Auth ----------

export interface LoginResponse {
  token: string;
  usuario: { id: string; correo: string; nombre: string };
}

export function login(correo: string, password: string): Promise<LoginResponse> {
  return request<LoginResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ correo, password }),
  });
}

// ---------- Materias ----------

interface MateriaDTO {
  id: string;
  nombre: string;
  nota: number;
}

function toSubject(m: MateriaDTO): Subject {
  return { id: m.id, name: m.nombre, score: Number(m.nota) };
}

export async function getMaterias(): Promise<Subject[]> {
  const materias = await request<MateriaDTO[]>('/api/materias');
  return materias.map(toSubject);
}

/**
 * Reemplaza TODA la lista de materias en una sola llamada. Coincide con cómo
 * Subjects.tsx ya maneja los cambios (agrega/edita/elimina localmente y llama
 * onUpdate con el arreglo completo), así que no hace falta tocar esa pantalla
 * para reconciliar ids uno por uno.
 */
export async function replaceMaterias(subjects: Pick<Subject, 'name' | 'score'>[]): Promise<Subject[]> {
  const materias = await request<MateriaDTO[]>('/api/materias', {
    method: 'PUT',
    body: JSON.stringify(subjects.map((s) => ({ nombre: s.name, nota: s.score }))),
  });
  return materias.map(toSubject);
}

// ---------- Encuesta ----------

export interface EncuestaEstado {
  respuestas: number[];
  fechaRespuesta: string | null;
  bloqueada: boolean;
  diasRestantes: number;
}

export function getEncuesta(): Promise<EncuestaEstado> {
  return request<EncuestaEstado>('/api/encuesta');
}

export function postEncuesta(respuestas: number[]): Promise<{ ok: true }> {
  return request<{ ok: true }>('/api/encuesta', {
    method: 'POST',
    body: JSON.stringify({ respuestas }),
  });
}

// ---------- Riesgo ----------

export interface RiesgoResponse {
  puntaje: number;
  notasScore: number;
  surveyScore: number;
  nivel: string;
  recomendacion: string;
  mostrarContacto: boolean;
}

export function getRiesgo(): Promise<RiesgoResponse> {
  return request<RiesgoResponse>('/api/riesgo');
}
