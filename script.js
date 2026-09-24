(function () {
  var WHATSAPP = '14087094522';
  var EMAIL = 'support@homeworkguy.live';
  var form = document.getElementById('quote-form');
  var statusEl = document.getElementById('form-status');

  if (!form) return;

  function showStatus(message, ok) {
    statusEl.hidden = false;
    statusEl.textContent = message;
    statusEl.className = 'form-status ' + (ok ? 'ok' : 'err');
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    var data = new FormData(form);
    var name = String(data.get('name') || '').trim();
    var email = String(data.get('email') || '').trim();
    var service = String(data.get('service') || '').trim();
    var subject = String(data.get('subject') || '').trim();
    var deadline = String(data.get('deadline') || '').trim();
    var details = String(data.get('details') || '').trim();

    if (!name || !email || !service || !subject || !details) {
      showStatus('Please fill in name, email, service, subject, and details.', false);
      return;
    }

    var lines = [
      'Hi, I would like a tutoring quote.',
      '',
      'Name: ' + name,
      'Email: ' + email,
      'Service: ' + service,
      'Subject: ' + subject,
      'Deadline: ' + (deadline || 'not set'),
      '',
      details
    ];
    var text = lines.join('\n');
    var wa = 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(text);

    window.open(wa, '_blank', 'noopener');
    showStatus('WhatsApp should open with your request. If it does not, email us at ' + EMAIL + '.', true);
  });
})();
