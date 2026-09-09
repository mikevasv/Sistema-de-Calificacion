import React, { useEffect, useState } from 'react';

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [filterCurso, setFilterCurso] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados independientes para el texto del comentario de cada publicación
  const [commentInputs, setCommentInputs] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Obtener carné del usuario autenticado (guardado en localStorage durante el Login)
  const userCarne = localStorage.getItem('carne') || '200213161';

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams({ curso: filterCurso, catedratico: filterCat }).toString();
      const res = await fetch(`http://localhost:5000/api/posts?${query}`);

      if (!res.ok) throw new Error('Error al obtener las publicaciones');

      const data = await res.json();
      setPosts(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error(err);
      setError(err.message);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [filterCurso, filterCat]);

  const handleCommentChange = (codigo_publicacion, value) => {
    setCommentInputs((prev) => ({
      ...prev,
      [codigo_publicacion]: value,
    }));
  };

  const handleAddComment = async (codigo_publicacion, e) => {
    e.preventDefault();
    const contenido = commentInputs[codigo_publicacion];

    if (!contenido || !contenido.trim()) return;

    try {
      setSubmitting(true);
      const res = await fetch('http://localhost:5000/api/posts/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          carne: userCarne,
          codigo_publicacion,
          contenido: contenido.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al agregar comentario');

      // Limpiar el input de la publicación correspondiente y actualizar la lista de publicaciones
      setCommentInputs((prev) => ({ ...prev, [codigo_publicacion]: '' }));
      await fetchPosts();
    } catch (err) {
      alert(`Error al publicar comentario: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-8 bg-slate-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6 text-indigo-400">Muro de Publicaciones</h1>

      {/* Filtros de Búsqueda */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div>
          <label className="text-xs text-slate-400 uppercase font-semibold mb-1 block">Filtrar por Curso</label>
          <input
            type="text"
            placeholder="Buscar por nombre de curso..."
            className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
            value={filterCurso}
            onChange={(e) => setFilterCurso(e.target.value)}
          />
        </div>
        <div>
          <label className="text-xs text-slate-400 uppercase font-semibold mb-1 block">Filtrar por Catedrático</label>
          <input
            type="text"
            placeholder="Buscar por nombre o apellido..."
            className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
            value={filterCat}
            onChange={(e) => setFilterCat(e.target.value)}
          />
        </div>
      </div>

      {loading && <div className="text-center py-10 text-slate-400">Cargando publicaciones...</div>}

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-400 p-4 rounded-xl text-center mb-6">
          {error}
        </div>
      )}

      {!loading && !error && posts.length === 0 && (
        <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 text-center text-slate-400">
          No hay publicaciones registradas aún o ninguna coincide con los filtros aplicados.
        </div>
      )}

      <div className="space-y-6">
        {Array.isArray(posts) &&
          posts.map((post) => (
            <div key={post.codigo_publicacion || post.id} className="bg-slate-800 p-6 rounded-2xl border border-slate-700 space-y-4">
              {/* Autor y Fecha */}
              <div className="flex justify-between items-center">
                <span className="font-semibold text-indigo-300">
                  {post.nombres} {post.apellidos}
                </span>
                <span className="text-xs text-slate-400">
                  {post.fecha ? new Date(post.fecha).toLocaleString() : 'Fecha no disponible'}
                </span>
              </div>

              {/* Etiquetas del Post */}
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="bg-slate-700 px-3 py-1 rounded-full text-slate-300">
                  <strong>Curso:</strong> {post.curso}
                </span>
                <span className="bg-slate-700 px-3 py-1 rounded-full text-slate-300">
                  <strong>Catedrático:</strong> {post.catedratico_nombre} {post.catedratico_apellido}
                </span>
              </div>

              {/* Contenido principal */}
              <p className="text-slate-200 text-sm leading-relaxed">{post.contenido}</p>

              {/* Sección de Comentarios */}
              <div className="pt-4 border-t border-slate-700 space-y-3">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Comentarios ({post.comentarios ? post.comentarios.length : 0})
                </h4>

                {/* Lista de comentarios existentes */}
                {post.comentarios && post.comentarios.length > 0 ? (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                    {post.comentarios.map((c) => (
                      <div key={c.id} className="bg-slate-900/60 p-3 rounded-xl border border-slate-700/50 text-xs">
                        <div className="flex justify-between text-indigo-400 mb-1">
                          <span className="font-medium">{c.nombres} {c.apellidos}</span>
                          <span className="text-[10px] text-slate-500">
                            {new Date(c.fecha).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-slate-300">{c.contenido}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">No hay comentarios aún. ¡Sé el primero en comentar!</p>
                )}

                {/* Formulario para agregar un nuevo comentario */}
                <form onSubmit={(e) => handleAddComment(post.codigo_publicacion, e)} className="flex gap-2 pt-2">
                  <input
                    type="text"
                    placeholder="Escribe un comentario..."
                    className="flex-1 p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs focus:outline-none focus:border-indigo-500 text-white placeholder-slate-500"
                    value={commentInputs[post.codigo_publicacion] || ''}
                    onChange={(e) => handleCommentChange(post.codigo_publicacion, e.target.value)}
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2.5 rounded-xl text-xs font-medium transition-colors disabled:opacity-50"
                  >
                    Comentar
                  </button>
                </form>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
