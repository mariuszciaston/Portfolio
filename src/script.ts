import { webDevProjects, mocapProjects, musicProjects, graphicProjects } from './content';

function generateProjects(
	array: {
		iframeSrc?: string;
		href?: string;
		imgSrc?: string;
		title?: string;
		year?: string;
		description?: string;
	}[],
	type: 'webdev' | 'mocap' | 'music' | 'graphics'
) {
	return array
		.map((project) => {
			if (type === 'mocap') {
				return project.iframeSrc
					? `
					<div class="item">
					<iframe style="aspect-ratio: 4 / 3; width: 100%; height: auto; border-radius: 1rem; border: solid 0.0625rem grey; box-sizing: border-box;" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen src="${project.iframeSrc}"></iframe>
					</div>
                `
					: `
                    <a href="${project.href}" target="_blank" class="item">
                        <img src="${project.imgSrc}" alt="${project.title}" loading="lazy" onerror="this.onerror=null; this.src='img/placeholder.png'">
                    </a>
                `;
			}

			if (type === 'music') {
				return `
					<div class="item">
					<iframe width="100%" scrolling="no" frameborder="yes" allow="autoplay" style="border-radius: 1rem;" src="${project.iframeSrc}"></iframe>
					<p><b>${project.title}</b> / ${project.year} / ${project.description}</p>
                    </div>
                `;
			}
			return `
			<a href="${project.href}" target="_blank" class="item">
				<img src="${project.imgSrc}" alt="${project.title}" loading="lazy" onerror="this.onerror=null; this.src='img/placeholder.png'">
				<p><b>${project.title}</b> / ${project.year} / ${project.description}</p>
			</a>
		`;
		})
		.join('');
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

function toggleFocus() {
	const focusIcon = document.querySelector('#focus-switch > i');

	focusIcon?.addEventListener('click', () => {
		focusIcon.classList.toggle('fa-solid');
		focusIcon.classList.toggle('fa-regular');

		const gridContainers = document.querySelectorAll('.grid-container');

		gridContainers.forEach((gridContainer) => {
			gridContainer.classList.toggle('focus');
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

document.addEventListener('DOMContentLoaded', () => {
	initTheme();

	const webDevContainer = document.querySelector('.grid-container.webdev');
	if (webDevContainer) {
		webDevContainer.innerHTML = generateProjects(webDevProjects, 'webdev');
	}

	watchTheme();
	document.querySelector('#theme-switch')?.addEventListener('click', toggleTheme);
	(document.querySelector('#wrapper') as HTMLElement).style.visibility = 'visible';
	document.querySelector('body').style.animation = 'fadeInAnimation ease 1s forwards';
	topBarScrollFixIOS();

	const sectionTitles = document.querySelectorAll('section h2');

	let mocapGenerated = false;
	let musicGenerated = false;
	let graphicsGenerated = false;

	sectionTitles.forEach((sectionTitle) => {
		sectionTitle.addEventListener('click', () => {
			sectionTitle.parentElement.classList.toggle('hidden');

			if (sectionTitle.parentElement.id === 'second' && !mocapGenerated) {
				document.querySelector('.grid-container.mocap').innerHTML = generateProjects(mocapProjects, 'mocap');
				mocapGenerated = true;
			}
			if (sectionTitle.parentElement.id === 'third' && !musicGenerated) {
				document.querySelector('.grid-container.music').innerHTML = generateProjects(musicProjects, 'music');
				musicGenerated = true;
			}
			if (sectionTitle.parentElement.id === 'fourth' && !graphicsGenerated) {
				document.querySelector('.grid-container.graphics').innerHTML = generateProjects(graphicProjects, 'graphics');
				graphicsGenerated = true;
			}
		});
	});

	document.querySelector('#heading h1').addEventListener('click', () => {
		window.location.reload();
	});

	toggleFocus();
});
