document.addEventListener("DOMContentLoaded", () => {
  const b = document.querySelector(".menu"),
    n = document.querySelector(".nav");
  if (b && n)
    b.addEventListener("click", () => {
      const o = n.classList.toggle("open");
      b.setAttribute("aria-expanded", o);
    });

  const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbw2NcSE5twLWZAACvaBlMWyDg5cW5J0QspBoBX0tR_Y70u3OD-w7-I56E6hWe40j4UI/exec";

  document.querySelectorAll(".booking-form").forEach((f) =>
    f.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!f.checkValidity()) {
        f.reportValidity();
        return;
      }

      const nameInput = f.querySelector('[name="name"]');
      if (nameInput && nameInput.value) {
        try {
          sessionStorage.setItem("urbanfix_lead_name", nameInput.value.trim());
        } catch (err) {}
      }

      const submitBtn = f.querySelector('button[type="submit"]');
      let origBtnText = "";
      if (submitBtn) {
        origBtnText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = "Submitting...";
      }

      const m = f.querySelector(".message");
      if (m) {
        m.textContent = "Submitting your request...";
      }

      const formData = new FormData(f);
      if (!formData.has("source")) {
        formData.append("source", window.location.pathname);
      }
      if (!formData.has("timestamp")) {
        formData.append("timestamp", new Date().toLocaleString());
      }

      const handleCompletion = () => {
        if (m) {
          m.textContent =
            "Thank you! Your request has been recorded. An UrbanFix representative will call you shortly.";
        }

        if (typeof gtag === "function") {
          gtag("event", "generate_lead", {
            form_name: f.getAttribute("data-track-form") || "service_callback",
            service: f.elements.service ? f.elements.service.value : "Air conditioner",
          });
        }

        const redirectUrl = f.getAttribute("data-redirect");
        if (redirectUrl) {
          setTimeout(() => {
            window.location.href = redirectUrl;
          }, 400);
        } else {
          f.reset();
        }

        if (submitBtn) {
          submitBtn.disabled = false;
          if (origBtnText) submitBtn.textContent = origBtnText;
        }
      };

      fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(formData),
      })
        .then(() => {
          handleCompletion();
        })
        .catch((err) => {
          console.error("Error submitting form to Google Apps Script:", err);
          handleCompletion();
        });
    }),
  );
});


