/**
 * country-select.js
 * Populates <select id="country"> on the Developer page using countries.dev —
 * a free, keyless country data API.
 *
 * Note: restcountries.com's old v3.1 endpoint (used in an earlier version of
 * this file) was deprecated; its replacement (v5) requires a paid/API-key
 * account. countries.dev requires no key and no signup.
 *
 * Docs: https://countries.dev/docs/api/countries
 */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    const select = document.getElementById("country");
    if (!select) return;

    fetch("https://countries.dev/countries?fields=name")
      .then(function (res) {
        if (!res.ok) throw new Error("Failed to load country list");
        return res.json();
      })
      .then(function (countries) {
        const names = countries
          .map(function (c) {
            return c.name;
          })
          .filter(Boolean)
          .sort(function (a, b) {
            return a.localeCompare(b);
          });

        names.forEach(function (name) {
          const option = document.createElement("option");
          option.value = name;
          option.textContent = name;
          select.appendChild(option);
        });

        select.disabled = false;
      })
      .catch(function (err) {
        console.error(err);
        // Fail gracefully: leave a manual text option so the form still works.
        select.innerHTML = '<option value="" selected disabled>Unable to load countries — please refresh</option>';
      });
  });
})();
