const rewire = require('rewire');
const defaults = rewire('react-scripts/scripts/build.js');
let config = defaults.__get__('config');
const paths = defaults.__get__('paths');

config.entry = {
    main: paths.appIndexJs,
    calculator: {
        import: './src/components/FiatToSatsCalculator/FiatToSatsCalculator',
        filename: './tools/calculator.js'
    }
};

config.output = {
    ...config.output,
    library: '[name]',
    libraryTarget: 'umd',
    umdNamedDefine: true
};
