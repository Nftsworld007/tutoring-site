(function () {
  var WHATSAPP = '14087094522';
  var EMAIL = 'support@homeworkguy.live';

  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  var form = document.getElementById('quote-form');
  var statusEl = document.getElementById('form-status');
  if (!form || !statusEl) return;

  document.querySelectorAll('[data-plan]').forEach(function (button) {
    button.addEventListener('click', function () {
      var select = form.querySelector('[name="service"]');
      var plan = button.getAttribute('data-plan');
      if (!select || !plan) return;
      var options = Array.prototype.slice.call(select.options);
      var match = options.find(function (option) {
        return option.value === plan || option.text === plan;
      });
      if (match) select.value = match.value;
    });
  });

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
    var agree = data.get('agree');

    if (!name || !email || !service || !subject || !details) {
      showStatus('Please fill in name, email, plan, subject, and details.', false);
      return;
    }
    if (!agree) {
      showStatus('Please agree to the Terms, Refund Policy, and Privacy Policy.', false);
      return;
    }

    var lines = [
      'Hi, I would like HomeworkGuy access. I understand payment is on the website through Paddle, not in this chat.',
      '',
      'Name: ' + name,
      'Email: ' + email,
      'Plan: ' + service,
      'Subject: ' + subject,
      'Deadline: ' + (deadline || 'not set'),
      '',
      details
    ];
    var text = lines.join('\n');
    var wa = 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(text);

    window.open(wa, '_blank', 'noopener');
    showStatus('WhatsApp should open with your plan filled in. If it does not, email ' + EMAIL + '. Do not send card details.', true);
  });
})();
