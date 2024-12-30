import React, { useEffect, useState } from 'react';
import Articles from '../components/Articles';

const ArticleList = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Replace with your actual database URL
    const fetchArticles = async () => {
      try {
        const response = await fetch('https://react-blog-kwxf.vercel.app/api/article/getallarticle');
        if (!response.ok) {
          throw new Error(`Error fetching articles: ${response.statusText}`);
        }
        const data = await response.json();
        setArticles(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) {
    return <p>Loading articles...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <h1 className="sm:text-4xl text-2xl font-bold my-6 text-gray-900" style={{ color: 'var(--text-color)' }}>
        Articles
      </h1>
      <div className="container py-4 mx-auto">
        <div className="flex flex-wrap -m-4">
          <Articles articles={articles} />
        </div>
      </div>
    </div>
  );
};

export default ArticleList;
