import { useState } from 'react';

function Post({ post, onLike, onDelete }) {
  const [procesando, setProcesando] = useState(false);
  const ejecutar = async (accion) => {
    if (procesando) return;
    setProcesando(true);
    try { await accion(post.id); } finally { setProcesando(false); }
  };
  return (
    <article className="post">
      <img src={post.img} alt={post.titulo} />
      <div className="post-content">
        <h2>{post.titulo}</h2>
        <p>{post.descripcion}</p>
        <div className="post-actions">
          <button className="like-button" type="button" aria-label={`Dar like a ${post.titulo}`}
            disabled={procesando} onClick={() => ejecutar(onLike)}>❤️ {post.likes ?? 0}</button>
          <button className="delete-button" type="button" aria-label={`Eliminar ${post.titulo}`}
            disabled={procesando} onClick={() => ejecutar(onDelete)}>✕ Eliminar</button>
        </div>
      </div>
    </article>
  );
}
export default Post;
