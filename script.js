(function () {
  var API = '/api/quote';

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

    var honeypot = String(data.get('company') || '').trim();
    var instructions = [
      '[PORTAL REQUEST]',
      'Plan: ' + service,
      'Subject/Course: ' + subject,
      'Deadline: ' + (deadline || 'not set'),
      'Details: ' + details
    ].join('\n');

    var button = form.querySelector('button[type="submit"]');
    if (button) button.disabled = true;
    showStatus('Sending…', true);

    fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        formData: {
          name: name,
          email: email,
          phone: 'Not provided',
          preferredContact: 'email',
          serviceType: 'portal',
          academicLevel: 'undergraduate',
          subject: subject,
          weekCount: 1,
          coursePlatform: 'Not specified',
          courseStartDate: 'Not specified',
          courseEndDate: 'Not specified',
          instructions: instructions,
          fileLinks: '',
          hasUploadedFiles: 'false',
          uploadSessionId: '',
          deadline: 'custom',
          deadlineDate: deadline || 'Not specified',
          deadlineTime: '',
          referralCode: 'None'
        },
        calculatorData: {
          serviceType: 'portal',
          academicLevel: 'undergraduate',
          subjects: [subject],
          subject: subject,
          numberOfPages: 1,
          weekCount: 1,
          deadline: 'custom',
          deadlineDate: deadline || '',
          deadlineTime: ''
        },
        totalPrice: 0,
        honeypot: honeypot
      })
    }).then(function (response) {
      return response.text().then(function (text) {
        var result = {};
        try { result = JSON.parse(text); } catch (e) { result = { success: response.ok }; }
        if (!response.ok || result.success === false) {
          throw new Error(result.error || 'Something went wrong. Please try again.');
        }
        form.reset();
        form.classList.add('is-sent');
        var success = document.getElementById('form-success');
        if (success) success.hidden = false;
        statusEl.hidden = true;
      });
    }).catch(function () {
      showStatus('We could not send that. Please try again, or email support@homeworkguy.org.', false);
    }).then(function () {
      if (button) button.disabled = false;
    });
  });
})();
