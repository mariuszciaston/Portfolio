import { mocapProjects, musicProjects, graphicProjects } from './content';
import { generatePlaceholder, renderProject } from './generateProjects';

declare global {
	interface Window {
		dataLayer: any[];
		gtag: (...args: any[]) => void;
	}
}

const moonIcon = document.querySelector('#theme-switch .fa-moon');
const sunIcon = document.querySelector('#theme-switch .fa-sun');

function initTheme() {
	if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
		document.documentElement.className = 'theme-dark';
		moonIcon.classList.add('hide');
		sunIcon.classList.remove('hide');
	} else {
		document.documentElement.className = 'theme-light';
		moonIcon.classList.remove('hide');
		sunIcon.classList.add('hide');
	}
}

function toggleTheme() {
	const isDark = document.documentElement.className === 'theme-dark';

	if (isDark) {
		document.documentElement.className = 'theme-light';
		moonIcon.classList.remove('hide');
		sunIcon.classList.add('hide');
	} else {
		document.documentElement.className = 'theme-dark';
		moonIcon.classList.add('hide');
		sunIcon.classList.remove('hide');
	}
}

function watchTheme() {
	window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
		if (event.matches) {
			document.documentElement.className = 'theme-dark';
			moonIcon.classList.add('hide');
			sunIcon.classList.remove('hide');
		} else {
			document.documentElement.className = 'theme-light';
			moonIcon.classList.remove('hide');
			sunIcon.classList.add('hide');
		}
	});
}

function toggleGrayscale() {
	const grayscaleIcon = document.querySelector('#grayscale-switch > svg');

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

function apply3DEffect(container: HTMLElement) {
	if (container.dataset.has3d === 'true') return;
	const item = container.querySelector('.item') as HTMLElement;
	if (item.querySelector('iframe')) return;

	container.dataset.has3d = 'true';
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
}

function setupViewportRendering() {
	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					const container = entry.target as HTMLElement;
					if (container.dataset.rendered === 'false') {
						renderProject(container);
						container.dataset.rendered = 'true';
						observer.unobserve(container);
						apply3DEffect(container);
					}
				}
			});
		},
		{ rootMargin: '0px' }
	);

	document.querySelectorAll('.item-container[data-rendered="false"]').forEach((container) => {
		observer.observe(container);
	});
}

document.addEventListener('DOMContentLoaded', () => {
	initTheme();
	watchTheme();
	document.querySelector('#theme-switch')?.addEventListener('click', toggleTheme);
	toggleGrayscale();
	topBarScrollFixIOS();
	document.querySelector('#heading h1')?.addEventListener('click', () => window.location.reload());

	document.querySelectorAll('.item-container[data-rendered="true"]:not([data-has3d])').forEach((container) => {
		apply3DEffect(container as HTMLElement);
	});

	setupViewportRendering();

	let mocapGenerated = false;
	let musicGenerated = false;
	let graphicsGenerated = false;

	const sectionTitles = document.querySelectorAll('section h2');
	sectionTitles.forEach((sectionTitle) => {
		sectionTitle.addEventListener('click', () => {
			sectionTitle.parentElement.classList.toggle('hidden');
			if (sectionTitle.parentElement.id === 'second' && !mocapGenerated) {
				document.querySelector('.grid-container.mocap')!.innerHTML = generatePlaceholder(mocapProjects, 'mocap');
				mocapGenerated = true;
				setupViewportRendering();
			}
			if (sectionTitle.parentElement.id === 'third' && !musicGenerated) {
				document.querySelector('.grid-container.music')!.innerHTML = generatePlaceholder(musicProjects, 'music');
				musicGenerated = true;
				setupViewportRendering();
			}
			if (sectionTitle.parentElement.id === 'fourth' && !graphicsGenerated) {
				document.querySelector('.grid-container.graphics')!.innerHTML = generatePlaceholder(graphicProjects, 'graphics');
				graphicsGenerated = true;
				setupViewportRendering();
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
