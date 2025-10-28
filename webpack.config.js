import { fileURLToPath } from 'url';
import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import ImageMinimizerPlugin from 'image-minimizer-webpack-plugin';

import { webdevProjects } from './src/content.ts';
import { generateProjects } from './src/generateProjects.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const webpSettings = { quality: 75, method: 6 };
const mocapWebpSettings = { quality: 50, method: 6 };
const sizes = [
	{ width: 384, height: 288 },
	{ width: 480, height: 360 },
	{ width: 512, height: 384 },
	{ width: 768, height: 576 },
	{ width: 1024, height: 768 },
	{ width: 1280, height: 960 },
];

export default {
	mode: 'production',
	entry: './src/index.ts',
	output: {
		filename: 'main.js',
		path: path.resolve(__dirname, 'dist'),
		clean: true,
	},
	performance: {
		hints: false,
		maxEntrypointSize: 512000,
		maxAssetSize: 512000,
	},
	// devtool: 'inline-source-map',
	plugins: [
		new webpack.ProgressPlugin((percentage, message, ...args) => {
			console.info(percentage, message, ...args);
		}),
		new HtmlWebpackPlugin({
			template: './src/index.html',
			templateParameters: {
				webdevHtml: generateProjects(webdevProjects, 'webdev'),
			},
			// inject: 'body',
			// chunksSortMode: 'manual',
			// chunks: ['main'],
			minify: {
				removeComments: true,
				collapseWhitespace: true,
				removeRedundantAttributes: true,
				useShortDoctype: true,
				removeEmptyAttributes: true,
				removeStyleLinkTypeAttributes: true,
				keepClosingSlash: true,
				minifyJS: true,
				minifyCSS: true,
				minifyURLs: true,
			},
		}),
		new CopyPlugin({
			patterns: [
				{ from: './src/favicon', to: '' },
				{ from: './src/fonts', to: './fonts' },
				{ from: './src/img', to: './img' },
				{ from: './src/webdev', to: './webdev' },
				{ from: './src/mocap', to: './mocap' },
				{ from: './src/graphics', to: './graphics' },
			],
		}),
		new MiniCssExtractPlugin({
			filename: '[name].css',
			chunkFilename: '[id].css',
		}),
	],
	module: {
		rules: [
			{
				test: /\.css$/i,
				use: [MiniCssExtractPlugin.loader, 'css-loader'],
			},
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
			{
				test: /\.(woff2?|ttf|otf|eot)$/,
				type: 'asset/resource',
				generator: {
					filename: 'fonts/[name][ext][query]',
				},
			},
		],
	},

	resolve: {
		extensions: ['.tsx', '.ts', '.js'],
	},

	optimization: {
		minimizer: [
			new TerserPlugin(),
			new CssMinimizerPlugin(),
			new ImageMinimizerPlugin({
				test: /webdev\/.+\.(jpe?g|png)$/i,
				deleteOriginalAssets: false,
				generator: sizes.map(size => ({
					type: 'asset',
					preset: `webp-${size.width}-lossless`,
					implementation: ImageMinimizerPlugin.imageminGenerate,
					options: {
						plugins: [['imagemin-webp', { ...webpSettings, resize: size }]],
					},
					filename: `webdev/[name]-${size.width}[ext]`,
				})),
			}),
			new ImageMinimizerPlugin({
				test: /graphics\/.+\.(jpe?g|png)$/i,
				deleteOriginalAssets: false,
				generator: sizes.map(size => ({
					type: 'asset',
					preset: `graphics-${size.width}-lossless`,
					implementation: ImageMinimizerPlugin.imageminGenerate,
					options: {
						plugins: [['imagemin-webp', { ...webpSettings, resize: size }]],
					},
					filename: `graphics/[name]-${size.width}[ext]`,
				})),
			}),
			new ImageMinimizerPlugin({
				test: /mocap\/.+\.(jpe?g|png)$/i,
				deleteOriginalAssets: false,
				generator: sizes.map(size => ({
					type: 'asset',
					preset: `mocap-${size.width}-lossless`,
					implementation: ImageMinimizerPlugin.imageminGenerate,
					options: {
						plugins: [['imagemin-webp', { ...mocapWebpSettings, resize: size }]],
					},
					filename: `mocap/[name]-${size.width}[ext]`,
				})),
			}),
		],
	},
};
