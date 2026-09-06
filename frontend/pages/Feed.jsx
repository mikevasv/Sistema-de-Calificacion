import React, { useEffect, useState } from 'react';

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [filterCurso, setFilterCurso] = useState('');
  const [filterCat, setFilterCat] = useState('');

  const fetchPosts = async () => {
    const query = new URLSearchParams({ curso: filterCurso, catedratico: filterCat }).toString();
    const res = await fetch(`http://localhost:5000/api/posts?${query}`);
    const data = await res.json();
    setPosts(data);
  };

  useEffect(() => {
    fetchPosts();
  }, [filterCurso, filterCat]);

  return (
    <div className="p-6 bg-slate-900 min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-6">Muro de Publicaciones</h1>
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Buscar por Curso..."
          className="p-3 bg-slate-800 border border-slate-700 rounded-lg text-sm w-1/2 focus:outline-none"
          value={filterCurso}
          onChange={(e) => setFilterCurso(e.target.value)}
        />
        <input
          type="text"
          placeholder="Buscar por Catedrático..."
          className="p-3 bg-slate-800 border border-slate-700 rounded-lg text-sm w-1/2 focus:outline-none"
          value={filterCat}
          onChange={(e) => setFilterCat(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.codigo_publicacion} className="bg-slate-800 p-5 rounded-xl border border-slate-700">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-indigo-400">{post.nombres} {post.apellidos}</span>
              <span className="text-xs text-slate-400">{new Date(post.fecha).toLocaleString()}</span>
            </div>
            <div className="text-xs bg-slate-700 px-2 py-1 rounded inline-block text-slate-300 mb-3">
              Curso: {post.curso} | Catedrático: {post.catedratico_nombre} {post.catedratico_apellido}
            </div>
            <p className="text-slate-200">{post.contenido}</p>
          </div>
        ))}
      </div>
    </div>
  );
}