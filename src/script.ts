import { mocapProjects, musicProjects, graphicProjects } from './content';
import { generateProjects } from './generateProjects';

declare global {
	interface Window {
		dataLayer: any[];
		gtag: (...args: any[]) => void;
	}
}

function initTheme() {
	const themeIcon = document.querySelector('#theme-switch > i');

	if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
		themeIcon?.classList.toggle('fa-sun', true);
		themeIcon?.classList.toggle('fa-moon', false);
		document.documentElement.className = 'theme-dark';
	} else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
		themeIcon?.classList.toggle('fa-moon', true);
		themeIcon?.classList.toggle('fa-sun', false);
		document.documentElement.className = 'theme-light';
	}
}

function toggleTheme() {
	const themeIcon = document.querySelector('#theme-switch > i');
	themeIcon.classList.toggle('fa-sun');
	themeIcon.classList.toggle('fa-moon');

	if (themeIcon.classList.contains('fa-sun')) {
		document.documentElement.className = 'theme-dark';
	} else if (themeIcon.classList.contains('fa-moon')) {
		document.documentElement.className = 'theme-light';
	}
}

function watchTheme() {
	const themeIcon = document.querySelector('#theme-switch > i');

	window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
		if (event.matches) {
			themeIcon.classList.toggle('fa-sun', true);
			themeIcon.classList.toggle('fa-moon', false);
			document.documentElement.className = 'theme-dark';
		} else if (!event.matches) {
			themeIcon.classList.toggle('fa-moon', true);
			themeIcon.classList.toggle('fa-sun', false);
			document.documentElement.className = 'theme-light';
		}
	});
}

function toggleGrayscale() {
	const grayscaleIcon = document.querySelector('#grayscale-switch > i');

	grayscaleIcon?.addEventListener('click', () => {
		grayscaleIcon.classList.toggle('flip');

		const gridContainers = document.querySelectorAll('.grid-container');

		gridContainers.forEach((gridContainer) => {
			gridContainer.classList.toggle('grayscale');
		});
	});
}

const topBarScrollFixIOS = () => {
	const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;

	if (isIOS) {
		document.querySelector('header').style.overflow = 'visible';
		document.querySelector('main').style.overflow = 'visible';
	}
};

function apply3DEffect() {
	const containers = document.querySelectorAll('.item-container');

	containers.forEach((container) => {
		const item = container.querySelector('.item') as HTMLElement;
		if (item.querySelector('iframe')) return;

		container.addEventListener('mousemove', (e: MouseEvent) => {
			item.classList.remove('leaving');
			const rect = container.getBoundingClientRect();
			const x = e.clientX - rect.left;
			const y = e.clientY - rect.top;

			const centerX = rect.width / 2;
			const centerY = rect.height / 2;

			const rotateY = ((x - centerX) / centerX) * 5;
			const rotateX = -((y - centerY) / centerY) * 5;

			item.style.transform = `perspective(var(--perspective)) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
		});

		container.addEventListener('mouseleave', () => {
			item.classList.add('leaving');
			item.style.transform = `perspective(var(--perspective)) rotateX(0) rotateY(0)`;

			setTimeout(() => {
				item.classList.remove('leaving');
			}, 1000);
		});
	});
}

document.addEventListener('DOMContentLoaded', () => {
	initTheme();
	watchTheme();
	document.querySelector('#theme-switch')?.addEventListener('click', toggleTheme);
	toggleGrayscale();
	topBarScrollFixIOS();
	document.querySelector('#heading h1')?.addEventListener('click', () => window.location.reload());
	apply3DEffect();

	let mocapGenerated = false;
	let musicGenerated = false;
	let graphicsGenerated = false;

	const sectionTitles = document.querySelectorAll('section h2');
	sectionTitles.forEach((sectionTitle) => {
		sectionTitle.addEventListener('click', () => {
			sectionTitle.parentElement.classList.toggle('hidden');
			if (sectionTitle.parentElement.id === 'second' && !mocapGenerated) {
				document.querySelector('.grid-container.mocap').innerHTML = generateProjects(mocapProjects, 'mocap');
				mocapGenerated = true;
				apply3DEffect();
			}
			if (sectionTitle.parentElement.id === 'third' && !musicGenerated) {
				document.querySelector('.grid-container.music').innerHTML = generateProjects(musicProjects, 'music');
				musicGenerated = true;
			}
			if (sectionTitle.parentElement.id === 'fourth' && !graphicsGenerated) {
				document.querySelector('.grid-container.graphics').innerHTML = generateProjects(graphicProjects, 'graphics');
				graphicsGenerated = true;
				apply3DEffect();
			}
		});
	});

	setTimeout(() => {
		const GA_MEASUREMENT_ID = 'G-L4NJKX8FMC';
		const script = document.createElement('script');
		script.async = true;
		script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
		document.head.appendChild(script);

		window.dataLayer = window.dataLayer || [];
		function gtag(...args: any[]) {
			window.dataLayer.push(args);
		}
		(window as any).gtag = gtag;

		gtag('js', new Date());
		gtag('config', GA_MEASUREMENT_ID);
	}, 4000);
});

export { generateProjects };
