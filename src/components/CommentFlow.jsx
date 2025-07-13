// CommentFlow.js
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
        setComments((prevComments) =>
            prevComments.map((comment) =>
                comment.id === id
                    ? { ...comment, score: type === 'up' ? comment.score + 1 : comment.score - 1 }
                    : comment
            ).sort((a, b) => b.score - a.score)
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

        const addReplyRecursively = (commentsList) => {
            return commentsList.map(comment => {
                if (comment.id === parentId) {
                    return {
                        ...comment,
                        replies: [...(comment.replies || []), newReply],
                    };
                }

                if (comment.replies && comment.replies.length > 0) {
                    return {
                        ...comment,
                        replies: addReplyRecursively(comment.replies),
                    };
                }

                return comment;
            });
        };

        setComments(prevComments =>
            addReplyRecursively(prevComments).sort((a, b) => b.score - a.score)
        );
    };
    const handleEdit = (id, content) => {
        const updateComment = (comments) =>
            comments.map((comment) => {
                if (comment.id === id) {
                    return { ...comment, content };
                }
                if (comment.replies && comment.replies.length > 0) {
                    return {
                        ...comment,
                        replies: updateComment(comment.replies),
                    };
                }
                return comment;
            });

        setComments((prevComments) => updateComment(prevComments));
    };

    const deleteCommentById = (comments, idToDelete) => {
        return comments
            .map(comment => {
                if (comment.id === idToDelete) {
                    return null; // Remove this comment
                }

                // Recursively check inside replies
                const newReplies = comment.replies ? deleteCommentById(comment.replies, idToDelete) : [];

                return {
                    ...comment,
                    replies: newReplies,
                };
            })
            .filter(Boolean); // Remove nulls
    };

    const handleDelete = (id) => {
        setComments(prevComments => deleteCommentById(prevComments, id));
    };


    const addComment = () => {
        if (newComment.trim()) {
            const newCommentObj = {
                id: Date.now(),
                content: newComment,
                timestamp: Date.now(),
                score: 0,
                user: data.currentUser,
                replies: [],
            };
            setComments((prevComments) => [newCommentObj, ...prevComments].sort((a, b) => b.score - a.score));
            setNewComment('');
        }
    };

    if (loading) return <div className="text-center text-grey-500">Loading...</div>;
    if (error) return <div className="text-center text-pink-400">Error: {error.message}</div>;

    return (
        <div className="container mx-auto p-4 max-w-3xl font-display">
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
                className="mt-4 flex gap-4 items-start"
            >
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 bg-grey-50 text-grey-800"
                    placeholder="Add a comment..."
                    aria-label="Add a new comment"
                />
                <button
                    onClick={addComment}
                    className="bg-purple-600 cursor-pointer text-white py-2 px-4 rounded-lg hover:bg-purple-800 focus:outline-none"
                    aria-label="Send new comment"
                >
                    Send
                </button>
            </motion.div>
        </div>
    );
};

export default CommentFlow;
