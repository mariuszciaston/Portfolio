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
                    <div class="item-container">
                        <div class="item">
                            <iframe style="aspect-ratio: 4 / 3; width: 100%; height: auto; border-radius: 1rem;  box-sizing: border-box;" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" |referrerpolicy="strict-origin-when-cross-origin" allowfullscreen src="${project.iframeSrc}"></iframe>
                        </div>
                    </div>
                    `
					: `
                    <div class="item-container">
                        <a href="${project.href}" target="_blank" class="item">
                            <img src="${project.imgSrc}" alt="${project.title}" loading="lazy" onerror="this.onerror=null; this.src='img/placeholder.png'">
                        </a>
                    </div>
                    `;
			}

			if (type === 'music') {
				return `
                <div class="item-container">
                    <div class="item">
                        <iframe width="100%" scrolling="no" frameborder="no" allow="autoplay" style="border-radius: 1rem;" src="${project.iframeSrc}"></iframe>
                        <div class="text">
                            <p class="bold">${project.title}</p>
                            <p class="secondary"> ${project.description} | ${project.year}</p>
                        </div>
                    </div>
                </div>
                `;
			}
			return `
            <div class="item-container">
                <a href="${project.href}" target="_blank" class="item">
                    <img src="${project.imgSrc}" alt="${project.title}" loading="lazy" onerror="this.onerror=null; this.src='img/placeholder.png'">
                    <div class="text">
                        <p class="bold">${project.title}</p>
                        <p class="secondary"> ${project.description} | ${project.year}</p>
                    </div>
                </a>
            </div>`;
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

			item.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
		});

		container.addEventListener('mouseleave', () => {
			item.classList.add('leaving');
			item.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';

			setTimeout(() => {
				item.classList.remove('leaving');
			}, 1000);
		});
	});
}

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

			setTimeout(apply3DEffect, 100);
		});
	});

	document.querySelector('#heading h1').addEventListener('click', () => {
		window.location.reload();
	});

	toggleFocus();
	apply3DEffect();
});
