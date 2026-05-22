document.documentElement.classList.add("js");

const navToggle = document.querySelector("#nav-toggle");
const navLinks = document.querySelectorAll(".nav-panel a");

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (navToggle) {
      navToggle.checked = false;
    }
  });
});

const pagePath = window.location.pathname.split("/").pop() || "index.html";

document.querySelectorAll(".nav-panel a").forEach((link) => {
  const href = link.getAttribute("href") || "";
  const linkPath = href.split("#")[0] || "index.html";

  if (linkPath === pagePath || (pagePath === "" && linkPath === "index.html")) {
    link.classList.add("is-active");
  }
});

const revealTargets = document.querySelectorAll(
  ".section-heading, .glass-panel, .skill-card, .project-card, .timeline-item, .contact-copy, .page-hero-card, .detail-section, .prism-services article, .testimonial-grid article, .blog-grid article, .metrics-grid div"
);

revealTargets.forEach((target) => target.classList.add("reveal"));

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealTargets.forEach((target) => observer.observe(target));
} else {
  revealTargets.forEach((target) => target.classList.add("is-visible"));
}

const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

if (canHover) {
  document.querySelectorAll(".project-card, .skill-card").forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const rotateY = ((x / rect.width) - 0.5) * 5;
      const rotateX = ((0.5 - y / rect.height) * 5);

      card.style.setProperty("--tilt-x", `${rotateX}deg`);
      card.style.setProperty("--tilt-y", `${rotateY}deg`);
    });

    card.addEventListener("mouseleave", () => {
      card.style.setProperty("--tilt-x", "0deg");
      card.style.setProperty("--tilt-y", "0deg");
    });
  });
}

document.querySelectorAll(".contact-form").forEach((form) => {
  let status = form.querySelector(".form-status");

  if (!status) {
    status = document.createElement("p");
    status.className = "form-status";
    status.setAttribute("aria-live", "polite");
    form.appendChild(status);
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    status.textContent = "Message preview saved locally. Please use the email or social links to send it.";
    form.reset();
  });
});
