module.exports = {
    entry: "./public/js/app.js",
    output: {
        path: __dirname + "/public",
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
        ]
    },
    watch: true
}