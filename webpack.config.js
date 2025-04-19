module.exports = {
    entry: {
        bundle: './src/Main.ts'
    },
    output: {
        path: `${__dirname}/dist`,
        filename: 'bundle.js',
        publicPath: '/',
    },
    mode: 'development',
    resolve: {
        extensions: [".ts", ".js"],
    },
    devServer: {
        static: {
            directory: `${__dirname}/dist`,
        },
        watchFiles: ['src/**/*.ts'],
        open: true
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader:"ts-loader",
                exclude: /node_modules/,
            }
        ]
    }
}
