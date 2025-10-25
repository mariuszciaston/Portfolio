import lighthouse from 'lighthouse';
import puppeteer from 'puppeteer';

const url = 'http://localhost:3000';
const runs = 10;
const spinnerFrames = ['|', '/', '-', '\\'];
let spinnerIndex = 0;
let spinnerInterval;

function startSpinner() {
	spinnerInterval = setInterval(() => {
		process.stdout.write(`\r${spinnerFrames[spinnerIndex++ % spinnerFrames.length]} Running Lighthouse...`);
	}, 100);
}

function stopSpinner() {
	clearInterval(spinnerInterval);
	process.stdout.write('\r\x1b[K'); // clear line
}

(async () => {
	const browser = await puppeteer.launch({ headless: true });
	const scores = [];

	for (let i = 0; i < runs; i++) {
		startSpinner();
		const { lhr } = await lighthouse(url, {
			port: new URL(browser.wsEndpoint()).port,
			emulatedFormFactor: 'mobile',
			throttlingMethod: 'provided',
		});
		stopSpinner();

		const runScores = {
			Performance: lhr.categories.performance.score * 100,
			Accessibility: lhr.categories.accessibility.score * 100,
			Best_Practices: lhr.categories['best-practices'].score * 100,
			SEO: lhr.categories.seo.score * 100,
		};

		scores.push(runScores);
		console.log(`Run ${i + 1}:`, runScores);
	}

	console.log('');

	const avg = (obj) => (obj.Performance + obj.Accessibility + obj.Best_Practices + obj.SEO) / 4;

	const worstRun = scores.reduce((a, b) => (avg(b) < avg(a) ? b : a));
	console.log('\x1b[31m%s\x1b[0m', 'Worst run:', worstRun);

	const bestRun = scores.reduce((a, b) => (avg(b) > avg(a) ? b : a));
	console.log('\x1b[32m%s\x1b[0m', 'Best run:', bestRun);

	const avgScores = {
		Performance: scores.reduce((a, b) => a + b.Performance, 0) / scores.length,
		Accessibility: scores.reduce((a, b) => a + b.Accessibility, 0) / scores.length,
		Best_Practices: scores.reduce((a, b) => a + b.Best_Practices, 0) / scores.length,
		SEO: scores.reduce((a, b) => a + b.SEO, 0) / scores.length,
	};

	console.log(`\x1b[34mAverage scores after ${runs} runs:\x1b[0m`, avgScores);
	console.log('');

	await browser.close();
})();
