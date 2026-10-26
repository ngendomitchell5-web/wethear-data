const form = document.querySelector('#search-form');
const stateInput = document.querySelector('#state');
const message = document.querySelector('#message');
const alertsList = document.querySelector('#alerts');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const state = stateInput.value.trim().toUpperCase();
  message.textContent = 'Loading alerts…';
  alertsList.replaceChildren();

  try {
    const response = await fetch(`https://api.weather.gov/alerts/active?area=${encodeURIComponent(state)}`, {
      headers: { Accept: 'application/geo+json' }
    });
    if (!response.ok) throw new Error('The alert request failed. Try again.');
    const data = await response.json();
    const alerts = data.features || [];

    if (alerts.length === 0) {
      message.textContent = `No active alerts found for ${state}.`;
      return;
    }

    message.textContent = `${alerts.length} active alert(s) for ${state}:`;
    alerts.forEach((alert) => {
      const item = document.createElement('li');
      item.textContent = alert.properties.headline || alert.properties.event;
      alertsList.append(item);
    });
  } catch (error) {
    message.textContent = error.message || 'Network error. Check your connection.';
  }
});
