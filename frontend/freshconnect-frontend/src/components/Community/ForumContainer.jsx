import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ForumList from './ForumList';
import ForumDetail from './ForumDetail';

const ForumContainer = () => {
  return (
    <Routes>
      <Route index element={<ForumList />} />
      <Route path=":postId" element={<ForumDetail />} />
    </Routes>
  );
};

export default ForumContainer;
