const spawn = require('cross-spawn');
const path = require('path');
const webpack = require('webpack');
const webpackConfigClient = require('./webpack.config.client');
const webpackConfigServer = require('./webpack.config.server');
const Dotenv = require('dotenv-webpack');

const compiler = webpack([
    {
        ...webpackConfigClient,
        mode: 'development',
        devtool: 'source-map',
        output: {
            ...webpackConfigClient.output,
            filename: '[name].js',
        },
        plugins: [
            ...webpackConfigClient.plugins.filter(plugin => !(plugin instanceof Dotenv)),
            new Dotenv({
                path: './.development.env'
            }),
        ]
    },
    {
        ...webpackConfigServer,
        mode: 'development',
        devtool: 'source-map',
        plugins: [
            ...webpackConfigServer.plugins.filter(plugin => !(plugin instanceof Dotenv)),
            new Dotenv({
                path: './.development.env'
            }),
        ]
    },
]);

let node;

compiler.hooks.watchRun.tap('Dev', (compiler) => {
    console.log(`Compiling ${compiler.name} ...`);
    if (compiler.name === 'server' && node) {
        node.kill();
        node = undefined
    }
});

compiler.watch({}, (err, stats) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(stats?.toString('minimal'));
    const compiledSuccessfully = !stats?.hasErrors();
    if (compiledSuccessfully && !node) {
        console.log('Starting Node.js ...');
        node = spawn(
            'node',
            ['--inspect', path.join(__dirname, 'dist/server.js')],
            {
                stdio: 'inherit',
            }
        )
    }
});