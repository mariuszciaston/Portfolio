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
import { widths } from './src/generateProjects.ts';
import { generateProjects } from './src/generateProjects.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const resolutions = widths.map((w) => ({ width: w, height: Math.round((w / 4) * 3) }));
const resolutionsPlusLarge = [...widths, 2560].map((w) => ({ width: w, height: Math.round((w / 4) * 3) }));

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
				// webdevHtml: generateProjects(webdevProjects.slice(0, 1), 'webdev'),
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
				generator: resolutions.flatMap((res) => [
					// WEBP
					{
						type: 'asset',
						preset: 'webdev-webp',
						implementation: ImageMinimizerPlugin.sharpGenerate,
						options: {
							resize: { width: res.width, height: res.height },
							encodeOptions: {
								webp: { quality: 80, method: 6 },
							},
						},
						filename: `webdev/[name]-${res.width}[ext]`,
					},

					// PNG
					{
						type: 'asset',
						preset: 'webdev-png',
						implementation: ImageMinimizerPlugin.sharpGenerate,
						options: {
							resize: { width: res.width, height: res.height },
							encodeOptions: {
								png: {
									quality: 90,
									compressionLevel: 9,
									progressive: true,
								},
							},
						},
						filename: `webdev/[name]-${res.width}[ext]`,
					},
				]),
			}),

			new ImageMinimizerPlugin({
				test: /mocap\/.+\.(jpe?g|png)$/i,
				deleteOriginalAssets: false,
				generator: [
					// WEBP
					...resolutionsPlusLarge.map((res) => ({
						type: 'asset',
						preset: `mocap-webp`,
						implementation: ImageMinimizerPlugin.sharpGenerate,
						options: {
							resize: { width: res.width, height: res.height },
							encodeOptions: {
								webp: { quality: 80, method: 6 },
							},
						},
						filename: `mocap/[name]-${res.width}[ext]`,
					})),

					// JPG
					...resolutionsPlusLarge.map((res) => ({
						type: 'asset',
						preset: `mocap-jpg`,
						implementation: ImageMinimizerPlugin.sharpGenerate,
						options: {
							resize: { width: res.width, height: res.height },
							encodeOptions: {
								jpg: {
									quality: 80,
									mozjpeg: true,
									progressive: true,
									optimiseScans: true,
									trellisQuantisation: true,
								},
							},
						},
						filename: `mocap/[name]-${res.width}[ext]`,
					})),

					// JPG fallback
					{
						type: 'asset',
						preset: `mocap-jpg-fallback`,
						implementation: ImageMinimizerPlugin.sharpGenerate,
						options: {
							resize: { width: 1280, height: 960 },
							encodeOptions: {
								jpg: {
									quality: 80,
									mozjpeg: true,
									progressive: true,
									optimiseScans: true,
									trellisQuantisation: true,
								},
							},
						},
						filename: `mocap/[name][ext]`,
					},
				],
			}),

			new ImageMinimizerPlugin({
				test: /graphics\/.+\.(jpe?g|png)$/i,
				deleteOriginalAssets: false,
				generator: [
					// WEBP
					...resolutionsPlusLarge.map((res) => ({
						type: 'asset',
						preset: `graphics-webp`,
						implementation: ImageMinimizerPlugin.sharpGenerate,
						options: {
							resize: { width: res.width, height: res.height },
							encodeOptions: {
								webp: { quality: 80, method: 6 },
							},
						},
						filename: `graphics/[name]-${res.width}[ext]`,
					})),

					// PNG
					...resolutionsPlusLarge.map((res) => ({
						type: 'asset',
						preset: `graphics-png`,
						implementation: ImageMinimizerPlugin.sharpGenerate,
						options: {
							resize: { width: res.width, height: res.height },
							encodeOptions: {
								png: {
									quality: 90,
									compressionLevel: 9,
									progressive: true,
								},
							},
						},
						filename: `graphics/[name]-${res.width}[ext]`,
					})),

					// PNG fallback
					{
						type: 'asset',
						preset: `graphics-png-fallback`,
						implementation: ImageMinimizerPlugin.sharpGenerate,
						options: {
							resize: { width: 1280, height: 960 },
							encodeOptions: {
								png: {
									quality: 90,
									compressionLevel: 9,
									progressive: true,
								},
							},
						},
						filename: `graphics/[name][ext]`,
					},
				],
			}),
		],
	},
};
