import { fileURLToPath } from 'url';
import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';

import { webdevProjects } from './src/content.ts';
import { generateProjects } from './src/generateProjects.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
		new HtmlWebpackPlugin({
			template: './src/index.html',
			favicon: './src/favicon/favicon.ico',
			templateParameters: {
				webdevHtml: generateProjects(webdevProjects, 'webdev'),
			},
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
		],
	},

	resolve: {
		extensions: ['.tsx', '.ts', '.js'],
	},

	optimization: {
		minimizer: [new TerserPlugin(), new CssMinimizerPlugin()],
	},
};
