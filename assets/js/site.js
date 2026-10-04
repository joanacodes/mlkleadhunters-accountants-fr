/* mlkleadhunters — site behaviour. Everything works without it; this only polishes. */
(function () {
  'use strict';

  // Skip link: <main> takes focus only for the jump, so a later click inside it
  // does not reset the Tab order to the top of the page.
  var main = document.querySelector('main[id]');
  var skip = document.querySelector('.mk-skip');
  if (main && skip) {
    skip.addEventListener('click', function () {
      main.setAttribute('tabindex', '-1');
      main.addEventListener('blur', function () { main.removeAttribute('tabindex'); }, { once: true });
      main.focus();
    });
  }

  // Menu: close the panel after following an in-page link, on Escape, or when focus leaves it.
  document.querySelectorAll('.mk-menu').forEach(function (menu) {
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) menu.removeAttribute('open');
    });
    menu.addEventListener('focusout', function (e) {
      if (e.relatedTarget && !menu.contains(e.relatedTarget)) menu.removeAttribute('open');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.hasAttribute('open')) {
        menu.removeAttribute('open');
        menu.querySelector('summary').focus();
      }
    });
    document.addEventListener('click', function (e) {
      if (menu.hasAttribute('open') && !menu.contains(e.target)) menu.removeAttribute('open');
    });
  });

  // Contact form: compose the email in the visitor's mail app, as before.
  // Without JavaScript the form falls back to its mailto action.
  document.querySelectorAll('form[data-mailto]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      if (!form.checkValidity()) return;
      e.preventDefault();
      var lines = [];
      var org = '';
      form.querySelectorAll('[data-label]').forEach(function (field) {
        var value = field.value.trim();
        if (field.name === 'message') {
          lines.push('', value);
        } else {
          lines.push(field.getAttribute('data-label') + ' ' + value);
        }
        if (field.name === 'company' && value) org = value;
        if (field.name === 'name' && value && !org) org = value;
      });
      var subject = form.getAttribute('data-subject') + (org ? ' - ' + org : '');
      window.location.href = 'mailto:' + form.getAttribute('data-mailto') +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(lines.join('\r\n'));
    });
  });
})();
