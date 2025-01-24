import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import NotFound from './NotFound';
import { link } from '../components/Baselink';
import LikeButton from '../components/LikeButton';
import Modal from 'react-modal';
import AddComment from './AddComment';
import { GettingArticle } from '../Utils/loader';

Modal.setAppElement('#root');

const Article = ({ loggedInUserId }) => {
  const { name } = useParams();
  const [article, setArticle] = useState(null);
  const [error, setError] = useState(null);
  const [liked, setLiked] = useState(false);
  const [likedBy, setLikedBy] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [newComment, setNewComment] = useState('');
  const url = `${link}`;

  useEffect(() => {
    const fetchArticleData = async () => {
      setLoading(true);
      try {
        const { data } = await axios.post(
          url + '/api/article/getarticle',
          { articleName: name }
        );
        if (data.name === name) {
          setArticle(data);
          setLiked(data.liked);
          setLikedBy(data.likedBy);
        } else {
          setArticle(null);
        }
      } catch (err) {
        console.error('Error fetching article:', err.message);
        setError(err.message);
      }
      setLoading(false);
    };

    fetchArticleData();
  }, [name]);

  const handleDelete = async () => {
    try {
      await axios.delete(url + '/api/article/deletearticle', { data: { id: article._id } });
      window.location.href = '/article-list';
    } catch (err) {
      setError('Failed to delete the article.');
    }
    setIsDeleteDialogOpen(false);
  };

  const handleAddComment = async () => {
    try {
      if (!newComment.trim()) {
        alert('Please enter a comment');
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to add a comment');
        return;
      }

      const response = await axios.post(
        url + '/api/article/addcomment',
        {
          articleId: article._id,
          comment: newComment,
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setArticle(response.data.article);
        setNewComment('');
        setIsCommentModalOpen(false);
      }
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to add comment');
    }
  };

  if (loading) return <GettingArticle />;
  if (error) return <p className="text-red-500 text-center mt-4 font-semibold">{error}</p>;
  if (!article) return <NotFound />;

  const isAuthor = article.author === localStorage.getItem("userId");
  const userId = localStorage.getItem("userId");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-16 sm:pt-24 pb-12">
      <article className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* Enhanced Header Section */}
        <header className="relative mb-8 sm:mb-16">
          <div className="absolute -top-8 sm:-top-12 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          
          {/* Author Info with improved styling */}
          <div className="flex items-center mb-6 sm:mb-8 space-x-4 sm:space-x-6">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 dark:from-yellow-400 dark:to-orange-500 p-1">
              <div className="w-full h-full rounded-full bg-white dark:bg-gray-900 flex items-center justify-center">
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-yellow-400 dark:to-orange-500 text-transparent bg-clip-text">
                  {article.authorName?.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
            <div>
              <p className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-yellow-400 dark:to-orange-500 text-transparent bg-clip-text">
                {article.authorName}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                Published on {new Date(article.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
          
          {/* Enhanced Title */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-gray-100 mb-6 sm:mb-8 leading-tight">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-yellow-400 dark:to-orange-500 text-transparent bg-clip-text">
              {article.title}
            </span>
          </h1>

          {/* Enhanced Featured Image */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl mb-12 ring-1 ring-gray-200 dark:ring-gray-700">
            <div className="aspect-w-16 aspect-h-9">
              <img
                src={article.thumbnail}
                alt="Article Thumbnail"
                className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-700 ease-in-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-transparent"></div>
            </div>
          </div>

          {/* Enhanced Meta & Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 dark:border-gray-700 pb-6 gap-4">
            <div className="flex items-center space-x-4 sm:space-x-8">
              <LikeButton
                articleId={article._id}
                initialLikes={article.likes || 0}
                initialLikedState={likedBy?.includes(userId)}
              />
              <button
                onClick={() => {
                  if (!localStorage.getItem('token')) {
                    alert('Please login to add a comment');
                    return;
                  }
                  setIsCommentModalOpen(true);
                }}
                className="flex items-center space-x-3 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-yellow-400 transition-colors group"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span className="font-medium">{article.comments?.length || 0} Comments</span>
              </button>
            </div>
            
            {isAuthor && (
              <div className="flex gap-2 sm:gap-4">
                <button
                  onClick={() => window.location.href = `/edit-article/${article._id}`}
                  className="px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-blue-600 to-purple-600 dark:from-yellow-400 dark:to-orange-500 text-white dark:text-gray-900 rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center space-x-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center space-x-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Enhanced Article Content */}
        <div className="prose prose-sm sm:prose-lg max-w-none mb-8 sm:mb-16">
          {article.content && article.content.split('\n').map((paragraph, index) => (
            <p
              key={index}
              className="text-lg leading-relaxed text-gray-800 dark:text-gray-300 mb-8 animate-fadeIn hover:text-gray-900 dark:hover:text-gray-200 transition-colors duration-200"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {paragraph}
            </p>
          ))}
        </div>

        {/* Enhanced Comments Section */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl p-4 sm:p-8 mb-8 sm:mb-12 ring-1 ring-gray-200 dark:ring-gray-700">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-yellow-400 dark:to-orange-500 text-transparent bg-clip-text">
              Discussion ({article.comments?.length || 0})
            </h2>
            <button
              className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-blue-600 to-purple-600 dark:from-yellow-400 dark:to-orange-500 text-white dark:text-gray-900 rounded-xl hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 flex items-center justify-center space-x-2"
              onClick={() => {
                if (!localStorage.getItem('token')) {
                  alert('Please login to add a comment');
                  return;
                }
                setIsCommentModalOpen(true);
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="font-medium">Add Comment</span>
            </button>
          </div>

          <div className="space-y-6 sm:space-y-8">
            {article.comments && article.comments.length > 0 ? (
              article.comments.map((comment, index) => (
                <div
                  key={index}
                  className="bg-gray-50 dark:bg-gray-700 rounded-xl sm:rounded-2xl p-4 sm:p-8 transition-all hover:shadow-lg hover:bg-gray-100 dark:hover:bg-gray-600 animate-fadeIn ring-1 ring-gray-200 dark:ring-gray-600"
                >
                  <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 dark:from-yellow-400 dark:to-orange-500 p-1">
                      <div className="w-full h-full rounded-full bg-white dark:bg-gray-900 flex items-center justify-center">
                        <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-yellow-400 dark:to-orange-500 text-transparent bg-clip-text">
                          {comment.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-yellow-400 dark:to-orange-500 text-transparent bg-clip-text">
                        {comment.username}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                        {new Date(comment.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed pl-18 hover:text-gray-900 dark:hover:text-gray-200 transition-colors duration-200">
                    {comment.text}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center py-8 sm:py-16">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto text-gray-400 dark:text-gray-600 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="text-xl text-gray-500 dark:text-gray-400 font-medium">No comments yet. Be the first to share your thoughts!</p>
              </div>
            )}
          </div>
        </section>

        {/* Modals */}
        <AddComment
          isOpen={isCommentModalOpen}
          onClose={() => setIsCommentModalOpen(false)}
          onSubmit={handleAddComment}
          comment={newComment}
          setComment={setNewComment}
        />

        <Modal
          isOpen={isDeleteDialogOpen}
          onRequestClose={() => setIsDeleteDialogOpen(false)}
          className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-md mx-auto mt-24 shadow-2xl outline-none"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-200 mb-4">Delete Article</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">Are you sure you want to delete this article? This action cannot be undone.</p>
          <div className="flex justify-end gap-4">
            <button
              className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </button>
            <button
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        </Modal>
      </article>
    </div>
  );
};

export default Article;