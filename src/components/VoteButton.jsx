import React, { useState } from 'react';

const VoteButton = ({ score: initialScore, onVote }) => {
    const [vote, setVote] = useState(null); // 'up', 'down', or null
    const [score, setScore] = useState(initialScore);

    const handleVote = (type) => {
        let newVote = null;
        let scoreChange = 0;

        if (vote === type) {
            // Undo current vote
            newVote = null;
            scoreChange = type === 'up' ? -1 : 1;
        } else if (vote === null) {
            // New vote
            newVote = type;
            scoreChange = type === 'up' ? 1 : -1;
        } else {
            // Switching vote (e.g. from 'up' to 'down')
            newVote = type;
            scoreChange = type === 'up' ? 2 : -2;
        }

        setVote(newVote);
        setScore((prev) => prev + scoreChange);
        onVote?.(newVote, scoreChange); // Inform parent if needed
    };

    return (
        <div className="flex sm:flex-col items-center bg-gray-100 sm:px-3 sm:py-4 py-0.5 px-3 md:space-x-0 space-x-2 rounded-lg sm:w-10 transition-all">
            <button
                onClick={() => handleVote('up')}
                className={`hover:scale-120 cursor-pointer transition-transform duration-150 ${vote === 'up' ? 'text-purple-600' : 'text-gray-400 hover:text-purple-500'
                    }`}
                aria-label="Upvote"
            >
                <img
                    src="./images/icon-plus.svg"
                    alt="upvote"
                    className={`w-3 ${vote === 'up' ? 'filter-purple' : ''}`}
                />
            </button>

            <span className="text-gray-800 font-medium text-sm mt-2 mb-2  w-6 text-center font-mono tabular-nums">
                {score}
            </span>

            <button
                onClick={() => handleVote('down')}
                className={`hover:scale-120 cursor-pointer transition-transform duration-150 ${vote === 'down' ? 'text-purple-600' : 'text-gray-400 hover:text-purple-500'
                    }`}
                aria-label="Downvote"
            >
                <img
                    src="./images/icon-minus.svg"
                    alt="downvote"
                    className={`w-3 ${vote === 'down' ? 'filter-purple' : ''}`}
                />
            </button>
        </div>
    );
};

export default VoteButton;
