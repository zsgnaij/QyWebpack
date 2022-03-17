const path = require('path');
const { DefinePlugin } = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HttpWebpackPlugin = require('html-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const isWsl = require('is-wsl');

module.exports = {
    mode: 'production',
    entry: path.resolve(__dirname, 'src/index.js'),
    output: {
        filename: 'bundle.[hash].js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.less|.css$/i,
                use: [
                    'style-loader',
                    'css-loader',
                    'less-loader',
                ],
            },
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                }
            }
        ],
    },
    plugins: [
        // 清理build目录文件，不传递参数默认清理 output.path
        new CleanWebpackPlugin(),
        new HttpWebpackPlugin({
            template: path.resolve(__dirname, 'public/index.html'),
            filename: 'index.html'
        }),
        new BundleAnalyzerPlugin(),
        new DefinePlugin({
            // 值不能直接写字符串，否则会被转换为变量
            SOME_THING: JSON.stringify('webpack demo')
        })
    ],
    optimization: {
        minimize: true,
        minimizer: [
            new TerserWebpackPlugin({
                // 不将注释单独提到（license）文件中
                extractComments: false,
                // 多线程打包
                parallel: !isWsl,
                terserOptions: {
                    // 去除无用代码
                    compress: {
                        unused: true,
                        drop_debugger: true,
                        drop_console: true,
                        dead_code: true
                    }
                }
            })
        ]
    }
}