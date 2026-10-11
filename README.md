document.getElementById('form').addEventListener('submit', async e => {
  e.preventDefault();

  const text = input.value.trim();
  if (!text) return;

  add(text, 'user');
  input.value = '';

  const pending = add('VEER AI जवाब सोच रहा है…', 'bot');

  try {
    const response = await fetch(
      'https://veer-ai-assistant.vickyjaryal006.workers.dev',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'AI request failed');
    }

    pending.textContent = data.reply || data.response || 'जवाब नहीं मिला।';
  } catch (error) {
    pending.textContent =
      'AI से कनेक्शन नहीं हुआ। Worker और AI binding की जाँच करो।';
  }
});
