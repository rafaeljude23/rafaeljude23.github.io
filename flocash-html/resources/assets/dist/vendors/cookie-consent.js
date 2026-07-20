/**
 * cookie-consent.js — lightweight cookie consent banner (no dependencies)
 *
 * USAGE
 * -----
 * 1. Drop this file next to your other static assets (e.g. /js/cookie-consent.js).
 * 2. Add ONE line before </body> in your shared footer.html (so it's on every page
 *    via your sync script):
 *
 *      <script src="/js/cookie-consent.js" defer></script>
 *
 * 3. (Optional) Link to a full cookie policy page — set COOKIE_POLICY_URL below.
 *
 * 4. To gate other scripts (e.g. Google Analytics) behind consent, wrap them:
 *
 *      window.addEventListener('cookieConsentGiven', function (e) {
 *        if (e.detail.status === 'accepted') {
 *          // load analytics / marketing scripts here
 *        }
 *      });
 *
 *    Or check at any time: CookieConsent.getStatus() -> 'accepted' | 'rejected' | null
 */
(function () {
  var COOKIE_NAME = 'cookie_consent';
  var COOKIE_POLICY_URL = 'cookie.html'; // change to your policy page
  var COOKIE_MAX_AGE_DAYS = 180;

  function setCookie(name, value, days) {
    var expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie =
      name + '=' + encodeURIComponent(value) +
      ';expires=' + expires.toUTCString() +
      ';path=/;SameSite=Lax';
  }

  function getCookie(name) {
    var match = document.cookie.match(
      new RegExp('(^| )' + name + '=([^;]+)')
    );
    return match ? decodeURIComponent(match[2]) : null;
  }

  function fireEvent(status) {
    window.dispatchEvent(
      new CustomEvent('cookieConsentGiven', { detail: { status: status } })
    );
  }

  function injectStyles() {
    var css = [
      '#cc-banner{position:fixed;left:0;right:0;bottom:0;z-index:9999;',
      'background:#1f2430;color:#f2f2f2;padding:16px 20px;',
      'font:14px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;',
      'display:flex;flex-wrap:wrap;align-items:center;gap:16px;',
      'box-shadow:0 -2px 10px rgba(0,0,0,.15)}',
      '#cc-banner p{margin:0;flex:1 1 260px}',
      '#cc-banner a{color:#8ab4ff;text-decoration:underline}',
      '#cc-actions{display:flex;gap:10px;flex:0 0 auto}',
      '#cc-actions button{cursor:pointer;border:0;border-radius:6px;',
      'padding:9px 16px;font-size:14px;font-weight:600}',
      '#cc-accept{background:#4f8cff;color:#fff}',
      '#cc-reject{background:transparent;color:#f2f2f2;border:1px solid #565d6e !important}'
    ].join('');
    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  }

  function showBanner() {
    injectStyles();
    var banner = document.createElement('div');
    banner.id = 'cc-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Cookie consent');
    banner.innerHTML =
      '<p>We use cookies to improve your experience and analyze site traffic. ' +
      'Read our <a href="' + COOKIE_POLICY_URL + '">Cookie Policy</a>.</p>' +
      '<div id="cc-actions">' +
      '<button id="cc-reject" type="button">Reject</button>' +
      '<button id="cc-accept" type="button">Accept</button>' +
      '</div>';
    document.body.appendChild(banner);

    document.getElementById('cc-accept').addEventListener('click', function () {
      setCookie(COOKIE_NAME, 'accepted', COOKIE_MAX_AGE_DAYS);
      banner.remove();
      fireEvent('accepted');
    });
    document.getElementById('cc-reject').addEventListener('click', function () {
      setCookie(COOKIE_NAME, 'rejected', COOKIE_MAX_AGE_DAYS);
      banner.remove();
      fireEvent('rejected');
    });
  }

  function init() {
    var existing = getCookie(COOKIE_NAME);
    if (!existing) {
      showBanner();
    } else {
      fireEvent(existing);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Public API
  window.CookieConsent = {
    getStatus: function () {
      return getCookie(COOKIE_NAME);
    },
    reset: function () {
      setCookie(COOKIE_NAME, '', -1);
    }
  };
})();
