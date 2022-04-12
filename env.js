const API_KEY = (() => {
	const localAPIKey = localStorage.getItem('apod-api');
	if (localAPIKey) return localAPIKey;

	const key = prompt('Enter NASA API Key for full un-rate-limited acces', 'DEMO_KEY') || 'DEMO_KEY';
	if (key !== 'DEMO_KEY' && confirm('Save this NASA API Key to localStorage for continued used?')) {
		localStorage.setItem('apod-api', key);
	}
	return key;
})();

