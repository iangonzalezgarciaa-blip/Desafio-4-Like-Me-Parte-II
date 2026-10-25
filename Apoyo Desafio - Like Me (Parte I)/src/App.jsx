import { useState, useEffect } from 'react';
import Post from './components/Post';
import Form from './components/Form';
import axios from 'axios';

function App() {
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:3000/posts');
      setPosts(response.data);
    } catch (error) {
      console.error('Error al obtener posts:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const addPost = async (newPost) => {
    try {
      const response = await axios.post('http://localhost:3000/posts', newPost);
      setPosts([response.data, ...posts]);
    } catch (error) {
      console.error('Error al agregar post:', error);
    }
  };

  return (
    <div className="app">
      <h1>Like Me</h1>
      <Form onAddPost={addPost} />
      <div className="posts-container">
        {posts.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}

export default App;
