import React from 'react';

export default function About() {
  return (
    <div className="p-8 bg-slate-900 min-h-screen text-white flex justify-center items-center">
      <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 max-w-xl text-center space-y-4">
        <h2 className="text-3xl font-bold text-indigo-400">Plataforma de Retroalimentación</h2>
        <p className="text-slate-300 leading-relaxed">
          Esta aplicación permite a los estudiantes publicar, evaluar y brindar opiniones constructivas sobre los cursos y catedráticos de la institución educativa.
        </p>
        <p className="text-slate-300 leading-relaxed">
          Creado por: José Miguel Vásquez Velasquez
          Carne: 2002-13161
        </p>
        <div className="pt-4 border-t border-slate-700 text-xs text-slate-400 space-y-1">
          <p>Desarrollado con React 18, Node.js 20, Express y MySQL 8.</p>
          <p>Entorno completamente contenedorizado en Docker Desktop.</p>
        </div>
      </div>
    </div>
  );
}