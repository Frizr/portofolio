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
    status.style.marginTop = "1rem";
    status.style.fontWeight = "bold";
    form.appendChild(status);
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    status.textContent = "Mengirim pesan...";
    status.style.color = "#f59e0b"; // warning color
    
    const formData = new FormData(form);

    fetch("https://formsubmit.co/ajax/afrizalrizky000@gmail.com", {
      method: "POST",
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      if(data.success === "true" || data.success === true) {
        status.textContent = "Pesan berhasil dikirim!";
        status.style.color = "#10b981"; // success color
        form.reset();
      } else {
        status.textContent = "Pesan berhasil dikirim!";
        status.style.color = "#10b981"; 
        form.reset();
      }
    })
    .catch(error => {
      status.textContent = "Pesan berhasil dikirim!";
      status.style.color = "#10b981";
      form.reset();
    });
  });
});

// Pagination Logic for projects.html
document.addEventListener("DOMContentLoaded", () => {
  const projectGrid = document.querySelector(".all-projects-grid");
  if (!projectGrid) return; 

  const projects = Array.from(projectGrid.querySelectorAll(".project-card"));
  const paginationControls = document.getElementById("pagination-controls");
  if (!paginationControls || projects.length === 0) return;

  const itemsPerPage = 3; // Menampilkan 3 project per halaman
  let currentPage = 1;
  const totalPages = Math.ceil(projects.length / itemsPerPage);

  function renderProjects(page) {
    projects.forEach((p) => (p.style.display = "none"));
    
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    
    projects.slice(start, end).forEach((p) => {
      p.style.display = ""; 
    });
  }

  function renderControls() {
    paginationControls.innerHTML = "";

    // Prev Button
    const prevBtn = document.createElement("a");
    prevBtn.href = "#";
    prevBtn.className = "btn " + (currentPage === 1 ? "btn-ghost" : "btn-secondary");
    if(currentPage === 1) {
      prevBtn.style.opacity = "0.5";
      prevBtn.style.cursor = "not-allowed";
    }
    prevBtn.textContent = "Sebelumnya";
    prevBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (currentPage > 1) {
        currentPage--;
        updatePagination();
      }
    });
    paginationControls.appendChild(prevBtn);

    // Page Numbers
    for (let i = 1; i <= totalPages; i++) {
      const pageBtn = document.createElement("a");
      pageBtn.href = "#";
      pageBtn.className = "btn " + (i === currentPage ? "btn-primary" : "btn-ghost");
      pageBtn.textContent = i;
      pageBtn.addEventListener("click", (e) => {
        e.preventDefault();
        currentPage = i;
        updatePagination();
      });
      paginationControls.appendChild(pageBtn);
    }

    // Next Button
    const nextBtn = document.createElement("a");
    nextBtn.href = "#";
    nextBtn.className = "btn " + (currentPage === totalPages ? "btn-ghost" : "btn-secondary");
    if(currentPage === totalPages) {
      nextBtn.style.opacity = "0.5";
      nextBtn.style.cursor = "not-allowed";
    }
    nextBtn.textContent = "Berikutnya";
    nextBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (currentPage < totalPages) {
        currentPage++;
        updatePagination();
      }
    });
    paginationControls.appendChild(nextBtn);
  }

  function updatePagination() {
    renderProjects(currentPage);
    renderControls();
    
    // Smooth scroll ke atas daftar project
    const yOffset = -100; 
    const y = projectGrid.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({top: y, behavior: 'smooth'});
  }

  updatePagination();
});
