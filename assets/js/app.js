(function () {
  const data = window.projectData;
  const photoKey = data.photoKey;

  const skillsGrid = document.querySelector("#skills-grid");
  const projectGrid = document.querySelector("#project-grid");
  const menuButton = document.querySelector("#menu-button");
  const menuOverlay = document.querySelector("#menu-overlay");
  const progressBar = document.querySelector("#progress-bar");
  const photoInput = document.querySelector("#photo-input");
  const photoRemove = document.querySelector("#photo-remove");
  const photoFrame = document.querySelector("#photo-frame");
  const profilePhoto = document.querySelector("#profile-photo");

  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, (character) => {
      const entities = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      };
      return entities[character];
    });
  }

  function getSafeUrl(url) {
    const value = String(url || "").trim();
    if (value.startsWith("https://") || value.startsWith("http://")) {
      return value;
    }
    return "https://github.com/Frizr";
  }

  function renderSkills() {
    skillsGrid.innerHTML = data.skills
      .map(
        (skill, index) => `
          <article class="skill-card">
            <span class="service-number">${String(index + 1).padStart(2, "0")}</span>
            <h3>${escapeHTML(skill.title)}</h3>
            <ul>${skill.items.map((item) => `<li>${escapeHTML(item)}</li>`).join("")}</ul>
          </article>
        `,
      )
      .join("");
  }

  function renderFeatures(features) {
    if (!features.length) {
      return "<p>Fitur dapat dilengkapi ketika dokumentasi repository sudah lebih detail.</p>";
    }
    return `<ul>${features.map((feature) => `<li>${escapeHTML(feature)}</li>`).join("")}</ul>`;
  }

  function renderProjects() {
    projectGrid.innerHTML = data.projects
      .map((project) => {
        const stack = project.stack.map((item) => `<span class="tag">${escapeHTML(item)}</span>`).join("");
        const safeRepo = getSafeUrl(project.repo);

        return `
          <article class="project-card">
            <div class="project-band ${escapeHTML(project.accent)}">
              <span>${escapeHTML(project.category)}</span>
              <strong>${escapeHTML(project.name)}</strong>
            </div>
            <div class="project-content">
              <div class="project-topline">
                <h3>${escapeHTML(project.name)}</h3>
                <span class="tag">${escapeHTML(project.category)}</span>
              </div>
              <p class="project-summary">${escapeHTML(project.summary)}</p>
              <div class="tags" aria-label="Tech stack ${escapeHTML(project.name)}">${stack}</div>
              <details class="project-details">
                <summary>Case study detail</summary>
                <div class="detail-list">
                  <div class="detail-item">
                    <span>Problem / Context</span>
                    <p>${escapeHTML(project.context)}</p>
                  </div>
                  <div class="detail-item">
                    <span>Solution / What was built</span>
                    <p>${escapeHTML(project.solution)}</p>
                  </div>
                  <div class="detail-item">
                    <span>Tech Stack</span>
                    <p>${escapeHTML(project.stack.join(", "))}</p>
                  </div>
                  <div class="detail-item">
                    <span>My Role</span>
                    <p>${escapeHTML(project.role)}</p>
                  </div>
                  <div class="detail-item">
                    <span>Key Features</span>
                    ${renderFeatures(project.features)}
                  </div>
                  <div class="detail-item">
                    <span>Learning Outcome</span>
                    <p>${escapeHTML(project.learning)}</p>
                  </div>
                </div>
              </details>
              <div class="card-actions">
                <a class="project-link" href="${escapeHTML(safeRepo)}" target="_blank" rel="noreferrer">Open Repository</a>
              </div>
            </div>
          </article>
        `;
      })
      .join("");
  }

  function loadPhoto() {
    const savedPhoto = localStorage.getItem(photoKey);
    if (!savedPhoto) return;
    profilePhoto.src = savedPhoto;
    photoFrame.classList.add("has-photo");
  }

  function bindPhotoUpload() {
    photoInput.addEventListener("change", () => {
      const file = photoInput.files && photoInput.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.addEventListener("load", () => {
        const result = String(reader.result || "");
        profilePhoto.src = result;
        photoFrame.classList.add("has-photo");
        try {
          localStorage.setItem(photoKey, result);
        } catch (error) {
          localStorage.removeItem(photoKey);
        }
      });
      reader.readAsDataURL(file);
    });

    photoRemove.addEventListener("click", () => {
      profilePhoto.removeAttribute("src");
      photoFrame.classList.remove("has-photo");
      photoInput.value = "";
      localStorage.removeItem(photoKey);
    });
  }

  function initThreeScene() {
    const stage = document.querySelector("#three-stage");
    if (!stage || !window.THREE) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0.2, 7.2);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
    stage.appendChild(renderer.domElement);
    stage.classList.add("is-ready");

    const group = new THREE.Group();
    scene.add(group);

    const wire = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.7, 2),
      new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.42 }),
    );
    group.add(wire);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(2.25, 0.018, 12, 120),
      new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 }),
    );
    ring.rotation.x = Math.PI / 2.7;
    group.add(ring);

    const colors = [0x7a3dff, 0xed52cb, 0x3b89ff, 0xff6b00, 0x00d722];
    const nodes = colors.map((color, index) => {
      const node = new THREE.Mesh(
        new THREE.SphereGeometry(index === 4 ? 0.16 : 0.12, 24, 24),
        new THREE.MeshBasicMaterial({ color }),
      );
      const angle = (index / colors.length) * Math.PI * 2;
      node.position.set(Math.cos(angle) * 2.25, Math.sin(angle) * 1.1, Math.sin(angle) * 1.2);
      group.add(node);
      return node;
    });

    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.16 });
    nodes.forEach((node) => {
      const geometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), node.position]);
      group.add(new THREE.Line(geometry, lineMaterial));
    });

    let targetX = 0;
    let targetY = 0;

    function resize() {
      const bounds = stage.getBoundingClientRect();
      const width = Math.max(1, bounds.width);
      const height = Math.max(1, bounds.height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    }

    function animate(time) {
      const t = time * 0.001;
      group.rotation.x += (targetY - group.rotation.x) * 0.025;
      group.rotation.y += (targetX + t * 0.28 - group.rotation.y) * 0.025;
      wire.rotation.z = t * 0.22;
      ring.rotation.z = t * 0.36;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }

    stage.addEventListener("pointermove", (event) => {
      const bounds = stage.getBoundingClientRect();
      targetX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 0.8;
      targetY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 0.5;
    });

    window.addEventListener("resize", resize);
    resize();
    requestAnimationFrame(animate);
  }

  function bindNavigation() {
    menuButton.addEventListener("click", () => {
      const isOpen = menuOverlay.classList.toggle("is-open");
      menuButton.classList.toggle("is-active", isOpen);
      menuButton.setAttribute("aria-expanded", String(isOpen));
      document.body.classList.toggle("menu-open", isOpen);
    });

    menuOverlay.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        menuOverlay.classList.remove("is-open");
        menuButton.classList.remove("is-active");
        menuButton.setAttribute("aria-expanded", "false");
        document.body.classList.remove("menu-open");
      });
    });
  }

  function bindProgress() {
    if (!progressBar) return;
    const updateProgress = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
      progressBar.style.height = `${Math.min(progress * 100, 100)}%`;
    };
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    updateProgress();
  }

  renderSkills();
  renderProjects();
  loadPhoto();
  bindPhotoUpload();
  bindNavigation();
  bindProgress();
  initThreeScene();
})();
