// Small wrapper around the PHP endpoints in /api.
async function post(path, payload) {
  let res;
  try {
    res = await fetch(`/api/${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error('We could not reach the server. Please check your connection and try again.');
  }
  let data = null;
  try {
    data = await res.json();
  } catch {
    /* non-JSON response */
  }
  if (!res.ok || !data?.ok) {
    const err = new Error(data?.message || 'Something went wrong. Please try again in a moment.');
    err.fields = data?.errors || {};
    throw err;
  }
  return data;
}

export const sendContact = (payload) => post('contact.php', payload);
export const subscribe = (payload) => post('subscribe.php', payload);
