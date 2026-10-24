(() => {
  "use strict";

  const menuButton = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  const navItems = [...document.querySelectorAll(".nav-link")];
  const sections = [...document.querySelectorAll("main section[id]")];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function closeMenu() {
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation menu");
    navLinks.classList.remove("is-open");
  }

  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Open navigation menu" : "Close navigation menu");
    navLinks.classList.toggle("is-open", !isOpen);
  });

  navLinks.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && navLinks.classList.contains("is-open")) {
      closeMenu();
      menuButton.focus();
    }
  });

  function updateActiveLink() {
    const marker = window.scrollY + 150;
    let currentSection = sections[0]?.id;
    sections.forEach((section) => {
      if (section.offsetTop <= marker) currentSection = section.id;
    });

    navItems.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${currentSection}`;
      link.classList.toggle("is-active", isActive);
      if (isActive) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  }

  window.addEventListener("scroll", updateActiveLink, { passive: true });
  updateActiveLink();

  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reducedMotion) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -25px 0px" });

    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  const typingTarget = document.querySelector("#typing-text");
  const phrases = ["Aspiring Web Developer", "Creative Thinker", "Lifelong Learner"];
  if (!reducedMotion) {
    let phraseIndex = 0;
    let characterIndex = phrases[0].length;
    let isDeleting = false;

    function typeNextCharacter() {
      const phrase = phrases[phraseIndex];
      characterIndex += isDeleting ? -1 : 1;
      typingTarget.textContent = phrase.slice(0, characterIndex);

      let delay = isDeleting ? 42 : 78;
      if (!isDeleting && characterIndex === phrase.length) {
        isDeleting = true;
        delay = 1700;
      } else if (isDeleting && characterIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        delay = 330;
      }
      window.setTimeout(typeNextCharacter, delay);
    }

    window.setTimeout(typeNextCharacter, 1900);
  }

  document.querySelectorAll(".filter-button").forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;
      document.querySelectorAll(".filter-button").forEach((filterButton) => {
        const selected = filterButton === button;
        filterButton.classList.toggle("is-selected", selected);
        filterButton.setAttribute("aria-pressed", String(selected));
      });

      document.querySelectorAll(".project-card").forEach((card) => {
        card.hidden = filter !== "all" && card.dataset.category !== filter;
      });
    });
  });

  const toast = document.querySelector("#placeholder-toast");
  let toastTimer;

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 3200);
  }

  document.querySelectorAll("[data-placeholder-link], .placeholder-action").forEach((placeholder) => {
    placeholder.addEventListener("click", (event) => {
      event.preventDefault();
      showToast("Placeholder link — add your real contact or project URL in index.html.");
    });
  });

  const contactForm = document.querySelector("#contact-form");
  const formStatus = document.querySelector("#form-status");
  const formFields = [...contactForm.querySelectorAll("input, textarea")];

  function validateField(field) {
    const valid = field.checkValidity() && field.value.trim().length > 0;
    field.setAttribute("aria-invalid", String(!valid));
    return valid;
  }

  formFields.forEach((field) => {
    field.addEventListener("input", () => {
      if (field.hasAttribute("aria-invalid")) validateField(field);
    });
  });

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const invalidFields = formFields.filter((field) => !validateField(field));

    if (invalidFields.length > 0) {
      formStatus.textContent = invalidFields.length === 1
        ? "Please check the highlighted field and enter a valid value."
        : "Please check the highlighted fields and enter valid values.";
      formStatus.className = "form-status is-error";
      invalidFields[0].focus();
      return;
    }

    formStatus.textContent = "Your message passed the browser checks, but it has not been sent. Connect a backend or email service to enable delivery.";
    formStatus.className = "form-status is-success";
    contactForm.reset();
    formFields.forEach((field) => field.removeAttribute("aria-invalid"));
  });
})();
