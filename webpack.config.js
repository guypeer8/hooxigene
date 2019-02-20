const { resolve } = require('path');

module.exports = {
    entry: resolve(__dirname, 'src/index.js'),
    resolve: {
        extensions: ['.js'],
    },
    output: {
        path: resolve(__dirname, 'dist'),
        filename: 'index.js',
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                loader: 'babel-loader',
                exclude: /(node_modules)/,
                options: {
                    presets: [
                        '@babel/preset-env',
                        '@babel/preset-react',
                    ],
                    plugins: [
                        '@babel/plugin-syntax-object-rest-spread',
                    ],
                },
            },
        ],
    },
    optimization: {
        minimize: true,
    },
};
