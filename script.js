/**
 * Dhanush Portfolio — Interactive Engine
 * Pure Vanilla JavaScript: Audio Synth, 3D Tilt, Terminal CLI, Animations & Modals
 */

document.addEventListener('DOMContentLoaded', () => {
  // =========================================================================
  // 1. Audio Effects Synthesizer (Web Audio API)
  // =========================================================================
  let audioCtx = null;
  let soundEnabled = false;

  const initAudio = () => {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  };

  const playClickSound = (type = 'click') => {
    if (!soundEnabled || !audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      const now = audioCtx.currentTime;

      if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.05);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === 'beep') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(1100, now + 0.12);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (type === 'terminal') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(320, now);
        gain.gain.setValueAtTime(0.03, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
        osc.start(now);
        osc.stop(now + 0.03);
      }
    } catch (e) {
      // Audio playback fails silently if restricted
    }
  };

  // Sound Toggle Button
  const soundToggleBtn = document.getElementById('soundToggle');
  const soundOnIcon = soundToggleBtn?.querySelector('.sound-on-icon');
  const soundOffIcon = soundToggleBtn?.querySelector('.sound-off-icon');

  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      initAudio();
      soundEnabled = !soundEnabled;
      if (soundEnabled) {
        soundOnIcon?.classList.remove('hidden');
        soundOffIcon?.classList.add('hidden');
        showToast('Sound effects enabled 🔊');
        playClickSound('beep');
      } else {
        soundOnIcon?.classList.add('hidden');
        soundOffIcon?.classList.remove('hidden');
        showToast('Sound effects muted 🔇');
      }
    });
  }

  // Attach subtle audio feedback to interactive elements
  document.querySelectorAll('button, a, .filter-btn, .project-card').forEach((el) => {
    el.addEventListener('mouseenter', () => {
      if (soundEnabled) playClickSound('click');
    });
  });

  // =========================================================================
  // 2. Theme Switcher System
  // =========================================================================
  const themeToggle = document.getElementById('themeToggle');
  const themeMenu = document.getElementById('themeMenu');
  const themeOptions = document.querySelectorAll('.theme-opt');

  const savedTheme = localStorage.getItem('dhanush_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateActiveThemeButton(savedTheme);

  if (themeToggle && themeMenu) {
    themeToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      themeMenu.classList.toggle('show');
      playClickSound('click');
    });

    document.addEventListener('click', () => {
      themeMenu.classList.remove('show');
    });
  }

  themeOptions.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const theme = btn.getAttribute('data-set-theme');
      if (theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('dhanush_theme', theme);
        updateActiveThemeButton(theme);
        themeMenu?.classList.remove('show');
        showToast(`Theme changed to ${theme.toUpperCase()} ✨`);
        playClickSound('beep');
      }
    });
  });

  function updateActiveThemeButton(theme) {
    themeOptions.forEach((btn) => {
      if (btn.getAttribute('data-set-theme') === theme) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  // =========================================================================
  // 3. Navbar Scroll Effect & Mobile Drawer
  // =========================================================================
  const navbar = document.getElementById('navbar');
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  });

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      playClickSound('click');
    });

    navMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });
  }

  // =========================================================================
  // 4. Cursor Spotlight Glow
  // =========================================================================
  const cursorGlow = document.getElementById('cursorGlow');
  if (cursorGlow && window.innerWidth > 768) {
    window.addEventListener('mousemove', (e) => {
      cursorGlow.style.left = `${e.clientX}px`;
      cursorGlow.style.top = `${e.clientY}px`;
    });
  }

  // =========================================================================
  // 5. Dynamic Typing Animation (Hero Section)
  // =========================================================================
  const typingTarget = document.getElementById('typingText');
  const phrases = [
    'Full-Stack Software Engineer',
    'Next.js & React Architect',
    'Distributed Systems & Cloud Engineer',
    'Creative Technologist & UI Crafter',
    'AI & Vector Search Builder'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 90;

  function typeEffect() {
    if (!typingTarget) return;

    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      typingTarget.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 45;
    } else {
      typingTarget.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 95;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      isDeleting = true;
      typingSpeed = 1600; // Pause at end of line
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingSpeed = 400; // Pause before new word
    }

    setTimeout(typeEffect, typingSpeed);
  }

  typeEffect();

  // =========================================================================
  // 6. 3D Card Tilt Effect on Dhanush Avatar
  // =========================================================================
  const tiltCard = document.getElementById('tiltCard');
  if (tiltCard && window.innerWidth > 992) {
    tiltCard.addEventListener('mousemove', (e) => {
      const rect = tiltCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -12;
      const rotateY = ((x - centerX) / centerX) * 12;

      tiltCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    tiltCard.addEventListener('mouseleave', () => {
      tiltCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  }

  // =========================================================================
  // 7. Live Local Clock (Asia / Kolkata Timezone)
  // =========================================================================
  const localClock = document.getElementById('localClock');
  function updateTime() {
    if (!localClock) return;
    try {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
      localClock.textContent = `${timeStr} IST`;
    } catch (e) {
      localClock.textContent = new Date().toLocaleTimeString();
    }
  }
  updateTime();
  setInterval(updateTime, 1000);

  // Dynamic Year in footer
  const currentYearSpan = document.getElementById('currentYear');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  // =========================================================================
  // 8. Animated Metrics Counter on Scroll
  // =========================================================================
  const metricNumbers = document.querySelectorAll('.metric-num');
  let metricsAnimated = false;

  const countObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !metricsAnimated) {
          metricsAnimated = true;
          metricNumbers.forEach((counter) => {
            const target = parseInt(counter.getAttribute('data-target'), 10) || 0;
            let current = 0;
            const duration = 1500;
            const stepTime = Math.abs(Math.floor(duration / target));

            const timer = setInterval(() => {
              current += 1;
              counter.textContent = current;
              if (current >= target) {
                counter.textContent = target;
                clearInterval(timer);
              }
            }, Math.max(stepTime, 20));
          });
        }
      });
    },
    { threshold: 0.3 }
  );

  const metricsSection = document.querySelector('.metrics-section');
  if (metricsSection) {
    countObserver.observe(metricsSection);
  }

  // =========================================================================
  // 9. Technical Arsenal / Skills Filtering
  // =========================================================================
  const filterButtons = document.querySelectorAll('.filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      playClickSound('click');

      const filterVal = btn.getAttribute('data-filter');

      skillCards.forEach((card) => {
        const cat = card.getAttribute('data-category');
        if (filterVal === 'all' || cat === filterVal) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.opacity = '1';
          }, 40);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // =========================================================================
  // 10. Interactive Developer Terminal CLI
  // =========================================================================
  const terminalInput = document.getElementById('terminalInput');
  const terminalBody = document.getElementById('terminalBody');
  const terminalClearBtn = document.getElementById('terminalClearBtn');

  const commandHistory = [];
  let historyIdx = -1;

  const terminalCommands = {
    help: () => `
Available Commands:
  <span class="term-highlight">about</span>        - Summary of Dhanush's engineering background
  <span class="term-highlight">skills</span>       - Quick breakdown of top technical proficiencies
  <span class="term-highlight">projects</span>     - List of featured engineering applications
  <span class="term-highlight">experience</span>   - Career timeline highlights
  <span class="term-highlight">contact</span>      - Communication channels & email
  <span class="term-highlight">hire</span>         - Why hire Dhanush & project availability
  <span class="term-highlight">theme &lt;name&gt;</span>  - Switch theme ('dark', 'midnight', 'cyber')
  <span class="term-highlight">sound &lt;on|off&gt;</span>- Enable or mute synthetic click sounds
  <span class="term-highlight">quote</span>        - Print an engineering philosophy quote
  <span class="term-highlight">clear</span>        - Clear the terminal screen
    `,

    about: () => `
<span class="term-highlight">Dhanush</span> is a Full-Stack Software Engineer with 4+ years of building web applications, scalable backend microservices, and AI integrations. Focused on clean system design, sub-100ms response times, and delightful user experiences.
    `,

    skills: () => `
<span class="term-highlight">Frontend:</span> React, Next.js (App Router), TypeScript, Tailwind CSS, WebSockets
<span class="term-highlight">Backend:</span> Node.js, Express, FastAPI (Python), Go (Golang), GraphQL, REST
<span class="term-highlight">Databases:</span> PostgreSQL, Redis, ClickHouse, pgvector, Prisma ORM
<span class="term-highlight">DevOps & AI:</span> Docker, AWS (ECS, S3, Lambda), CI/CD, OpenAI/Claude APIs
    `,

    projects: () => `
1. <span class="term-highlight">AuraFlow</span> - Real-time collaborative canvas & workflow engine (React, Go, Redis)
2. <span class="term-highlight">PulseAnalytics</span> - High-throughput telemetry & metrics streaming (Next.js, ClickHouse)
3. <span class="term-highlight">OmniSearch AI</span> - Vector similarity search & 3D knowledge graphs (Python, pgvector)
Type <span class="term-highlight">projects</span> into the nav or click on the cards to explore live demos!
    `,

    experience: () => `
• <span class="term-highlight">Aurora Labs (2023 - Present):</span> Senior Full-Stack Engineer
• <span class="term-highlight">HyperScale Tech (2021 - 2023):</span> Software Engineer
• <span class="term-highlight">Nexus Studios (2020 - 2021):</span> Junior Frontend Developer
    `,

    contact: () => `
• Email: <span class="term-highlight">dhanush.codes@gmail.com</span>
• GitHub: <a href="https://github.com" target="_blank" style="color:#00f0ff;">github.com</a>
• LinkedIn: <a href="https://linkedin.com" target="_blank" style="color:#00f0ff;">linkedin.com</a>
• Location: India (Remote worldwide)
    `,

    hire: () => `
Looking for a dedicated engineer who writes clean code, communicates transparently, and moves with velocity?
Dhanush is currently available for contracts & high-impact full-time roles.
Submit a message via the form below or email <span class="term-highlight">dhanush.codes@gmail.com</span>!
    `,

    quote: () => {
      const quotes = [
        `"Simplicity is prerequisite for reliability." — Edsger W. Dijkstra`,
        `"Make it work, make it right, make it fast." — Kent Beck`,
        `"Code is like humor. When you have to explain it, it’s bad." — Cory House`,
        `"Any fool can write code that a computer can understand. Good programmers write code that humans can understand." — Martin Fowler`
      ];
      return quotes[Math.floor(Math.random() * quotes.length)];
    },

    sudo: () => `<span style="color:#f87171;">Permission denied: User 'visitor' is not in the sudoers file. This incident will be reported to Dhanush!</span>`,

    date: () => new Date().toString()
  };

  const executeTerminal = (rawInput) => {
    const input = rawInput.trim();
    if (!input) return;

    commandHistory.push(input);
    historyIdx = commandHistory.length;

    // Append user input line
    const userLine = document.createElement('div');
    userLine.className = 'terminal-line term-user-line';
    userLine.innerHTML = `dhanush@portfolio:~$ ${escapeHtml(input)}`;
    terminalBody.appendChild(userLine);

    const parts = input.split(' ');
    const cmd = parts[0].toLowerCase();
    const arg = parts[1] ? parts[1].toLowerCase() : '';

    let outputHtml = '';

    if (cmd === 'clear') {
      terminalBody.innerHTML = '';
      return;
    } else if (cmd === 'theme') {
      if (['dark', 'midnight', 'cyber'].includes(arg)) {
        document.documentElement.setAttribute('data-theme', arg);
        localStorage.setItem('dhanush_theme', arg);
        updateActiveThemeButton(arg);
        outputHtml = `Theme switched to <span class="term-highlight">${arg}</span>!`;
        showToast(`Theme updated to ${arg}`);
      } else {
        outputHtml = `Usage: theme &lt;dark | midnight | cyber&gt;`;
      }
    } else if (cmd === 'sound') {
      if (arg === 'on') {
        initAudio();
        soundEnabled = true;
        soundOnIcon?.classList.remove('hidden');
        soundOffIcon?.classList.add('hidden');
        outputHtml = `Sound effects <span class="term-highlight">ENABLED</span>!`;
      } else if (arg === 'off') {
        soundEnabled = false;
        soundOnIcon?.classList.add('hidden');
        soundOffIcon?.classList.remove('hidden');
        outputHtml = `Sound effects <span class="term-highlight">MUTED</span>.`;
      } else {
        outputHtml = `Usage: sound &lt;on | off&gt;`;
      }
    } else if (terminalCommands[cmd]) {
      outputHtml = terminalCommands[cmd]();
    } else {
      outputHtml = `<span style="color:#f87171;">Command not found: "${escapeHtml(cmd)}". Type <span class="term-highlight">help</span> for a list of valid commands.</span>`;
    }

    if (outputHtml) {
      const outputLine = document.createElement('div');
      outputLine.className = 'terminal-line';
      outputLine.innerHTML = outputHtml;
      terminalBody.appendChild(outputLine);
    }

    playClickSound('terminal');
    terminalBody.scrollTop = terminalBody.scrollHeight;
  };

  if (terminalInput) {
    terminalInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        executeTerminal(terminalInput.value);
        terminalInput.value = '';
      } else if (e.key === 'ArrowUp') {
        if (commandHistory.length > 0 && historyIdx > 0) {
          historyIdx--;
          terminalInput.value = commandHistory[historyIdx];
        }
      } else if (e.key === 'ArrowDown') {
        if (historyIdx < commandHistory.length - 1) {
          historyIdx++;
          terminalInput.value = commandHistory[historyIdx];
        } else {
          historyIdx = commandHistory.length;
          terminalInput.value = '';
        }
      }
    });
  }

  if (terminalClearBtn) {
    terminalClearBtn.addEventListener('click', () => {
      terminalBody.innerHTML = '';
      playClickSound('click');
    });
  }

  // =========================================================================
  // 11. Project Quick-View Modal
  // =========================================================================
  const projectModal = document.getElementById('projectModal');
  const modalContent = document.getElementById('modalContent');
  const modalCloseBtn = document.getElementById('modalCloseBtn');

  const projectDetailsData = {
    auraflow: {
      title: 'AuraFlow — Collaborative Workflow Engine',
      category: 'Full-Stack / Real-Time System',
      image: './assets/project-auraflow.jpg',
      overview: 'AuraFlow is an enterprise-grade visual workflow automation platform designed for high-concurrency microservice choreography. It provides real-time state synchronization, live node execution logs, and automated failover pipelines.',
      architecture: [
        'Reactive node canvas powered by custom SVG rendering & React Fiber',
        'Sub-40ms bi-directional state synchronization via WebSockets & Go channels',
        'Redis Pub/Sub cluster handles distributed broadcast across 10,000+ simultaneous connections',
        'Secure webhook dispatcher with exponential backoff retries & HMAC verification'
      ],
      techStack: ['React', 'TypeScript', 'WebSockets', 'Go (Golang)', 'Redis', 'Docker', 'PostgreSQL'],
      github: 'https://github.com',
      demo: 'https://example.com'
    },

    pulse: {
      title: 'PulseAnalytics — High-Throughput Telemetry',
      category: 'Telemetry / Distributed Infrastructure',
      image: './assets/project-pulse.jpg',
      overview: 'PulseAnalytics is an ultra low-latency observability platform capable of aggregating and analyzing telemetry packets from distributed microservices in real time, delivering sub-second anomaly detection.',
      architecture: [
        'Processes up to 50,000 telemetry events per second using ClickHouse column-oriented database',
        'Kafka pipeline buffers traffic spikes and isolates analytical query workloads',
        'Adaptive charting dashboard rendering 60fps graph visualizers without CPU spikes',
        'Instant multi-tenant alert routing to Slack, PagerDuty, and email webhooks'
      ],
      techStack: ['Next.js', 'TypeScript', 'ClickHouse', 'Apache Kafka', 'Tailwind CSS', 'Docker', 'AWS'],
      github: 'https://github.com',
      demo: 'https://example.com'
    },

    omni: {
      title: 'OmniSearch — Semantic Vector Knowledge Graph',
      category: 'AI / Vector Search Engine',
      image: './assets/project-omnisearch.jpg',
      overview: 'OmniSearch transforms scattered enterprise documents, tickets, and knowledge bases into an interconnected semantic graph with vector similarity querying and natural language synthesis.',
      architecture: [
        'Document chunking and 1536-dimensional embedding generation using OpenAI & local models',
        'Cosine distance similarity index with pgvector and HNSW graphs in PostgreSQL',
        'Interactive 3D force-directed node graph visualizer built with D3 and Canvas',
        'FastAPI asynchronous streaming response handler providing low-latency token delivery'
      ],
      techStack: ['Python', 'FastAPI', 'pgvector', 'PostgreSQL', 'D3.js', 'OpenAI API', 'Docker'],
      github: 'https://github.com',
      demo: 'https://example.com'
    }
  };

  const openProjectModal = (projectId) => {
    const data = projectDetailsData[projectId];
    if (!data || !modalContent) return;

    modalContent.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 20px;">
        <div style="width: 100%; aspect-ratio: 16/9; overflow: hidden; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
          <img src="${data.image}" alt="${data.title}" style="width:100%; height:100%; object-fit:cover;" />
        </div>

        <div>
          <span style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--accent-cyan); text-transform: uppercase;">${data.category}</span>
          <h2 style="font-size: 1.6rem; margin: 6px 0 12px; color: var(--text-primary);">${data.title}</h2>
          <p style="color: var(--text-secondary); line-height: 1.7; font-size: 0.95rem;">${data.overview}</p>
        </div>

        <div>
          <h4 style="font-size: 1.1rem; margin-bottom: 10px; color: var(--text-primary);">Engineering Architecture Highlights</h4>
          <ul style="padding-left: 20px; display: flex; flex-direction: column; gap: 8px; color: var(--text-secondary); font-size: 0.9rem;">
            ${data.architecture.map((item) => `<li>${item}</li>`).join('')}
          </ul>
        </div>

        <div>
          <h4 style="font-size: 1rem; margin-bottom: 10px; color: var(--text-primary);">Technologies Applied</h4>
          <div style="display: flex; flex-wrap: wrap; gap: 8px;">
            ${data.techStack.map((tech) => `<span class="tag" style="background: rgba(0,240,255,0.08); border-color: rgba(0,240,255,0.2); color: var(--accent-cyan);">${tech}</span>`).join('')}
          </div>
        </div>

        <div style="display: flex; gap: 14px; margin-top: 10px; border-top: 1px solid var(--border-subtle); padding-top: 20px;">
          <a href="${data.demo}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
            <span>Launch Live Demo</span>
            <span style="font-size: 1.1rem;">↗</span>
          </a>
          <a href="${data.github}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm">
            <span>View Source on GitHub</span>
          </a>
        </div>
      </div>
    `;

    projectModal?.classList.add('show');
    document.body.style.overflow = 'hidden';
    playClickSound('beep');
  };

  const closeProjectModal = () => {
    projectModal?.classList.remove('show');
    document.body.style.overflow = '';
  };

  document.querySelectorAll('.quick-view-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const proj = btn.getAttribute('data-project');
      if (proj) openProjectModal(proj);
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeProjectModal);
  }

  if (projectModal) {
    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) closeProjectModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && projectModal?.classList.contains('show')) {
      closeProjectModal();
    }
  });

  // =========================================================================
  // 12. Contact Form & Clipboard Copy
  // =========================================================================
  const contactForm = document.getElementById('contactForm');
  const copyEmailBtn = document.getElementById('copyEmailBtn');

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      const email = 'dhanush.codes@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        showToast('Email copied to clipboard! 📋');
        playClickSound('beep');
      }).catch(() => {
        showToast(`Email: ${email}`);
      });
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = document.getElementById('formSubmitBtn');
      const originalText = submitBtn?.innerHTML;

      if (submitBtn) {
        submitBtn.innerHTML = `
          <span>Transmitting...</span>
          <div style="width: 16px; height: 16px; border: 2px solid #000; border-top-color: transparent; border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
        `;
        submitBtn.style.pointerEvents = 'none';
      }

      // Simulate network request
      setTimeout(() => {
        contactForm.reset();
        if (submitBtn) {
          submitBtn.innerHTML = originalText;
          submitBtn.style.pointerEvents = 'auto';
        }
        showToast('Message sent! Dhanush will get back to you shortly. 🚀');
        playClickSound('beep');
      }, 1200);
    });
  }

  // Resume Modal trigger
  const resumeBtn = document.getElementById('resumeBtn');
  if (resumeBtn) {
    resumeBtn.addEventListener('click', () => {
      showToast('Opening Dhanush\'s CV summary...');
      playClickSound('beep');
      if (modalContent) {
        modalContent.innerHTML = `
          <div style="padding: 10px;">
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border-subtle); padding-bottom:14px; margin-bottom:18px;">
              <div>
                <h2 style="font-size: 1.5rem; color: var(--text-primary);">Dhanush — Curriculum Vitae</h2>
                <p style="color: var(--accent-cyan); font-size: 0.9rem; font-family: var(--font-mono);">Full-Stack Software Engineer • 4+ Years Experience</p>
              </div>
              <a href="mailto:dhanush.codes@gmail.com" class="btn btn-primary btn-sm">Request Full PDF</a>
            </div>
            <div style="display:flex; flex-direction:column; gap:16px; color: var(--text-secondary); font-size:0.92rem; line-height:1.6;">
              <p><strong>Core Focus:</strong> Next.js, React, Node.js, Go, PostgreSQL, Redis, Cloud Infrastructure, High-Performance Interactive UIs.</p>
              <p><strong>Highlights:</strong> Rebuilt SaaS portals decreasing load time by 48%, engineered real-time WebSockets canvas orchestrators, architected scalable telemetry data ingestion pipelines.</p>
              <p><strong>Education:</strong> Bachelor of Technology in Computer Science & Engineering.</p>
            </div>
          </div>
        `;
        projectModal?.classList.add('show');
        document.body.style.overflow = 'hidden';
      }
    });
  }

  // =========================================================================
  // 13. Toast Notification Helper
  // =========================================================================
  function showToast(message) {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <span class="toast-success-icon">✓</span>
      <span>${escapeHtml(message)}</span>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(15px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  function escapeHtml(str) {
    return str.replace(/[&<>'"]/g, (tag) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag));
  }
});
