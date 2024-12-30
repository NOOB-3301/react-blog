import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Articles from '../components/Articles';
import NotFound from './NotFound';
import CommentsList from '../components/CommentsList';
import AddComment from '../components/AddComment';

const Article = () => {
  const { name } = useParams();
  const [article, setArticle] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticleData = async () => {
      try {
        // POST request to fetch the article
        const { data } = await axios.post(
          'https://react-blog-kwxf.vercel.app/api/article/getarticle',
          { articleName: name } // Sending the article name in the POST body
        );

        if (data.name === name) {
          setArticle(data); // Set the article directly from the response
        } else {
          setArticle(null);
        }
      } catch (err) {
        console.error('Error fetching article data:', err.message);
        setError(err.message);
      }
    };

    fetchArticleData();
  }, [name]);

  if (error) return <p>Error: {error}</p>;
  if (!article) return <NotFound />;

  return (
    <>
      <h1
        className="sm:text-4xl text-2xl font-bold my-6 text-gray-900"
        style={{ color: 'var(--text-color)' }}
      >
        {article.title}
      </h1>
      {article.content &&
        article.content.split('\n').map((paragraph, index) => (
          <p
            className="mx-auto leading-relaxed text-base mb-4"
            style={{ color: 'var(--text-color)' }}
            key={index}
          >
            {paragraph}
          </p>
        ))}
      <CommentsList comments={article.comments || []} />
      <AddComment articleName={name} setArticleInfo={(info) => setArticle((prev) => ({ ...prev, comments: info.comments }))} />
    </>
  );
};

export default Article;
