import React from 'react';


const UserAvatar = ({ image, username, alt }) => {
    return (
        <div className="w-10 h-10">
            <img
                src={image.webp || image.png}
                alt={alt || `${username}'s avatar`}
                className="w-full h-full rounded-full object-cover"
                loading="lazy"
                aria-label={`Avatar for ${username}`}
            />
        </div>
    );
};

export default UserAvatar;