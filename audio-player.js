/**
 * DISCOVER JAPAN - MUSIC CONSISTENCY SYSTEM & INTERACTIVE EASTER EGGS
 * Preserves playback timestamp across page loads and adds interactive fun.
 */
document.addEventListener("DOMContentLoaded", () => {
  // --- Audio Player Logic ---
  const audio = document.querySelector(".floating-audio-player audio");
  if (audio) {
    // Restore saved playback time
    const savedTime = parseFloat(localStorage.getItem("jp_audio_time")) || 0;
    audio.currentTime = savedTime;

    // Periodically save playback position
    setInterval(() => {
      if (!audio.paused) {
        localStorage.setItem("jp_audio_time", audio.currentTime.toString());
      }
    }, 250);

    // Play automatically or queue to play on first user interaction (browser policy)
    audio.play().catch(() => {
      const forcePlay = () => {
        audio.play().catch(() => {});
        document.removeEventListener("click", forcePlay);
        document.removeEventListener("keydown", forcePlay);
      };
      document.addEventListener("click", forcePlay);
      document.addEventListener("keydown", forcePlay);
    });
  }

  // --- Easter Eggs Initialization ---
  initializeEasterEggs();

  // --- Make Floating Audio Player Draggable ---
  const player = document.querySelector(".floating-audio-player");
  if (player) {
    makeDraggable(player);
  }
});

/**
 * Sets up the 4 interactive Japan-themed easter eggs.
 */
function initializeEasterEggs() {
  // 1. Developer Console Greeting (Mount Fuji Art)
  console.log(
    "%c🌸 こんにちは Explorer! 🌸\n" +
    "%c       ▲       \n" +
    "      / \\      \n" +
    "     / _ \\     \n" +
    "    / / \\ \\    \n" +
    "   / /   \\ \\   \n" +
    "  /_/_____\\_\\  \n" +
    " /           \\ \n" +
    "/_____________\\\n\n" +
    "You found the secret door to Japan! ⛩️\n" +
    "Here is a hidden coupon code: %cOMOTENASHI10%c\n" +
    "Use it at checkout for 10% off any custom package!",
    "color: #d11a2a; font-size: 14px; font-weight: bold; font-family: 'Cinzel', serif;",
    "color: #c5a059; font-weight: bold; font-family: monospace;",
    "color: #ffffff; background: #d11a2a; padding: 2px 6px; border-radius: 4px; font-weight: bold;",
    "color: inherit;"
  );

  // 2. Sakura Keyboard Sequence Detector ('S' + 'K' for Sakura)
  let lastKey = "";
  document.addEventListener("keydown", (e) => {
    // Prevent trigger when typing in input or textarea fields
    const activeEl = document.activeElement.tagName.toLowerCase();
    if (activeEl === "input" || activeEl === "textarea") return;

    const key = e.key.toLowerCase();
    if (lastKey === "s" && key === "k") {
      triggerSakuraShower();
    }
    lastKey = key;
  });

  function triggerSakuraShower() {
    if (document.querySelector(".sakura-container")) return;

    const container = document.createElement("div");
    container.className = "sakura-container";
    document.body.appendChild(container);

    // Spawn 35 animated falling petals
    for (let i = 0; i < 35; i++) {
      const petal = document.createElement("div");
      petal.className = "sakura-petal";
      
      petal.style.left = Math.random() * 100 + "vw";
      petal.style.width = Math.random() * 8 + 8 + "px";
      petal.style.height = Math.random() * 10 + 12 + "px";
      petal.style.animationDelay = Math.random() * 8 + "s";
      petal.style.animationDuration = Math.random() * 6 + 6 + "s";
      
      container.appendChild(petal);
    }

    // Clean up to save memory after animation ends
    setTimeout(() => {
      container.remove();
    }, 15000);
  }

  // 3. Shinkansen Bullet Train on Logo Click (and Neon Tokyo on Double-Click)
  const logo = document.querySelector(".logo");
  if (logo) {
    logo.addEventListener("click", (e) => {
      e.preventDefault();
      triggerShinkansen();
    });

    logo.addEventListener("dblclick", (e) => {
      e.preventDefault();
      document.body.classList.toggle("tokyo-night-mode");
      console.log(
        "%c🌃 TOKYO NEON NIGHT MODE ACTIVE! 🌃\nDouble-click the logo again to return to traditional washi mode.",
        "color: #ff007f; font-size: 14px; font-weight: bold; text-shadow: 0 0 5px #ff007f;"
      );
    });
  }

  function triggerShinkansen() {
    let train = document.querySelector(".shinkansen-train");
    if (!train) {
      train = document.createElement("div");
      train.className = "shinkansen-train";
      train.innerHTML = `<strong>SHINKANSEN Express</strong>`;
      document.body.appendChild(train);
    }

    // Force DOM reflow to allow transition reset
    train.getBoundingClientRect();

    train.classList.add("active");

    // Spawn trailing sakura petals in the train's slipstream
    let petalInterval = setInterval(() => {
      const rect = train.getBoundingClientRect();
      if (rect.right > 0 && rect.left < window.innerWidth) {
        // Spawn petals near the rear of the train
        createTrailPetal(rect.left + 20, rect.top + Math.random() * 25 + 10);
        createTrailPetal(rect.left + 80, rect.top + Math.random() * 25 + 5);
      }
    }, 30);

    // Remove active class and stop spawning after train exits (2.0s travel time)
    setTimeout(() => {
      clearInterval(petalInterval);
      train.classList.remove("active");
    }, 2000);
  }

  function createTrailPetal(x, y) {
    const petal = document.createElement("div");
    petal.className = "sakura-trail-petal";
    petal.style.left = x + "px";
    petal.style.top = y + "px";

    const size = Math.random() * 5 + 6;
    petal.style.width = size + "px";
    petal.style.height = size * 1.2 + "px";

    document.body.appendChild(petal);

    setTimeout(() => {
      petal.remove();
    }, 1000);
  }

  // 4. Origami Crane in Footer Bottom
  const footerBottom = document.querySelector(".footer-bottom");
  if (footerBottom) {
    const craneContainer = document.createElement("div");
    craneContainer.className = "origami-crane-container";

    const crane = document.createElement("span");
    crane.className = "origami-crane";
    crane.innerHTML = "🕊️";
    crane.title = "Origami Crane - Click to release!";

    craneContainer.appendChild(crane);
    footerBottom.appendChild(craneContainer);

    crane.addEventListener("click", () => {
      if (crane.classList.contains("flying")) return;
      crane.classList.add("flying");

      // Reset the flying class after animation ends
      setTimeout(() => {
        crane.classList.remove("flying");
      }, 2500);
    });
  }

  // 5. Interactive Koi Fish Pond
  document.addEventListener("click", (e) => {
    // Avoid spawning ripples when clicking on interactive elements (inputs, links, buttons, players, crane)
    if (
      e.target.closest("button") ||
      e.target.closest("input") ||
      e.target.closest("textarea") ||
      e.target.closest("a") ||
      e.target.closest(".floating-audio-player") ||
      e.target.closest(".origami-crane") ||
      e.target.closest(".nav-links")
    ) {
      return;
    }

    const x = e.pageX;
    const y = e.pageY;

    // Spawn click ripple
    const ripple = document.createElement("div");
    ripple.className = "koi-ripple";
    ripple.style.left = (x - 25) + "px";
    ripple.style.top = (y - 25) + "px";
    document.body.appendChild(ripple);

    // Hover event on the ripple to trigger Koi Fish
    ripple.addEventListener("mouseenter", () => {
      if (ripple.dataset.hasKoi) return;
      ripple.dataset.hasKoi = "true";

      // Spawn Koi fish
      const koi = document.createElement("div");
      koi.className = "koi-fish";
      koi.style.left = (x - 30) + "px";
      koi.style.top = (y - 30) + "px";
      
      const angle = Math.floor(Math.random() * 360);
      koi.style.setProperty("--koi-angle", `${angle}deg`);
      
      // Inline custom Kohaku Koi SVG
      koi.innerHTML = `
        <svg viewBox="0 0 100 100" style="width: 100%; height: 100%;">
          <!-- Fins shadow/glowing outline -->
          <path d="M50,15 C62,35 60,65 50,85 C40,65 38,35 50,15 Z" fill="#ffffff" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.15))"/>
          <!-- Orange patches -->
          <path d="M50,22 C56,32 54,42 50,52 C46,42 44,32 50,22 Z" fill="#ff4d4d"/>
          <circle cx="50" cy="65" r="4.5" fill="#ff4d4d"/>
          <circle cx="50" cy="76" r="3" fill="#ff4d4d"/>
          <!-- Fin touches -->
          <path d="M36,36 C28,38 31,43 40,41 Z" fill="#ffffff" opacity="0.9"/>
          <path d="M64,36 C72,38 69,43 60,41 Z" fill="#ffffff" opacity="0.9"/>
          <!-- Tail Fin -->
          <path d="M50,85 C55,90 53,95 50,92 C47,95 45,90 50,85 Z" fill="#ff4d4d"/>
          <!-- Eyes -->
          <circle cx="45" cy="24" r="1.5" fill="#171923"/>
          <circle cx="55" cy="24" r="1.5" fill="#171923"/>
        </svg>
      `;

      document.body.appendChild(koi);

      // Clean up koi fish element after animation ends
      setTimeout(() => {
        koi.remove();
      }, 2500);
    });

    // Clean up ripple element after animation ends
    setTimeout(() => {
      ripple.remove();
    }, 1800);
  });
}

/**
 * Enables mouse and touch drag-and-drop on a fixed positioned element.
 */
function makeDraggable(element) {
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  
  // Use the title box/compact disc as the drag handle
  const handle = element.querySelector(".audio-title-box") || element;
  handle.style.cursor = "move";
  
  handle.addEventListener("mousedown", dragMouseDown);
  handle.addEventListener("touchstart", dragTouchStart, { passive: true });

  function dragMouseDown(e) {
    // Avoid dragging when interacting with audio element buttons/progress bar
    if (e.target.closest("audio") || e.target.closest("button") || e.target.closest("a")) return;
    
    e.preventDefault();
    
    // Disable normal transition effects during dragging to prevent lag
    element.style.transition = "none";
    
    pos3 = e.clientX;
    pos4 = e.clientY;
    
    document.addEventListener("mouseup", closeDragElement);
    document.addEventListener("mousemove", elementDrag);
  }

  function elementDrag(e) {
    e.preventDefault();
    
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    
    // Calculate new top and left values
    const newTop = element.offsetTop - pos2;
    const newLeft = element.offsetLeft - pos1;
    
    // Boundary checks to keep player inside viewport
    const maxLeft = window.innerWidth - element.offsetWidth - 10;
    const maxTop = window.innerHeight - element.offsetHeight - 10;
    
    element.style.left = Math.max(10, Math.min(newLeft, maxLeft)) + "px";
    element.style.top = Math.max(10, Math.min(newTop, maxTop)) + "px";
    
    // Override absolute positioning constraints from stylesheet
    element.style.bottom = "auto";
    element.style.right = "auto";
  }

  function closeDragElement() {
    // Restore styling transitions after drag completes
    element.style.transition = "var(--transition-smooth)";
    
    document.removeEventListener("mouseup", closeDragElement);
    document.removeEventListener("mousemove", elementDrag);
  }

  function dragTouchStart(e) {
    if (e.target.closest("audio") || e.target.closest("button") || e.target.closest("a")) return;
    
    element.style.transition = "none";
    
    const touch = e.touches[0];
    pos3 = touch.clientX;
    pos4 = touch.clientY;
    
    document.addEventListener("touchend", closeDragTouch);
    document.addEventListener("touchmove", elementTouchDrag, { passive: false });
  }

  function elementTouchDrag(e) {
    // Prevent screen scroll while dragging element
    e.preventDefault();
    
    const touch = e.touches[0];
    pos1 = pos3 - touch.clientX;
    pos2 = pos4 - touch.clientY;
    pos3 = touch.clientX;
    pos4 = touch.clientY;
    
    const newTop = element.offsetTop - pos2;
    const newLeft = element.offsetLeft - pos1;
    
    const maxLeft = window.innerWidth - element.offsetWidth - 10;
    const maxTop = window.innerHeight - element.offsetHeight - 10;
    
    element.style.left = Math.max(10, Math.min(newLeft, maxLeft)) + "px";
    element.style.top = Math.max(10, Math.min(newTop, maxTop)) + "px";
    
    element.style.bottom = "auto";
    element.style.right = "auto";
  }

  function closeDragTouch() {
    element.style.transition = "var(--transition-smooth)";
    
    document.removeEventListener("touchend", closeDragTouch);
    document.removeEventListener("touchmove", elementTouchDrag);
  }
}

