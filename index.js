const weatherApi = 'https://api.weather.gov/alerts/active?area=';

if (!document.weatherAlertsListenerAdded) {
  document.weatherAlertsListenerAdded = true;
  document.addEventListener('click', async (event) => {
    if (event.target.id !== 'fetch-alerts') return;

    const input = document.querySelector('#state-input');
    const display = document.querySelector('#alerts-display');
    const errorBox = document.querySelector('#error-message');
    const state = input.value.trim().toUpperCase();
    input.value = '';
    display.replaceChildren();
    errorBox.textContent = '';
    errorBox.classList.add('hidden');

    try {
      if (!/^[A-Z]{2}$/.test(state)) {
        throw new Error('Enter a two-letter state abbreviation.');
      }

      const response = await fetch(`${weatherApi}${state}`);
      if (!response.ok) throw new Error(`Request failed (${response.status}).`);

      const data = await response.json();
      const alerts = data.features || [];
      display.append(document.createTextNode(`${data.title}: ${alerts.length}`));
      alerts.forEach((alert) => {
        const item = document.createElement('li');
        item.textContent = alert.properties?.headline || 'Alert headline unavailable';
        display.append(item);
      });
    } catch (error) {
      errorBox.textContent = error.message;
      errorBox.classList.remove('hidden');
    }
  });
}
