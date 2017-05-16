module.exports = {
    entry: "./resources/js/app.js",
    output: {
        path: __dirname + "/public/js",
        filename: "bundle.js",
    },
    module: {
        loaders: [
            {
                exclude: /node_modules/,
                loader: "babel-loader",
                test: /\.js$/,
                query: {
                    presets: ['es2015', 'react']
                }
            }
        ],
        rules: [{
            test: /\.scss$/,
            use: [{
                loader: "sass-loader"
            }]
        }]
    },
    devServer: {
        inline: true,
        contentBase: "./",
        port: 3000
    },
    watch: true
}