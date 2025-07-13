module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            colors: {
                'purple-600': 'hsl(238, 40%, 52%)',
                'pink-400': 'hsl(358, 79%, 66%)',
                'purple-200': 'hsl(239, 57%, 85%)',
                'pink-200': 'hsl(357, 100%, 86%)',
                'grey-800': 'hsl(212, 24%, 26%)',
                'grey-500': 'hsl(211, 10%, 45%)',
                'grey-100': 'hsl(223, 19%, 93%)',
                'grey-50': 'hsl(228, 33%, 97%)',
                white: 'hsl(0, 100%, 100%)',
            },
            fontFamily: {
                rubik: ['Rubik', 'sans-serif'],
            },
        },
    },
    plugins: [],
};