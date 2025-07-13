import React, { useEffect, useState } from 'react';
import UserAvatar from './UserAvatar';
import VoteButton from './VoteButton';
import ConfirmationModal from './ConfirmationModal';
import { AnimatePresence, motion } from 'framer-motion';

const Comment = ({ comment, currentUser, onReply, onVote, onEdit, onDelete }) => {
    const [isReplying, setIsReplying] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [replyContent, setReplyContent] = useState('');
    const [editContent, setEditContent] = useState(comment.content);
    const [showModal, setShowModal] = useState(false);
    const [timeSince, setTimeSince] = useState('');

    useEffect(() => {
        const formatTimeAgo = () => {
            const now = Date.now();
            const diffMs = now - comment.timestamp;
            const diffSec = Math.floor(diffMs / 1000);

            if (diffSec < 60) return `${diffSec} seconds ago`;
            const diffMin = Math.floor(diffSec / 60);
            if (diffMin < 60) return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
            const diffHr = Math.floor(diffMin / 60);
            if (diffHr < 24) return `${diffHr} hour${diffHr > 1 ? 's' : ''} ago`;
            const diffDay = Math.floor(diffHr / 24);
            if (diffDay < 30) return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;

            return new Date(comment.timestamp).toLocaleDateString();
        };

        setTimeSince(formatTimeAgo());
    }, [comment.timestamp]);

    const handleDelete = () => {
        setShowModal(true);
    };

    const confirmDelete = () => {
        onDelete(comment.id);
        setShowModal(false);
    };

    const displayContent = comment.replyingTo
        ? `@${comment.replyingTo} ${comment.content}`
        : comment.content;

    return (
        <motion.div
            className="bg-white p-4 rounded-lg shadow-md mb-4 w-full"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
        >
            <div className="flex flex-col sm:flex-row items-start gap-4">
                <div className="sm:order-1 sm:flex hidden">
                    <VoteButton score={comment.score} onVote={(type) => onVote(comment.id, type)} />
                </div>
                <div className="flex-1 sm:order-2 w-full">
                    <div className="flex items-center justify-between flex-wrap sm:flex-nowrap">
                        <div className="flex flex-wrap items-center gap-2">
                            <UserAvatar image={comment.user.image} username={comment.user.username} />
                            <span className="font-bold text-gray-800">{comment.user.username}</span>
                            {currentUser.username === comment.user.username && (
                                <span className="bg-purple-600 text-white text-xs px-2 py-0.5 rounded-md uppercase">you</span>
                            )}
                            <span className="text-gray-500 text-sm">{timeSince}</span>
                        </div>

                        <div className="hidden sm:flex  space-x-4 text-sm mt-2 sm:mt-0">
                            {currentUser.username === comment.user.username ? (
                                <>
                                    <button
                                        onClick={() => setIsEditing(!isEditing)}
                                        className="flex items-center gap-1 cursor-pointer text-purple-600 hover:text-purple-700 transition-all duration-150 transform hover:scale-105 focus:outline-none"
                                        aria-label="Edit comment"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" className="w-4 h-4 transition-all duration-150">
                                            <path d="M17.414 2.586a2 2 0 010 2.828L8.828 14H6v-2.828l8.586-8.586a2 2 0 012.828 0z" />
                                        </svg>
                                        Edit
                                    </button>

                                    <button
                                        onClick={handleDelete}
                                        className="flex items-center gap-1 cursor-pointer text-pink-500 hover:text-pink-600 transition-all duration-150 transform hover:scale-105 focus:outline-none"
                                        aria-label="Delete comment"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4 transition-all duration-150">
                                            <path d="M9 3h6v1h5v2H4V4h5V3zm2 5h2v10h-2V8zm-4 0h2v10H7V8zm8 0h2v10h-2V8z" />
                                        </svg>
                                        Delete
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => setIsReplying(!isReplying)}
                                    className="flex items-center cursor-pointer gap-1 text-purple-600 hover:text-purple-700 transition-all duration-150 transform hover:scale-105 focus:outline-none"
                                    aria-label="Reply to comment"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" className="w-4 h-4 transition-all duration-150">
                                        <path d="M9 5l-7 7 7 7v-4h4c3.314 0 6-2.686 6-6v-4h-2v4c0 2.206-1.794 4-4 4h-4V5z" />
                                    </svg>
                                    Reply
                                </button>
                            )}
                        </div>
                    </div>

                    {isEditing ? (
                        <div className="mt-4 w-full bg-white rounded-xl shadow-sm border border-gray-200 p-4 space-y-3">
                            <label htmlFor="edit-comment" className="text-sm text-gray-600 font-medium">
                                Editing your comment
                            </label>
                            <textarea
                                id="edit-comment"
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                className="w-full min-h-[100px] resize-none rounded-lg border border-gray-300 bg-gray-50 p-3 text-sm text-gray-800 shadow-inner focus:border-purple-500 focus:ring-2 focus:ring-purple-300 focus:outline-none transition"
                                placeholder="Edit your comment..."
                                aria-label="Edit comment"
                            />
                            <div className="flex justify-end">
                                <button
                                    onClick={() => {
                                        onEdit(comment.id, editContent);
                                        setIsEditing(false);
                                    }}
                                    className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition-all shadow-md"
                                    aria-label="Save edited comment"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>

                    ) : (
                        <p className="text-gray-800 mt-2 whitespace-pre-wrap">{displayContent}</p>
                    )}

                    <AnimatePresence>
                        {isReplying && (
                            <motion.div
                                className="mt-4 w-full"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="w-full bg-white rounded-xl shadow-sm border border-gray-200 p-4 space-y-3">
                                    <span className="text-sm text-gray-500">
                                        Replying to <span className="font-semibold text-gray-800">@{comment.user.username}</span>
                                    </span>
                                    <textarea
                                        value={replyContent}
                                        onChange={(e) => setReplyContent(e.target.value)}
                                        className="w-full min-h-[80px] resize-none rounded-lg border border-gray-300 bg-gray-50 p-3 text-sm text-gray-800 shadow-inner focus:border-purple-500 focus:ring-2 focus:ring-purple-300 focus:outline-none transition"
                                        placeholder={`@${comment.user.username} `}
                                        aria-label="Reply input"
                                    />
                                    <div className="flex justify-end">
                                        <button
                                            onClick={() => {
                                                const trimmed = replyContent.trim();
                                                if (trimmed) {
                                                    const finalReply = `@${comment.user.username} ${trimmed}`;
                                                    onReply(comment.id, finalReply);
                                                    setReplyContent('');
                                                    setIsReplying(false);
                                                }
                                            }}
                                            className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition-all shadow-md"
                                            aria-label="Send reply"
                                        >
                                            Reply
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="sm:hidden flex justify-between mt-2">
                        <VoteButton score={comment.score} onVote={(type) => onVote(comment.id, type)} />
                        <div className="flex space-x-4 text-sm sm:mt-0">
                            {currentUser.username === comment.user.username ? (
                                <>
                                    <button
                                        onClick={() => setIsEditing(!isEditing)}
                                        className="flex items-center gap-1 cursor-pointer text-purple-600 hover:text-purple-700 transition-all duration-150 transform hover:scale-105 focus:outline-none"
                                        aria-label="Edit comment"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" className="w-4 h-4 transition-all duration-150">
                                            <path d="M17.414 2.586a2 2 0 010 2.828L8.828 14H6v-2.828l8.586-8.586a2 2 0 012.828 0z" />
                                        </svg>
                                        Edit
                                    </button>

                                    <button
                                        onClick={handleDelete}
                                        className="flex items-center gap-1 cursor-pointer text-pink-500 hover:text-pink-600 transition-all duration-150 transform hover:scale-105 focus:outline-none"
                                        aria-label="Delete comment"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4 transition-all duration-150">
                                            <path d="M9 3h6v1h5v2H4V4h5V3zm2 5h2v10h-2V8zm-4 0h2v10H7V8zm8 0h2v10h-2V8z" />
                                        </svg>
                                        Delete
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => setIsReplying(!isReplying)}
                                    className="flex items-center cursor-pointer gap-1 text-purple-600 hover:text-purple-700 transition-all duration-150 transform hover:scale-105 focus:outline-none"
                                    aria-label="Reply to comment"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" className="w-4 h-4 transition-all duration-150">
                                        <path d="M9 5l-7 7 7 7v-4h4c3.314 0 6-2.686 6-6v-4h-2v4c0 2.206-1.794 4-4 4h-4V5z" />
                                    </svg>
                                    Reply
                                </button>
                            )}
                        </div>
                    </div>

                    {comment.replies && comment.replies.length > 0 && (
                        <div className="border-l-2 border-gray-100 pl-4 sm:pl-10 mt-4 space-y-4">
                            <AnimatePresence>
                                {comment.replies
                                    .sort((a, b) => b.timestamp - a.timestamp)
                                    .map((reply) => (
                                        <Comment
                                            key={reply.id}
                                            comment={reply}
                                            currentUser={currentUser}
                                            onReply={onReply}
                                            onVote={onVote}
                                            onEdit={onEdit}
                                            onDelete={onDelete}
                                        />
                                    ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </div>

            {showModal && (
                <ConfirmationModal
                    onConfirm={confirmDelete}
                    onCancel={() => setShowModal(false)}
                />
            )}
        </motion.div>
    );
};

export default Comment;
