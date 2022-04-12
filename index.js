/**
 * @typedef {object} APOD
 * @property {string} copyright
 * @property {string} date
 * @property {string} explanation
 * @property {?string} hdurl
 * @property {'image' | 'video'} media_type
 * @property {string} service_version
 * @property {string} title
 * @property {string} url
 * @property {?object} resource
 * @property {?number} code
 * @property {?string} msg
 * @property {?object} error
 * @property {?string} error.code
 * @property {?string} error.message
 */


/**
 * @param {Date} date
 */
const dateToYYYYMMDD = date => `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
const YYYMMDDtoDate = yyyymmdd => {
	const [year, month, day] = yyyymmdd.split('-').map(Number);
	return new Date(year, month - 1, day);
}


const figure = document.querySelector('figure');

/**
 * @param {object} params
 * @param {?string} params.date
 * @param {?number} params.count
 * @param {?string} params.start_date
 * @param {?string} params.end_date
 * @param {?boolean} params.thumbs
 * @returns {Promise<APOD>}
 */
function fetchAstronomyPictureoftheDay(params) {
	const url = new URL('https://api.nasa.gov/planetary/apod');
	url.searchParams.set('api_key', API_KEY);
	for (const key in params) url.searchParams.set(key, params[key]);

	return fetch(url).then(response => response.json()).then(apod => {
		if (apod.code) throw new Error(apod.msg)
		if (apod.error) throw new Error(`${apod.error.code} - ${apod.error.message}`)
		return apod;
	});
}

/**
 * @param {Date} date
 */
const generateLocalStorageKey = date => `apod-${dateToYYYYMMDD(date)}`

/**
 * @param {Date} date
 * @returns {Promise<APOD>}
 */
function getPictureOfDate(date) {
	const key = generateLocalStorageKey(date);
	const value = localStorage.getItem(key);
	if (value) return Promise.resolve(JSON.parse(value));

	return fetchAstronomyPictureoftheDay({ date: dateToYYYYMMDD(date) }).then(apod => {
		localStorage.setItem(key, JSON.stringify(apod));
		return apod;
	});
}

/**
 * @param {APOD} apod
 */
function renderAPOD(apod) {
	let content = figure.querySelector('#content');
	if (apod.media_type === 'image') {
		let newNode = document.createElement('img')
		content.replaceWith(newNode)
		content = newNode;
		content.title = content.alt = apod.title;
		content.src = apod.url;
	} else {
		let newNode = document.createElement('object')
		newNode.data = apod.url;
		content.replaceWith(newNode)
		content = newNode;
		content.removeAttribute('title');
		content.removeAttribute('alt');
		setTimeout(() => {
			if (newNode.offsetHeight) return;

			let anchor = document.createElement('a')
			anchor.href = apod.url;
			anchor.textContent = 'Click to View'
			anchor.target = '_blank';
			anchor.id = 'content';
			content.replaceWith(anchor);
		}, 1000);
	}
	content.id = 'content';
	figure.querySelector('figcaption').textContent = apod.title;
	figure.querySelector('p').textContent = apod.explanation;
}

const dateInput = document.querySelector('[type="date"]');
const today = dateToYYYYMMDD(new Date())
dateInput.value = today;
const adjustDay = change => {
	const date = YYYMMDDtoDate(dateInput.value);
	date.setDate(date.getDate() + change);
	dateInput.value = dateToYYYYMMDD(date);
	getPictureOfDate(date).then(renderAPOD).catch(err => alert(err.message))
}
document.querySelectorAll('fieldset div button').forEach((button, i) => button.addEventListener('click', () => adjustDay(i === 0 ? -1 : 1)));

dateInput.addEventListener('change', () => getPictureOfDate(YYYMMDDtoDate(dateInput.value)).then(renderAPOD).catch(err => alert(err.message)));

const fetchRandomAPOD = () => fetchAstronomyPictureoftheDay({ count: 1 }).then(([apod]) => {
	localStorage.setItem(generateLocalStorageKey(new Date(apod.date)), JSON.stringify(apod));
	renderAPOD(apod);
	dateInput.value = dateToYYYYMMDD(new Date(apod.date));
}).catch(err => alert(err.message))

document.querySelector('fieldset > button').addEventListener('click', fetchRandomAPOD);

(() => {
	const details = document.querySelector('details');
	const summary = details.querySelector('summary');

	const closeDetailsButton = document.querySelector('legend button');
	closeDetailsButton.addEventListener('click', () => details.open = false);

	details.addEventListener('toggle', () => (details.open ? closeDetailsButton : summary).focus());
})();


getPictureOfDate(new Date()).then(renderAPOD).catch(err => alert(err.message));

window.addEventListener('keydown', ({ key, target: { tagName } }) => {
	if (tagName === 'INPUT') return;
	if (key === 'ArrowLeft') adjustDay(-1)
	else if (key === 'ArrowRight') adjustDay(1)
	else if (key === 'r') fetchRandomAPOD();
})