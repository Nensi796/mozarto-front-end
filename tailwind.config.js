module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
    theme: {
        extend: {
            colors: {
                green: {
                    100: '#2E672F',
                    200: '#8FB131',
                    300: '#6F8D23',

                    500: '#B6FFB6',
                },
                red: {
                    100: '#FFF5F5',
                    200: '#E53E3E',
                },
                gray: {
                    100: '#FFF5F5',
                    200: '#F5F5F5',
                    300: '#C8C8C8',
                    400: '#818181',
                    500: '#A4A4A4',
                    600: '#383838',
                    700: '#FAFAF5',
                },
                pink: {
                    100: '#FCA2C2',
                },
            },
        },
    },
    plugins: [],
};
