import React from 'react';
import CommentFlow from './components/CommentFlow';
import commentsData from './utils/comments.json';

const App = () => {
    const initialData = {
        currentUser: commentsData.currentUser,
        comments: commentsData.comments
    };

    return <CommentFlow data={initialData} />;
};

export default App;