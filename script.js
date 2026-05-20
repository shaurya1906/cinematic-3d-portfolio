/* ================================================================
   SHAURYA MISHRA — v3.0 | script.js
   Three.js hero · 3D tilt · glitch · typewriter · scroll-reveal
   ================================================================ */
(function () {
  'use strict';

  // ── DATA ──────────────────────────────────────────────────────
  const SKILLS = [
    { icon: '⚛️', name: 'React & Next.js', cat: 'Frontend', level: 5,
      desc: 'SPAs, SSR, ISR — building scalable, performant UIs.', badge: 'Expert' },
    { icon: '🐍', name: 'Python & FastAPI', cat: 'Backend', level: 5,
      desc: 'REST APIs, data pipelines, and ML integration.', badge: 'Expert' },
    { icon: '🗄️', name: 'Databases', cat: 'Storage', level: 4,
      desc: 'PostgreSQL, MongoDB, Redis — schema to query optim.', badge: 'Advanced' },
    { icon: '☁️', name: 'Cloud & DevOps', cat: 'Infrastructure', level: 4,
      desc: 'AWS, Docker, GitHub Actions — CI/CD pipelines.', badge: 'Advanced' },
    { icon: '🎨', name: 'UI/UX Engineering', cat: 'Design', level: 5,
      desc: 'Pixel-perfect, accessible, animation-rich interfaces.', badge: 'Expert' },
    { icon: '🤖', name: 'AI Integration', cat: 'Intelligence', level: 4,
      desc: 'LLM APIs, RAG pipelines, agentic workflows.', badge: 'Advanced' },
  ];

  const LANGS = [
    { em: '🐍', label: 'Python',       cls: 'c' },
    { em: '⚡', label: 'JavaScript',   cls: 'm' },
    { em: '🔷', label: 'TypeScript',   cls: 'g' },
    { em: '🎨', label: 'HTML / CSS',   cls: 'a' },
    { em: '🗃️', label: 'SQL',          cls: 'p' },
    { em: '🐚', label: 'Bash / Shell', cls: 'c' },
  ];

  const PROJECTS = [
    {
      num: 'PROJECT 001', name: 'Retrowave Music App',
      desc: 'A high-fidelity music streaming PWA — background playback, YouTube integration, and an immersive retro-synth aesthetic.',
      tags: [['PWA','c'],['Web Audio','m'],['YouTube API','g'],['JavaScript','a']],
      link: '../music-app/index.html'
    },
    {
      num: 'PROJECT 002', name: 'Flappy Mosquito',
      desc: 'Physics-based arcade game built on Canvas API — smooth animations, procedural obstacles, and high-score persistence.',
      tags: [['Canvas API','c'],['Game Physics','m'],['JavaScript','g'],['CSS Animations','a']],
      link: '../flappy-mosquito/index.html'
    },
  ];

  // ── LOADER ────────────────────────────────────────────────────
  const loaderEl  = document.getElementById('loader');
  const appEl     = document.getElementById('app');
  const loaderPct = document.getElementById('loaderPct');
  const loaderMsg = document.getElementById('loaderMsg');

  const steps = [
    { p:15, m:'Loading fonts…' },
    { p:35, m:'Booting Three.js…' },
    { p:60, m:'Building geometry…' },
    { p:80, m:'Compiling shaders…' },
    { p:95, m:'Rendering scene…' },
    { p:100,m:'Ready.' },
  ];

  let si = 0;
  function tick() {
    if (si >= steps.length) { setTimeout(launchApp, 500); return; }
    const s = steps[si++];
    loaderPct.textContent = s.p + '%';
    loaderMsg.textContent = s.m;
    setTimeout(tick, 280 + Math.random() * 180);
  }
  setTimeout(tick, 300);

  function launchApp() {
    loaderEl.style.opacity = '0';
    setTimeout(() => {
      loaderEl.style.display = 'none';
      appEl.style.opacity = '1';
      appEl.style.pointerEvents = 'auto';
      document.body.style.overflow = 'auto';
      initReveal();
      initNav();
    }, 1000);
  }

  // ── THREE.JS HERO ─────────────────────────────────────────────
  (function initThree() {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas || !window.THREE) return;

    const scene    = new THREE.Scene();
    const camera   = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);

    // Main wireframe icosahedron
    const icoGeo  = new THREE.IcosahedronGeometry(2, 1);
    const icoMat  = new THREE.MeshBasicMaterial({ color: 0x00f5ff, wireframe: true, transparent: true, opacity: 0.18 });
    const ico     = new THREE.Mesh(icoGeo, icoMat);
    scene.add(ico);

    // Inner solid icosahedron (subtle fill)
    const icoInnerMat = new THREE.MeshBasicMaterial({ color: 0x00f5ff, transparent: true, opacity: 0.03 });
    const icoInner    = new THREE.Mesh(new THREE.IcosahedronGeometry(1.98, 1), icoInnerMat);
    scene.add(icoInner);

    // Outer orbit ring 1
    const ring1 = new THREE.Mesh(
      new THREE.TorusGeometry(3.2, 0.008, 6, 80),
      new THREE.MeshBasicMaterial({ color: 0xff00aa, transparent: true, opacity: 0.35 })
    );
    ring1.rotation.x = Math.PI / 3;
    scene.add(ring1);

    // Outer orbit ring 2
    const ring2 = new THREE.Mesh(
      new THREE.TorusGeometry(2.7, 0.005, 6, 80),
      new THREE.MeshBasicMaterial({ color: 0x9b5de5, transparent: true, opacity: 0.25 })
    );
    ring2.rotation.x = Math.PI / 5;
    ring2.rotation.z = Math.PI / 4;
    scene.add(ring2);

    // Satellite dot on ring 1
    const dotGeo = new THREE.SphereGeometry(0.06, 8, 8);
    const dot1   = new THREE.Mesh(dotGeo, new THREE.MeshBasicMaterial({ color: 0xff00aa }));
    scene.add(dot1);
    const dot2   = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 8), new THREE.MeshBasicMaterial({ color: 0x9b5de5 }));
    scene.add(dot2);

    // Particles
    const pCount = 200;
    const pPos   = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount * 3; i++) {
      pPos[i] = (Math.random() - 0.5) * 14;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat  = new THREE.PointsMaterial({ color: 0x00f5ff, size: 0.025, transparent: true, opacity: 0.5 });
    const points = new THREE.Points(pGeo, pMat);
    scene.add(points);

    // Mouse tracking
    let mx = 0, my = 0;
    window.addEventListener('mousemove', e => {
      mx = (e.clientX / window.innerWidth - 0.5) * 2;
      my = -(e.clientY / window.innerHeight - 0.5) * 2;
    });

    // Resize
    window.addEventListener('resize', () => {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });

    let t = 0;
    function animate() {
      requestAnimationFrame(animate);
      t += 0.008;

      ico.rotation.x += 0.002;
      ico.rotation.y += 0.003;
      ico.rotation.x += mx * 0.0015;
      ico.rotation.y += my * 0.0015;
      icoInner.rotation.copy(ico.rotation);

      ring1.rotation.z += 0.004;
      ring2.rotation.z -= 0.003;
      ring2.rotation.x += 0.001;

      // Satellite positions
      dot1.position.set(
        3.2 * Math.cos(t * 0.6) * Math.cos(ring1.rotation.x),
        3.2 * Math.sin(t * 0.6),
        3.2 * Math.cos(t * 0.6) * Math.sin(ring1.rotation.x)
      );
      dot2.position.set(
        2.7 * Math.cos(t * 0.4 + 1),
        2.7 * Math.sin(t * 0.4 + 1) * Math.cos(ring2.rotation.z),
        2.7 * Math.sin(t * 0.4 + 1) * Math.sin(ring2.rotation.z)
      );

      points.rotation.y += 0.0005;
      camera.position.x += (mx * 0.3 - camera.position.x) * 0.04;
      camera.position.y += (my * 0.2 - camera.position.y) * 0.04;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    }
    animate();
  })();

  // ── TYPEWRITER ────────────────────────────────────────────────
  const TAGLINES = [
    'Building cinematic interfaces.',
    'Engineering scalable APIs.',
    'Integrating AI into products.',
    'Crafting 3D digital experiences.',
    'Shipping pixel-perfect UIs.',
  ];
  const tagEl = document.getElementById('heroTagline');
  if (tagEl) {
    let ti = 0, ci = 0, deleting = false, waiting = false;
    function type() {
      if (waiting) return;
      const current = TAGLINES[ti % TAGLINES.length];
      if (!deleting) {
        ci++;
        tagEl.innerHTML = current.slice(0, ci) + '<span class="cursor"></span>';
        if (ci === current.length) { deleting = true; waiting = true; setTimeout(() => { waiting = false; }, 1800); }
        setTimeout(type, 60);
      } else {
        ci--;
        tagEl.innerHTML = current.slice(0, ci) + '<span class="cursor"></span>';
        if (ci === 0) { deleting = false; ti++; setTimeout(type, 300); return; }
        setTimeout(type, 30);
      }
    }
    setTimeout(type, 1200);
  }

  // ── GLITCH ────────────────────────────────────────────────────
  function glitch(el) {
    if (!el) return;
    el.classList.add('glitch');
    setTimeout(() => el.classList.remove('glitch'), 120);
  }
  setInterval(() => {
    if (Math.random() > 0.6) glitch(document.getElementById('glitchA'));
    if (Math.random() > 0.7) glitch(document.getElementById('glitchB'));
  }, 3000);

  // ── DOM POPULATION ────────────────────────────────────────────
  function populateSkills() {
    const grid = document.getElementById('skillsGrid');
    if (!grid) return;
    SKILLS.forEach((s, i) => {
      const pips = Array.from({length:5},(_,j)=>`<div class="pip ${j<s.level?'on':''}"></div>`).join('');
      const card = document.createElement('div');
      card.className = 'skill-flip s3d';
      card.style.transitionDelay = `${i * 0.08}s`;
      card.innerHTML = `
        <div class="skill-flip-inner">
          <div class="skill-face skill-front">
            <div>
              <div class="skill-icon">${s.icon}</div>
              <div class="skill-name">${s.name}</div>
              <div class="skill-cat">${s.cat}</div>
            </div>
            <div class="skill-pips">${pips}</div>
          </div>
          <div class="skill-face skill-back">
            <div class="skill-back-title">${s.name}</div>
            <div class="skill-back-desc">${s.desc}</div>
            <span class="skill-back-badge">${s.badge}</span>
          </div>
        </div>`;
      grid.appendChild(card);
    });
  }

  function populateLangs() {
    const wrap = document.getElementById('langsWrap');
    if (!wrap) return;
    LANGS.forEach((l, i) => {
      const p = document.createElement('div');
      p.className = `lang-pill ${l.cls} s3d`;
      p.style.transitionDelay = `${i * 0.06}s`;
      p.innerHTML = `<span class="lang-em">${l.em}</span>${l.label}`;
      wrap.appendChild(p);
    });
  }

  function populateProjects() {
    const grid = document.getElementById('projectsGrid');
    if (!grid) return;
    PROJECTS.forEach((p, i) => {
      const tags = p.tags.map(([t,c])=>`<span class="ptag ptag-${c}">${t}</span>`).join('');
      const card = document.createElement('div');
      card.className = 'proj-card s3d';
      card.style.transitionDelay = `${i * 0.1}s`;
      card.innerHTML = `
        <div>
          <span class="proj-num">${p.num}</span>
          <div class="proj-title">${p.name}</div>
          <div class="proj-desc">${p.desc}</div>
          <div class="proj-tags">${tags}</div>
        </div>
        <div class="proj-bottom">
          <a href="${p.link}" target="_blank" class="proj-link" id="proj-link-${i}">
            Access Module
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
          <span class="proj-glow-num">0${i+1}</span>
        </div>`;

      // 3D tilt on mouse move
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top)  / r.height;
        const rx =  (py - 0.5) * -18;
        const ry =  (px - 0.5) *  18;
        card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.03)`;
        card.style.setProperty('--mx', px * 100 + '%');
        card.style.setProperty('--my', py * 100 + '%');
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });

      grid.appendChild(card);
    });
  }

  populateSkills();
  populateLangs();
  populateProjects();

  // ── SCROLL REVEAL ─────────────────────────────────────────────
  function initReveal() {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('vis'); });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.s3d').forEach(el => obs.observe(el));
  }

  // Kick reveal early for hero
  setTimeout(() => {
    document.querySelectorAll('#hero .s3d').forEach(el => el.classList.add('vis'));
  }, 1300);

  // ── NAV HIGHLIGHT & SCROLL ────────────────────────────────────
  function initNav() {
    const nav = document.getElementById('nav');
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });

    const sections = document.querySelectorAll('section[id]');
    const links    = document.querySelectorAll('.nav-a');
    const obs2 = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          links.forEach(l => l.classList.remove('active'));
          const a = document.querySelector(`.nav-a[href="#${e.target.id}"]`);
          if (a) a.classList.add('active');
        }
      });
    }, { threshold: 0.5 });
    sections.forEach(s => obs2.observe(s));
  }

  // ── CONTACT FORM ──────────────────────────────────────────────
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('.f-submit');
      btn.textContent = '✓ Message Sent!';
      btn.style.background = '#39ff14';
      btn.style.color = '#05050f';
      btn.style.boxShadow = '0 0 40px rgba(57,255,20,.6)';
      setTimeout(() => {
        btn.textContent = 'Send Message →';
        btn.style.background = '';
        btn.style.color = '';
        btn.style.boxShadow = '';
        form.reset();
      }, 3000);
    });
  }

})();
