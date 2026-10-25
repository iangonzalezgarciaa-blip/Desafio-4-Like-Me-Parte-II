import { useState } from 'react';
import axios from 'axios';

function Post({ post }) {
  const [likes, setLikes] = useState(post.likes);

  const handleLike = async () => {
    try {
      const updatedPost = { ...post, likes: likes + 1 };
      const response = await axios.put(`http://localhost:3000/posts/${post.id}`, updatedPost);
      setLikes(response.data.likes);
    } catch (error) {
      console.error('Error al dar like:', error);
    }
  };

  return (
    <div className="post">
      <img src={post.img} alt={post.titulo} />
      <div className="post-content">
        <h2>{post.titulo}</h2>
        <p>{post.descripcion}</p>
        <button onClick={handleLike}>❤️ {likes}</button>
      </div>
    </div>
  );
}

export default Post;
