/**
 * forms.js
 * Shared, dependency-free logic for:
 *   - Bootstrap 5 client-side validation
 *   - Invisible anti-spam (honeypot + time-trap, no user interaction/captcha)
 *   - AJAX submit to Web3Forms (no page reload, no backend of your own)
 *   - Bootstrap 5 modal on success
 *
 * Works for the Contact form(s), Newsletter form, and Developer form.
 * Attach to any <form> that has the class "ajax-form".
 *
 * Get a free Web3Forms access key (instant, no account) at:
 *   https://web3forms.com
 *
 * Required markup per form (see the HTML files for full examples):
 *   <form class="needs-validation ajax-form" novalidate
 *         data-access-key="YOUR-WEB3FORMS-ACCESS-KEY"
 *         data-form-type="contact|newsletter|developer"
 *         data-subject="Solutions"                 (optional, contact page only)
 *         data-success-modal="#formSuccessModal">   (defaults to #formSuccessModal)
 *
 *     ... real fields ...
 *
 *     <!-- honeypot: real users never see or fill this -->
 *     <div class="hp-field" aria-hidden="true">
 *       <label for="website">Leave this field empty</label>
 *       <input type="text" id="website" name="website" tabindex="-1" autocomplete="off">
 *     </div>
 *
 *     <!-- time-trap: filled by JS on page load, checked on submit -->
 *     <input type="hidden" name="form_timestamp" class="form-timestamp" value="">
 *
 *     <button type="submit">Send</button>
 *   </form>
 */

(function () {
  "use strict";

  // Default minimum seconds a human is assumed to need before a form is
  // "genuinely" submitted. Submissions faster than this (typical of headless
  // bots) are quietly dropped. Override per-form with data-min-seconds, since
  // a 1-field newsletter form is legitimately filled much faster than a
  // 5-field contact form — the same threshold for both causes false positives
  // on the simple form.
  const DEFAULT_MIN_SECONDS_BEFORE_SUBMIT = 3;

  document.addEventListener("DOMContentLoaded", function () {
    const forms = document.querySelectorAll("form.ajax-form");

    forms.forEach(function (form) {
      // 1) Stamp the time-trap field the moment the page/form is ready.
      const timeField = form.querySelector(".form-timestamp");
      if (timeField) {
        timeField.value = Date.now().toString();
      }

      // 2) Intercept submit for Bootstrap validation + anti-spam + AJAX send.
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        event.stopPropagation();

        // --- Bootstrap 5 native validation ---
        if (!form.checkValidity()) {
          form.classList.add("was-validated");
          // Focus the first invalid field for accessibility.
          const firstInvalid = form.querySelector(":invalid");
          if (firstInvalid) firstInvalid.focus();
          return;
        }
        form.classList.add("was-validated");

        // --- Anti-spam checks (no user interaction required) ---
        const honeypot = form.querySelector('input[name="website"]');
        const isHoneypotFilled = honeypot && honeypot.value.trim() !== "";

        const minSeconds = form.dataset.minSeconds
          ? parseFloat(form.dataset.minSeconds)
          : DEFAULT_MIN_SECONDS_BEFORE_SUBMIT;
        const startTime = timeField ? parseInt(timeField.value, 10) : 0;
        const secondsElapsed = (Date.now() - startTime) / 1000;
        const isTooFast = !startTime || secondsElapsed < minSeconds;

        if (isHoneypotFilled || isTooFast) {
          // Likely a bot. Pretend everything worked (so bots don't learn to
          // adapt) but never actually send the email.
          console.warn("Submission blocked by spam filter", {
            isHoneypotFilled,
            secondsElapsed,
          });
          showSuccessModal(form);
          resetForm(form);
          return;
        }

        // --- Real submission ---
        submitForm(form);
      });
    });
  });

  function setLoading(form, isLoading) {
    const submitBtn = form.querySelector('button[type="submit"]');
    if (!submitBtn) return;
    submitBtn.disabled = isLoading;
    submitBtn.dataset.originalText =
      submitBtn.dataset.originalText || submitBtn.innerHTML;
    submitBtn.innerHTML = isLoading
      ? '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Sending&hellip;'
      : submitBtn.dataset.originalText;
  }

  function showErrorAlert(form, message) {
    let alertBox = form.querySelector(".ajax-form-error");
    if (!alertBox) {
      alertBox = document.createElement("div");
      alertBox.className = "alert alert-danger ajax-form-error mt-3";
      alertBox.setAttribute("role", "alert");
      form.appendChild(alertBox);
    }
    alertBox.textContent =
      message || "Something went wrong. Please try again in a moment.";
    alertBox.classList.remove("d-none");
  }

  function clearErrorAlert(form) {
    const alertBox = form.querySelector(".ajax-form-error");
    if (alertBox) alertBox.classList.add("d-none");
  }

  function resetForm(form) {
    form.reset();
    form.classList.remove("was-validated");
    const timeField = form.querySelector(".form-timestamp");
    if (timeField) timeField.value = Date.now().toString();
  }

  function showSuccessModal(form) {
    const modalSelector = form.dataset.successModal || "#formSuccessModal";
    const modalEl = document.querySelector(modalSelector);
    if (modalEl && window.bootstrap) {
      const modal =
        bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
      modal.show();
    }
  }

  // Web3Forms endpoint — same for every form, no backend of your own needed.
  const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

  function submitForm(form) {
    clearErrorAlert(form);
    setLoading(form, true);

    const formData = new FormData(form);

    // Web3Forms-specific fields. access_key must come from a
    // data-access-key="..." attribute on each <form> (get one free,
    // instantly, at https://web3forms.com — no account needed).
    if (form.dataset.accessKey) {
      formData.set("access_key", form.dataset.accessKey);
    }

    // Controls the email Subject line Web3Forms sends.
    if (form.dataset.subject) {
      formData.set("subject", form.dataset.subject);
    } else if (form.dataset.formType) {
      formData.set("subject", "New submission: " + form.dataset.formType);
    }

    // Controls the "From" display name shown in the notification email.
    if (form.dataset.formType) {
      formData.set("from_name", form.dataset.formType + " form");
    }

    // Not needed by Web3Forms — our own honeypot/time-trap already blocked
    // bots before we ever get here, so this field can be dropped.
    formData.delete("min_seconds");

    fetch(WEB3FORMS_ENDPOINT, {
      method: "POST",
      body: formData,
      headers: { Accept: "application/json" },
    })
      .then(function (response) {
        return response
          .json()
          .catch(function () {
            throw new Error("Unexpected server response.");
          })
          .then(function (data) {
            return { ok: response.ok, data: data };
          });
      })
      .then(function (result) {
        if (result.ok && result.data && result.data.success) {
          showSuccessModal(form);
          resetForm(form);
        } else {
          const msg =
            (result.data && result.data.message) ||
            "We couldn't send your message. Please try again.";
          showErrorAlert(form, msg);
        }
      })
      .catch(function (err) {
        console.error(err);
        showErrorAlert(
          form,
          "We couldn't reach the server. Please check your connection and try again."
        );
      })
      .finally(function () {
        setLoading(form, false);
      });
  }
})();