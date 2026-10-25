import { useState } from 'react';

function Form({ onAddPost }) {
  const [titulo, setTitulo] = useState('');
  const [img, setImg] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [guardando, setGuardando] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (guardando || !titulo.trim() || !img.trim() || !descripcion.trim()) return;
    setGuardando(true);
    try {
      const guardado = await onAddPost({ titulo: titulo.trim(), img: img.trim(), descripcion: descripcion.trim() });
      if (guardado) { setTitulo(''); setImg(''); setDescripcion(''); }
    } finally {
      setGuardando(false);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <input type="text" aria-label="Título" placeholder="Título" maxLength={25} required
        value={titulo} onChange={(event) => setTitulo(event.target.value)} />
      <input type="url" aria-label="URL de la imagen" placeholder="URL de la imagen" maxLength={1000} required
        value={img} onChange={(event) => setImg(event.target.value)} />
      <textarea aria-label="Descripción" placeholder="Descripción" maxLength={255} required
        value={descripcion} onChange={(event) => setDescripcion(event.target.value)} />
      <button type="submit" disabled={guardando}>{guardando ? 'Agregando...' : 'Agregar Post'}</button>
    </form>
  );
}
export default Form;
