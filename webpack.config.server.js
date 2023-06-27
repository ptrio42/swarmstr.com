const nodeExternals = require('webpack-node-externals');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
    name: 'server',
    entry: {
        server: path.resolve(__dirname, 'server', 'server.tsx'),
    },
    mode: 'production',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
        alias: {
            'nostr-hooks': path.resolve(__dirname, 'node_modules/nostr-hooks'),
            'domhandler': path.resolve(__dirname, 'node_modules/domhandler'),
        }
    },
    externals: [nodeExternals({
        allowlist: [/\.css$/, 'nostr-mux', 'domhandler', 'nostr-hooks']
    })],
    target: 'node',
    node: {
        __dirname: false,
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                options: {
                    configFile: 'tsconfig.server.json',
                },
            },
            {
                test: /\.css$/,
                // exclude: [/node_modules/],
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            esModule: false,
                        },
                    },
                    'css-loader',
                ],
            },
        ]
    },
    plugins: [
        new CopyPlugin({
            patterns: [{ context: 'server', from: 'views', to: 'views' }],
        }),
        new MiniCssExtractPlugin(),
        new Dotenv({
            path: './.env'
        }),
    ],
};