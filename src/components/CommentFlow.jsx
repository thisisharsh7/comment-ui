import React, { useState, useEffect } from 'react';
import Comment from './Comment';
import { AnimatePresence, motion } from 'framer-motion';

const CommentFlow = ({ data }) => {
    const [comments, setComments] = useState(data.comments || []);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        const savedComments = localStorage.getItem('comments');
        if (savedComments) {
            setComments(JSON.parse(savedComments));
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        localStorage.setItem('comments', JSON.stringify(comments));
    }, [comments]);

    const handleVote = (id, type) => {
        setComments(prevComments =>
            prevComments
                .map(comment =>
                    comment.id === id
                        ? { ...comment, score: type === 'up' ? comment.score + 1 : comment.score - 1 }
                        : comment
                )
                .sort((a, b) => b.score - a.score)
        );
    };

    const handleReply = (parentId, content) => {
        const newReply = {
            id: Date.now(),
            content,
            timestamp: Date.now(),
            score: 0,
            user: data.currentUser,
            replies: [],
        };

        const addReplyRecursively = (list) => {
            return list.map(comment => {
                if (comment.id === parentId) {
                    return {
                        ...comment,
                        replies: [...(comment.replies || []), newReply],
                    };
                }
                if (comment.replies?.length) {
                    return {
                        ...comment,
                        replies: addReplyRecursively(comment.replies),
                    };
                }
                return comment;
            });
        };

        setComments(prevComments => addReplyRecursively(prevComments));
    };

    const handleEdit = (id, content) => {
        const updateContent = (list) =>
            list.map(comment => {
                if (comment.id === id) {
                    return { ...comment, content };
                }
                if (comment.replies?.length) {
                    return {
                        ...comment,
                        replies: updateContent(comment.replies),
                    };
                }
                return comment;
            });

        setComments(prevComments => updateContent(prevComments));
    };

    const handleDelete = (id) => {
        const deleteRecursively = (list, idToDelete) =>
            list
                .map(comment => {
                    if (comment.id === idToDelete) return null;
                    return {
                        ...comment,
                        replies: deleteRecursively(comment.replies || [], idToDelete),
                    };
                })
                .filter(Boolean);

        setComments(prevComments => deleteRecursively(prevComments, id));
    };

    const addComment = () => {
        if (!newComment.trim()) return;

        const newCommentObj = {
            id: Date.now(),
            content: newComment,
            timestamp: Date.now(),
            score: 0,
            user: data.currentUser,
            replies: [],
        };

        // Just append at the end (no sorting)
        setComments(prevComments => [...prevComments, newCommentObj]);
        setNewComment('');
    };

    if (loading) return <div className="text-center text-gray-500">Loading...</div>;
    if (error) return <div className="text-center text-pink-400">Error: {error.message}</div>;

    return (
        <div className="container mx-auto p-4 sm:px-4 px-2 max-w-3xl font-display">
            <AnimatePresence>
                {comments.map((comment) => (
                    <motion.div
                        key={comment.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Comment
                            comment={comment}
                            currentUser={data.currentUser}
                            onReply={handleReply}
                            onVote={handleVote}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    </motion.div>
                ))}
            </AnimatePresence>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex items-start gap-4"
            >
                <img
                    src={data.currentUser.image.png}
                    alt={data.currentUser.username}
                    className="w-10 h-10 rounded-full object-cover mt-1"
                />
                <div className="flex-1 flex flex-col gap-3">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="w-full min-h-[80px] resize-none p-3 text-sm text-gray-800 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-400 shadow-inner"
                        placeholder="Add a comment..."
                        aria-label="Add a new comment"
                    />
                    <div className="flex justify-end">
                        <button
                            onClick={addComment}
                            className="bg-purple-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-all shadow-md"
                            aria-label="Send new comment"
                        >
                            Send
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default CommentFlow;
