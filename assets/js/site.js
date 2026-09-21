document.addEventListener("DOMContentLoaded", () => {
  const b = document.querySelector(".menu"),
    n = document.querySelector(".nav");
  if (b && n)
    b.addEventListener("click", () => {
      const o = n.classList.toggle("open");
      b.setAttribute("aria-expanded", o);
    });
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
      const m = f.querySelector(".message");
      if (m) {
        m.textContent =
          "Thank you. This demo request has been recorded; an UrbanFix representative will call you shortly.";
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
    }),
  );
});

