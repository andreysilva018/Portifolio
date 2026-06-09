  /* ---- nav highlight on scroll ---- */
  const secs  = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-links a');
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if(e.isIntersecting){
        links.forEach(a => a.style.color = '');
        const a = document.querySelector('.nav-links a[href="#'+e.target.id+'"]');
        if(a && !a.classList.contains('nav-cta')) a.style.color = 'var(--green)';
      }
    });
  }, {threshold:0.4});
  secs.forEach(s => io.observe(s));

(function () {
  const root = document.documentElement;
  const themeButton = document.getElementById("themeToggle");
  const savedTheme = localStorage.getItem("theme");
  const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initialTheme = savedTheme || (systemPrefersDark ? "dark" : "light");

  function setTheme(theme) {
    root.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    if (themeButton) {
      themeButton.textContent = theme === "dark" ? "☀️" : "🌙";
      themeButton.setAttribute("aria-label", theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro");
    }
  }

  setTheme(initialTheme);

  if (themeButton) {
    themeButton.addEventListener("click", function () {
      const currentTheme = root.getAttribute("data-theme") || "light";
      setTheme(currentTheme === "dark" ? "light" : "dark");
    });
  }

  const menuBtn = document.getElementById("menuBtn");
  const mobileNav = document.getElementById("mobileNav");
  const menuClose = document.getElementById("menuClose");
  if(menuClose){menuClose.addEventListener("click", window.closeMNav);}
  window.closeMNav = function () {
    if (!mobileNav || !menuBtn) return;
    mobileNav.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
  };

  if (menuBtn && mobileNav) {
    menuBtn.addEventListener("click", function () {
  if (mobileNav.classList.contains('open')) {

    mobileNav.classList.remove('open');
    menuBtn.setAttribute('aria-expanded','false');

  } else {

    mobileNav.classList.add('open');
    menuBtn.setAttribute('aria-expanded','true');

  }
    });
  }

  if (menuClose) {
    menuClose.addEventListener("click", window.closeMNav);
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") window.closeMNav();
  });


  const sections = document.querySelectorAll("section[id]");
  const links = document.querySelectorAll(".nav-links a");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          links.forEach(function (link) {
            link.style.color = "";
          });
          const active = document.querySelector('.nav-links a[href="#' + entry.target.id + '"]');
          if (active && !active.classList.contains("nav-cta")) active.style.color = "var(--green)";
        }
      });
    }, { threshold: 0.4 });

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  const typewriter = document.getElementById("typewriter");
  const phrases = [
    "Olá, eu sou Andrey.",
    "Auxiliar de TI.",
    "Desenvolvedor Backend Java em formação.",
    "Especialista em resolver problemas.",
    "Bem-vindo ao meu portfólio."
  ];

  if (typewriter) {
    let phraseIndex = 0;
    let letterIndex = 0;
    let deleting = false;

    function typeLoop() {
      const current = phrases[phraseIndex];
      typewriter.textContent = current.slice(0, letterIndex);

      if (!deleting && letterIndex < current.length) {
        letterIndex++;
        setTimeout(typeLoop, 70);
        return;
      }

      if (!deleting && letterIndex === current.length) {
        setTimeout(typeLoop,1500); deleting=true; return;
      }

      if (deleting && letterIndex > 0) {
        letterIndex--;
        setTimeout(typeLoop, 34);
        return;
      }

      deleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      setTimeout(typeLoop, 200);
    }

    typeLoop();
  }

  const canvas = document.getElementById("hero-matrix");
  const hero = document.getElementById("hero");

  if (canvas && hero) {
    const ctx = canvas.getContext("2d");
    const chars = "Java Spring Boot SQL API Git REST HTTP JPA MVC{}[]()<>/;01".split("");
    const columnWidth = 18;
    const lineHeight = 15;
    let columns = 0;
    let drops = [];
    let paused = false;
    let animationId = null;

    function resizeMatrix() {
      const rect = hero.getBoundingClientRect();
      const ratio = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, Math.floor(rect.width * ratio));
      canvas.height = Math.max(1, Math.floor(rect.height * ratio));
      canvas.style.width = rect.width + "px";
      canvas.style.height = rect.height + "px";
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

      const isMobile = window.innerWidth < 768;
      const spacing = isMobile ? columnWidth * 2.4 : columnWidth;
      columns = Math.max(1, Math.floor(rect.width / spacing));
      drops = Array.from({ length: columns }, function () {
        return Math.random() * -(rect.height / lineHeight);
      });
    }

    function drawMatrix() {
      if (!paused) {
        
        const currentTheme = root.getAttribute("data-theme") || "light";
        ctx.fillStyle = getComputedStyle(root).getPropertyValue("--matrix-fade").trim() || (currentTheme === "dark" ? "rgba(15,17,21,.08)" : "rgba(249,248,246,.08)") ;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.font = '23px "JetBrains Mono", monospace';
        const width = hero.getBoundingClientRect().width;
        const height = hero.getBoundingClientRect().height;

        for (let i = 0; i < columns; i++) {
          const char = chars[Math.floor(Math.random() * chars.length)];
          const x = i * (width / columns);
          const y = drops[i] * lineHeight;

          ctx.fillStyle = drops[i] < 2 ? "rgba(74,222,128,.88)" : "rgba(34,197,94,.58)";
          ctx.fillText(char, x, y);

          if (y > height && Math.random() > 0.965) drops[i] = 0;
          drops[i] += 1.45;
        }
      }

      animationId = requestAnimationFrame(drawMatrix);
    }

    document.addEventListener("visibilitychange", function () {
      paused = document.hidden;
    });

    let resizeTimer = null; 
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resizeMatrix, 120);
    });

    resizeMatrix();
    drawMatrix();
  }
})();