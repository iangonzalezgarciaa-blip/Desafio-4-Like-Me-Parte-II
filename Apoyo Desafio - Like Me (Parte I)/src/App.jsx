import { useEffect, useState } from 'react';
import axios from 'axios';
import Form from './components/Form';
import Post from './components/Post';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function App() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let activo = true;
    const cargar = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/posts`);
        if (activo) setPosts(data);
      } catch (err) {
        console.error(err);
        if (activo) setError('No pude cargar los posts. Revisa el servidor.');
      } finally {
        if (activo) setCargando(false);
      }
    };
    cargar();
    return () => { activo = false; };
  }, []);

  const addPost = async (nuevoPost) => {
    setError('');
    try {
      const { data } = await axios.post(`${API_URL}/posts`, nuevoPost);
      setPosts((actuales) => [data, ...actuales]);
      return true;
    } catch (err) {
      console.error(err);
      setError('No pude agregar el post.');
      return false;
    }
  };

  const darLike = async (id) => {
    setError('');
    try {
      const { data } = await axios.put(`${API_URL}/posts/${id}`);
      setPosts((actuales) => actuales.map((post) => post.id === id ? data : post));
    } catch (err) {
      console.error(err);
      setError('No pude registrar el like.');
    }
  };

  const eliminarPost = async (id) => {
    setError('');
    try {
      await axios.delete(`${API_URL}/posts/${id}`);
      setPosts((actuales) => actuales.filter((post) => post.id !== id));
    } catch (err) {
      console.error(err);
      setError('No pude eliminar el post.');
    }
  };

  return (
    <div className="app">
      <h1>📸 Like Me 📸</h1>
      <Form onAddPost={addPost} />
      {error && <p className="error" role="alert">{error}</p>}
      {cargando ? <p className="estado">Cargando publicaciones...</p> : (
        <div className="posts-container">
          {posts.map((post) => (
            <Post key={post.id} post={post} onLike={darLike} onDelete={eliminarPost} />
          ))}
          {posts.length === 0 && <p className="estado">Todavía no hay publicaciones.</p>}
        </div>
      )}
    </div>
  );
}
export default App;
