const widths = [278, 384, 480, 556, 768, 960, 1088];

const sizes =
	'(max-width: 575px) calc(100vw - 6rem), (max-width: 671px) calc(100vw - 8rem), (max-width: 991px) calc((100vw - 14rem) / 2), (max-width: 1151px) calc((100vw - 20rem) / 3), calc((min(100vw, 2560px) - 26rem) / 4)';

function generateStaticProject(
	array: {
		iframeSrc?: string;
		hrefWebp?: string;
		href?: string;
		imgSrc?: string;
		title?: string;
		year?: string;
		description?: string;
	}[],
	type: 'webdev' | 'mocap' | 'music' | 'graphics'
) {
	return array
		.map((project, index) => {
			const isFirstItem = index === 0;
			const fetchPriorityAttr = isFirstItem ? 'fetchpriority="high"' : '';

			if (type === 'webdev' || (type === 'mocap' && !project.iframeSrc) || type === 'graphics') {
				const baseName = project.imgSrc.replace('.png', '').replace('.jpg', '').replace(`${type}/`, '');
				const imageExtension = type === 'mocap' ? 'jpg' : 'png';
				const srcsetWebP = widths.map((w) => `${type}/${baseName}-${w}.webp ${w}w`).join(', ');
				const srcsetImage = widths.map((w) => `${type}/${baseName}-${w}.${imageExtension} ${w}w`).join(', ');

				let textHTML = '';
				if (type !== 'mocap') {
					textHTML = `<div class="text"><p class="bold">${project.title}</p><p class="secondary">${project.description} | ${project.year}</p></div>`;
				}

				if (type === 'mocap' || type === 'graphics') {
					return `<div class="item-container-wrap"><div class="item-container" data-rendered="true"><div class="item"><div class="img-container"><picture><source srcset="${srcsetWebP}" sizes="${sizes}" type="image/webp"><source srcset="${srcsetImage}" sizes="${sizes}" type="image/${imageExtension}"><img src="${
						project.imgSrc
					}" alt="${project.title}" data-lightbox="${type}" data-full="${
						project.hrefWebp || project.href
					}" ${fetchPriorityAttr} onerror="this.onerror=null; this.src='img/placeholder.png'; this.fetchPriority='high'"></picture></div>${textHTML}</div></div></div>`;
				} else {
					return `<div class="item-container-wrap"><div class="item-container" data-rendered="true"><a href="${
						project.hrefWebp || project.href
					}" target="_blank" class="item"><div class="img-container"><picture><source srcset="${srcsetWebP}" sizes="${sizes}" type="image/webp"><source srcset="${srcsetImage}" sizes="${sizes}" type="image/${imageExtension}"><img src="${
						project.imgSrc
					}" alt="${
						project.title
					}" ${fetchPriorityAttr} onerror="this.onerror=null; this.src='img/placeholder.png'; this.fetchPriority='high'"></picture></div>${textHTML}</a></div></div>`;
				}
			}

			if (type === 'mocap' && project.iframeSrc) {
				return `<div class="item-container" data-rendered="true"><div class="item"><iframe style="aspect-ratio: 4 / 3; width: 100%; height: auto; border-radius: 1rem; box-sizing: border-box;" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen src="${project.iframeSrc}" ${fetchPriorityAttr}></iframe></div></div>`;
			}

			if (type === 'music') {
				return `<div class="item-container" data-rendered="true"><div class="item"><iframe width="100%" scrolling="no" frameborder="no" allow="autoplay" style="border-radius: 1rem;" title="SoundCloud music player" src="${project.iframeSrc}" ${fetchPriorityAttr}></iframe><div class="text"><p class="bold">${project.title}</p><p class="secondary">${project.description} | ${project.year}</p></div></div></div>`;
			}
		})
		.join('');
}

function generatePlaceholder(
	array: {
		iframeSrc?: string;
		hrefWebp?: string;
		href?: string;
		imgSrc?: string;
		title?: string;
		year?: string;
		description?: string;
	}[],
	type: 'webdev' | 'mocap' | 'music' | 'graphics'
) {
	return array
		.map((project, index) => {
			if (type === 'webdev' || (type === 'mocap' && !project.iframeSrc) || type === 'graphics') {
				let textHTML = '';
				if (type !== 'mocap') {
					// textHTML = `<div class="text"><p class="bold">&nbsp</p><p class="secondary">&nbsp</p></div>`;
					textHTML = `<div class="text"><p class="bold">${project.title}</p><p class="secondary">${project.description} | ${project.year}</p></div>`;
				}
				return `<div class="item-container-wrap"><div class="item-container" data-rendered="false" data-project='${JSON.stringify(
					project
				)}' data-type="${type}" data-index="${index}"><a class="item"><div class="img-container"></div>${textHTML}</a></div></div>`;
			}

			if (type === 'mocap' && project.iframeSrc) {
				return `<div class="item-container" data-rendered="false" data-project='${JSON.stringify(
					project
				)}' data-type="${type}" data-index="${index}"></div>`;
			}

			if (type === 'music') {
				return `<div class="item-container" data-rendered="false" data-project='${JSON.stringify(
					project
				)}' data-type="${type}" data-index="${index}"></div>`;
			}
		})
		.join('');
}

function renderProject(container: HTMLElement) {
	const project = JSON.parse(container.dataset.project!);
	// const index = parseInt(container.dataset.index!);
	const type = container.dataset.type!;

	// const isFirstItem = index === 0;
	// const loadingAttr = isFirstItem ? '' : 'loading="lazy"';
	const loadingAttr = 'loading="lazy"';

	if (type === 'webdev' || (type === 'mocap' && !project.iframeSrc) || type === 'graphics') {
		const baseName = project.imgSrc?.replace('.png', '').replace('.jpg', '').replace(`${type}/`, '');
		const imageExtension = type === 'mocap' ? 'jpg' : 'png';
		const srcsetWebP = widths.map((w) => `${type}/${baseName}-${w}.webp ${w}w`).join(', ');
		const srcsetImage = widths.map((w) => `${type}/${baseName}-${w}.${imageExtension} ${w}w`).join(', ');

		let textHTML = '';
		if (type !== 'mocap') {
			textHTML = `
			<div class="text">
				<p class="bold">${project.title}</p>
				<p class="secondary">${project.description} | ${project.year}</p>
			</div>
		`;
		}

		if (type === 'mocap' || type === 'graphics') {
			container.innerHTML = `
				<div class="item">
					<div class="img-container">
						<picture>
							<source srcset="${srcsetWebP}" sizes="${sizes}" type="image/webp">
							<source srcset="${srcsetImage}" sizes="${sizes}" type="image/${imageExtension}">
							<img src="${project.imgSrc}" alt="${project.title}" data-lightbox="${type}" data-full="${
				project.hrefWebp || project.href
			}" ${loadingAttr} onerror="this.onerror=null; this.src='img/placeholder.png'; this.fetchPriority='high'">
						</picture>
					</div>
					${textHTML}
				</div>
			`;
		} else {
			container.innerHTML = `
				<a href="${project.hrefWebp || project.href}" target="_blank" class="item">
					<div class="img-container">
						<picture>
							<source srcset="${srcsetWebP}" sizes="${sizes}" type="image/webp">
							<source srcset="${srcsetImage}" sizes="${sizes}" type="image/${imageExtension}">
							<img src="${project.imgSrc}" alt="${project.title}" ${loadingAttr} onerror="this.onerror=null; this.src='img/placeholder.png'; this.fetchPriority='high'">
						</picture>
					</div>
					${textHTML}
				</a>
			`;
		}
		return;
	}

	if (type === 'mocap' && project.iframeSrc) {
		container.innerHTML = `
			<div class="item">
				<iframe ${loadingAttr} style="aspect-ratio: 4 / 3; width: 100%; height: auto; border-radius: 1rem;  box-sizing: border-box;" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen src="${project.iframeSrc}"></iframe>
			</div>
		`;
		return;
	}

	if (type === 'music') {
		container.innerHTML = `
			<div class="item">
				<iframe ${loadingAttr} width="100%" scrolling="no" frameborder="no" allow="autoplay" style="border-radius: 1rem;" title="SoundCloud music player" src="${project.iframeSrc}"></iframe>
				<div class="text">
					<p class="bold">${project.title}</p>
					<p class="secondary"> ${project.description} | ${project.year}</p>
				</div>
			</div>
		`;
		return;
	}
}

export { widths, generateStaticProject, generatePlaceholder, renderProject };
