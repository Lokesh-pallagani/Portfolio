(() => {
  "use strict";

  const root = document.documentElement;
  const themeToggle = document.getElementById("themeToggle");
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");
  const navbar = document.getElementById("navbar");

  // Theme
  const savedTheme = localStorage.getItem("lokesh-theme");
  const initialTheme = savedTheme === "light" ? "light" : "dark";
  root.classList.toggle("dark", initialTheme === "dark");

  function syncTheme() {
    const dark = root.classList.contains("dark");
    themeToggle.textContent = dark ? "☀" : "☾";
    themeToggle.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
    themeToggle.title = dark ? "Switch to light mode" : "Switch to dark mode";
  }

  themeToggle.addEventListener("click", () => {
    const dark = !root.classList.contains("dark");
    root.classList.toggle("dark", dark);
    localStorage.setItem("lokesh-theme", dark ? "dark" : "light");
    syncTheme();
  });
  syncTheme();

  // Mobile menu
  function closeMenu() {
    navLinks.classList.remove("mobile-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open menu");
    menuToggle.textContent = "☰";
  }

  function toggleMenu() {
    const open = navLinks.classList.toggle("mobile-open");
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    menuToggle.textContent = open ? "×" : "☰";
  }

  menuToggle.addEventListener("click", toggleMenu);
  navLinks.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
  window.addEventListener("resize", () => {
    if (window.innerWidth > 1100) closeMenu();
  });

  // Scroll reveal
  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add("show"));
  }

  // Active navigation link
  const sections = [...document.querySelectorAll("main section[id]")];
  const links = [...navLinks.querySelectorAll("a")];

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        links.forEach(link => link.classList.toggle("active", link.getAttribute("href") === "#" + entry.target.id));
      });
    }, { rootMargin: "-35% 0px -55% 0px", threshold: 0 });
    sections.forEach(section => sectionObserver.observe(section));
  }

  // Project filtering
  const filterButtons = document.querySelectorAll(".filter");
  const projects = document.querySelectorAll(".project");

  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;
      filterButtons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");

      projects.forEach(project => {
        const show = filter === "all" || project.dataset.cat === filter;
        project.hidden = !show;
      });
    });
  });

  // Project modal
  const modal = document.getElementById("projectModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalDescription = document.getElementById("modalDescription");
  const modalClose = document.getElementById("modalClose");
  let lastFocusedElement = null;

  function openModal(button) {
    lastFocusedElement = document.activeElement;
    modalTitle.textContent = button.dataset.title || "Project";
    modalDescription.textContent = button.dataset.description || "Project details will be added here.";
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    modalClose.focus();
  }

  function closeModal() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    if (lastFocusedElement) lastFocusedElement.focus();
  }

  document.querySelectorAll(".details").forEach(button => {
    button.addEventListener("click", () => openModal(button));
  });
  modalClose.addEventListener("click", closeModal);
  modal.addEventListener("click", event => {
    if (event.target === modal) closeModal();
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && modal.classList.contains("open")) closeModal();
  });

  // Contact form: open WhatsApp or Gmail with encoded content.
  const contactForm = document.getElementById("contactForm");
  const notice = document.getElementById("notice");
  const whatsappNumber = "919493497153";
  const emailAddress = "pallaganilokesh13@gmail.com";

  function showNotice(message, type = "success") {
    notice.textContent = message;
    notice.className = "notice " + type;
  }

  contactForm.addEventListener("submit", event => {
    event.preventDefault();

    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      showNotice("Please complete all required fields correctly.", "error");
      return;
    }

    const formData = new FormData(contactForm);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const subject = String(formData.get("subject") || "").trim();
    const message = String(formData.get("message") || "").trim();
    const sendMethod = event.submitter ? event.submitter.value : "whatsapp";

    const body = [
      "Hello Lokesh,",
      "",
      "Name: " + name,
      "Email: " + email,
      "Subject: " + subject,
      "",
      "Message:",
      message
    ].join("\n");

    if (sendMethod === "whatsapp") {
      const url = "https://wa.me/" + whatsappNumber + "?text=" + encodeURIComponent(body);
      window.open(url, "_blank", "noopener,noreferrer");
      showNotice("WhatsApp opened with your message prepared.");
    } else {
      const mailto = "mailto:" + emailAddress +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);
      window.location.href = mailto;
      showNotice("Your email app was opened with the message prepared.");
    }
  });

  // Current year
  document.getElementById("year").textContent = new Date().getFullYear();

  // Prevent accidental jump from empty placeholder links if any are added later.
  document.querySelectorAll('a[href="#"]').forEach(link => {
    link.addEventListener("click", event => event.preventDefault());
  });

  // Close menu when clicking outside on mobile.
  document.addEventListener("click", event => {
    if (!navLinks.classList.contains("mobile-open")) return;
    if (navbar.contains(event.target)) return;
    closeMenu();
  });
})();
