import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProfilePage = () => {
  const [user, setUser] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('https://react-blog-kwxf.vercel.app/api/auth/getProfile', {
      headers: {
        Authorization: token,
      },
    })
     .then(response => {
        setUser(response.data);
      })
     .catch(error => {
        console.error(error);
      });
  }, []);

  return (
    <div>
      <h1>Profile Page</h1>
      <p>Username: {user.username}</p>
    </div>
  );
};

export default ProfilePage;
