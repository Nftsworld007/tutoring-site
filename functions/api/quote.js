export async function onRequestPost({ request }) {
  let payload;
  try {
    payload = await request.json();
  } catch (error) {
    return Response.json({ success: false, error: 'Invalid request' }, { status: 400 });
  }

  if (!payload || !payload.formData || !payload.formData.email) {
    return Response.json({ success: false, error: 'Missing email' }, { status: 400 });
  }

  // The live mail server already sends a "we'll contact you" note for quote requests.
  payload.formData.serviceType = 'homework';
  if (payload.calculatorData) payload.calculatorData.serviceType = 'homework';

  const upstream = await fetch('https://homework-guy-email-server.onrender.com/api/send-email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const text = await upstream.text();
  return new Response(text, {
    status: upstream.status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
  });
}
