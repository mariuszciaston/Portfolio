const webDevProjects = [
	{
		href: 'https://mariuszciaston.github.io/Battleship/',
		imgSrc: 'images/Battleship.png',
		title: 'Battleship',
		year: '2024',
		description: 'gra w statki',
	},
	{
		href: 'https://mariuszciaston.github.io/minimaLIST/',
		imgSrc: 'images/minimaList.png',
		title: 'minimaLIST',
		year: '2023',
		description: 'aplikacja typu lista zadań',
	},

	{
		href: 'https://mariuszciaston.github.io/Weather-App/',
		imgSrc: 'images/Weather-App.png',
		title: 'Weather App',
		year: '2023',
		description: 'aplikacja pogodowa',
	},
	{
		href: 'https://mariuszciaston.github.io/Tic-Tac-Toe/',
		imgSrc: 'images/Tic-Tac-Toe.png',
		title: 'Tic Tac Toe',
		year: '2023',
		description: 'gra kółko i krzyżyk',
	},
	{
		href: 'https://mariuszciaston.github.io/Sign-Up_Form/',
		imgSrc: 'images/Sign-Up_Form.png',
		title: 'Sign-Up Form',
		year: '2023',
		description: 'prototyp formularza rejestracyjnego',
	},
	{
		href: 'https://mariuszciaston.github.io/Admin-Dashboard/',
		imgSrc: 'images/Admin-Dashboard.png',
		title: 'Admin Dashboard',
		year: '2023',
		description: 'prototyp panelu administracyjnego',
	},

	{
		href: 'https://mariuszciaston.github.io/Library/',
		imgSrc: 'images/Library.png',
		title: 'Library',
		year: '2022',
		description: 'aplikacja do zapisywania książek',
	},

	{
		href: 'https://mariuszciaston.github.io/Etch-A-Sketch/',
		imgSrc: 'images/Etch-A-Sketch.png',
		title: 'Etch-A-Sketch',
		year: '2022',
		description: 'aplikacja do rysowania',
	},

	{
		href: 'https://mariuszciaston.github.io/Calculator/',
		imgSrc: 'images/Calculator.png',
		title: 'Calculator',
		year: '2022',
		description: 'aplikacja kalkulator',
	},

	{
		href: 'https://mariuszciaston.github.io/Rock-Paper-Scissors/',
		imgSrc: 'images/Rock-Paper-Scissors.png',
		title: 'Rock Paper Scissors',
		year: '2022',
		description: 'gra papier, kamień, nożyce',
	},
	{
		href: 'https://sdn.org.pl/',
		imgSrc: 'images/Sdn.org.pl.png',
		title: 'Sdn.org.pl',
		year: '2022',
		description: 'strona Stowarzyszenia Dobrej Nadziei',
	},
	{
		href: 'https://film.asp.krakow.pl/',
		imgSrc: 'Film.asp.krakow.pl.png',
		title: 'Film.asp.krakow.pl',
		year: '2020',
		description: 'strona Pracowni Filmu Animowanego ASP Kraków',
	},
];

const musicProjects = [
	{
		href: 'xxxxx',
		imgSrc: 'images/xxxxx.png',
		title: 'Strasznie',
		year: '2016',
		description: 'eksperymentalny utwór elektroniczny',
	},
	{
		href: 'xxxxx',
		imgSrc: 'images/xxxxx.png',
		title: 'Nightmare',
		year: '2012',
		description: 'Dark dubstep',
	},
	{
		href: 'xxxxx',
		imgSrc: 'images/xxxxx.png',
		title: 'You Like It Remix',
		year: '2008',
		description: 'Electro house',
	},
	{
		href: 'xxxxx',
		imgSrc: 'images/xxxxx.png',
		title: 'Friday Night',
		year: '2006',
		description: 'Tribal techno',
	},
	{
		href: 'xxxxx',
		imgSrc: 'images/xxxxx.png',
		title: 'Fight',
		year: '2006',
		description: 'Hard techno',
	},
];

const graphicProjects = [
	{
		href: 'xxxxx',
		imgSrc: 'images/xxxxx.png',
		title: 'xxxxx',
		year: 'xxxxx',
		description: 'xxxxx',
	},
	{
		href: 'xxxxx',
		imgSrc: 'images/xxxxx.png',
		title: 'xxxxx',
		year: 'xxxxx',
		description: 'xxxxx',
	},
	{
		href: 'xxxxx',
		imgSrc: 'images/xxxxx.png',
		title: 'xxxxx',
		year: 'xxxxx',
		description: 'xxxxx',
	},
	{
		href: 'xxxxx',
		imgSrc: 'images/xxxxx.png',
		title: 'xxxxx',
		year: 'xxxxx',
		description: 'xxxxx',
	},
];

function generateProjects(array) {
	return array
		.map(
			(project) => `
        <a href="${project.href}" target="_blank" class="item">
            <img src="${project.imgSrc}" alt="${project.title}" onerror="this.onerror=null; this.src='images/placeholder.png'">
            <p><b>${project.title}</b> / ${project.year} / ${project.description}</p>
        </a>
    `
		)
		.join('');
}

function saveTheme(themeName) {
	localStorage.setItem('theme', themeName);
	document.documentElement.className = themeName;
}

function toggleTheme() {
	if (localStorage.getItem('theme') === 'theme-dark') {
		saveTheme('theme-light');
		document.querySelector('#theme-switch > i').classList.remove('fa-sun');
		document.querySelector('#theme-switch > i').classList.add('fa-moon');
	} else {
		saveTheme('theme-dark');
		document.querySelector('#theme-switch > i').classList.remove('fa-moon');
		document.querySelector('#theme-switch > i').classList.add('fa-sun');
	}
}

function loadTheme() {
	if (localStorage.getItem('theme') === 'theme-dark') {
		saveTheme('theme-dark');
	} else {
		saveTheme('theme-light');
	}
}

document.addEventListener('DOMContentLoaded', () => {
	document.querySelector('.grid-container.web').innerHTML = generateProjects(webDevProjects);
	document.querySelector('.grid-container.music').innerHTML = generateProjects(musicProjects);
	document.querySelector('.grid-container.graphic').innerHTML = generateProjects(graphicProjects);

	loadTheme();

	document.querySelector('#theme-switch').addEventListener('click', toggleTheme);
	document.querySelector('#wrapper').style.visibility = 'visible';
	document.querySelector('body').style.animation = 'fadeInAnimation ease 1s forwards';
});
