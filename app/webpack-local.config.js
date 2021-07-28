const path = require('path')
const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const Dotenv = require('dotenv-webpack')

module.exports = {
    entry: {
        index: path.resolve(__dirname, './src/index.tsx'),
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[hash:8].js',
        publicPath: '/',
        // TODO: this line may need to be uncommented and changed for different webserver environments
        //     ...this prefix determines what is prepended to resource requests from "index.html"
        //     ...e.g. the value 'dist' in the injected tag <script src="/dist/react-dom.js"></script>
        // publicPath: "/dist/"
    },
    optimization: {
        runtimeChunk: 'single',
        splitChunks: {
            chunks: 'all',
            maxInitialRequests: Infinity,
            minSize: 0,
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name(module) {
                        const packageName = module.context.match(
                            /[\\/]node_modules[\\/](.*?)([\\/]|$)/
                        )[1]
                        return `npm.${packageName.replace('@', '')}`
                    },
                },
            },
        },
    },
    devtool: 'source-map',

    resolve: {
        modules: [
            path.resolve(__dirname, '/src'),
            path.resolve(__dirname, 'node_modules/'),
        ],
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.scss', '.css'],
    },

    module: {
        rules: [
            {
                test: /\.([jt]s)x?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
            // {
            //     test: /\.tsx?$/,
            //     loader: "ts-loader"
            // },
            // {
            //     enforce: "pre",
            //     test: /\.js$/,
            //     loader: "source-map-loader"
            // },
            {
                test: /\.s?css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: ['file-loader'],
            },
            // {
            //     test: /\.(woff|woff2|eot|ttf|otf)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            //     use: [
            //         'file-loader'
            //     ]
            // },
            // {
            //     test: /\.(csv|tsv)$/,
            //     use: [
            //         'csv-loader'
            //     ]
            // },
            // {
            //     test: /\.xml$/,
            //     use: [
            //         'xml-loader'
            //     ]
            // },
            // {
            //     test: /\.less$/,
            //     use: [
            //         {
            //             loader: MiniCssExtractPlugin.loader
            //         },
            //         'css-loader',
            //         'less-loader'
            //     ]
            // }
        ],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new Dotenv({
            path: '../.env',
        }),
        new HtmlWebPackPlugin({
            template: './src/index.html',
            filename: 'index.html',
        }),
        new webpack.HashedModuleIdsPlugin(),
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css',
            chunkFilename: '[id].css',
        }),
        new CopyPlugin([
            { from: './src/img/favicon.png', to: '', flatten: true },
            { from: './src/img/*.png', to: 'img', flatten: true },
            { from: './src/img/*.svg', to: 'img', flatten: true },
        ]),
    ],
    devServer: {
        historyApiFallback: true,
        publicPath: '/',
        contentBase: path.resolve(__dirname, './build/dist'),
        port: 3333,
        proxy: {
            '/api': {
                target: 'http://192.168.99.100:5678',
                secure: false,
            },
        },
    },
}
