const widths = [278, 384, 480, 556, 768, 960, 1088];

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
		.map((project, index) => {
			const isFirstItem = index === 0;
			const fetchPriorityAttr = isFirstItem ? 'fetchpriority="high"' : '';
			const loadingAttr = isFirstItem ? '' : 'loading="lazy"';

			if (type === 'mocap') {
				return project.iframeSrc
					? `
                    <div class="item-container">
                        <div class="item">
                            <iframe style="aspect-ratio: 4 / 3; width: 100%; height: auto; border-radius: 1rem;  box-sizing: border-box;" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen src="${project.iframeSrc}" ${fetchPriorityAttr}></iframe>
                        </div>
                    </div>
                    `
					: `
					<div class="item-container-wrap">
                    <div class="item-container">
                        <a href="${project.href}" target="_blank" class="item">
                            <div class="img-container">
							<img src="${project.imgSrc}" alt="${project.title}" ${loadingAttr} ${fetchPriorityAttr} onerror="this.onerror=null; this.src='img/placeholder.png'; this.fetchPriority='high'">
							</div>
                        </a>
                    </div>
					</div>
                    `;
			}

			if (type === 'music') {
				return `
                <div class="item-container">
                    <div class="item">
                        <iframe width="100%" scrolling="no" frameborder="no" allow="autoplay" style="border-radius: 1rem;" title="SoundCloud music player" src="${project.iframeSrc}" ${fetchPriorityAttr}></iframe>
                        <div class="text">
                            <p class="bold">${project.title}</p>
                            <p class="secondary"> ${project.description} | ${project.year}</p>
                        </div>
                    </div>
                </div>
                `;
			}

			if (type === 'webdev') {
				const baseName = project.imgSrc?.replace('.png', '').replace('webdev/', '');
				const srcsetWebP = widths.map((w) => `webdev/${baseName}-${w}.webp ${w}w`).join(', ');
				const srcsetPNG = widths.map((w) => `webdev/${baseName}-${w}.png ${w}w`).join(', ');

				const sizes =
					'(max-width: 575px) calc(100vw - 6rem), (max-width: 671px) calc(100vw - 8rem), (max-width: 991px) calc((100vw - 14rem) / 2), (max-width: 1151px) calc((100vw - 20rem) / 3), calc((min(100vw, 2560px) - 26rem) / 4)';

				return `
				<div class="item-container-wrap">
					<div class="item-container">
						<a href="${project.href}" target="_blank" class="item">
							<div class="img-container">
							
								<picture>
								
									<source srcset="${srcsetWebP}" sizes="${sizes}" type="image/webp">
									<source srcset="${srcsetPNG}" sizes="${sizes}" type="image/png">

									<img src="${project.imgSrc}" alt="${project.title}" ${loadingAttr} ${fetchPriorityAttr} onerror="this.onerror=null; this.src='img/placeholder.png'; this.fetchPriority='high'">
									
								</picture>

							</div>
							<div class="text">
								<p class="bold">${project.title}</p>
								<p class="secondary"> ${project.description} | ${project.year}</p>
							</div>
						</a>
					</div>
				</div>`;
			}
		})
		.join('');
}

export { widths, generateProjects };
