document.addEventListener("DOMContentLoaded", () => {
    const avatar = document.getElementById("avatar");
    const avatarContainer = document.getElementById("avatar-container");
    const speechBubble = document.getElementById("speech-bubble");
    const typingText = document.getElementById("typing-text");
    const mainContent = document.getElementById("main-content");
    
    const startOverlay = document.getElementById("start-overlay");
    const startBtn = document.getElementById("start-btn");

    // Assemble start button text character by character from random directions
    const btnText = startBtn.textContent.trim();
    startBtn.textContent = ""; // Clear original text
    startBtn.style.pointerEvents = "none"; // Disable clicks during animation
    
    for (let i = 0; i < btnText.length; i++) {
        const char = btnText[i];
        const span = document.createElement("span");
        
        if (char === " ") {
            span.innerHTML = "&nbsp;";
        } else {
            span.textContent = char;
        }
        
        span.classList.add("flying-char");
        
        // Random starting direction and rotation in 3D
        const angle = Math.random() * Math.PI * 2;
        const distance = 600 + Math.random() * 600; // 600px to 1200px
        const startX = Math.round(Math.cos(angle) * distance);
        const startY = Math.round(Math.sin(angle) * distance);
        const startZ = Math.round(Math.random() * 1000 - 500); // -500px to 500px Z-depth
        const startRot = Math.round(Math.random() * 720 - 360); // -360deg to 360deg
        
        span.style.setProperty("--start-x", `${startX}px`);
        span.style.setProperty("--start-y", `${startY}px`);
        span.style.setProperty("--start-z", `${startZ}px`);
        span.style.setProperty("--start-rot", `${startRot}deg`);
        
        // Staggered animation delay
        span.style.animationDelay = `${800 + i * 200}ms`;
        
        startBtn.appendChild(span);
    }

    // Enable hover effects and clicks after assembly animation is complete
    setTimeout(() => {
        startBtn.style.animation = "none";
        startBtn.style.opacity = "1";
        startBtn.style.transform = "translateZ(0) rotateY(0deg) scale(1)";
        startBtn.style.pointerEvents = "auto";
        startBtn.classList.add("assembled");
        
        // Clear inline style animations to allow standard CSS transitions to work on hover
        const chars = startBtn.querySelectorAll(".flying-char");
        chars.forEach(char => {
            char.style.animation = "none";
            char.style.opacity = "1";
            char.style.transform = "none";
            char.style.filter = "none";
        });
    }, 9600);

    // The message to type
    const message = "Welcome to my portfolio. I am Shubham Kumar. A Fullstack Software Engineer.";
    let typeIndex = 0;
    
    // Wait for user to click start
    startBtn.addEventListener("click", () => {
        // Hide start overlay
        startOverlay.style.opacity = '0';
        setTimeout(() => startOverlay.style.visibility = 'hidden', 500);

        // Step 1: Show avatar with fly-in animation
        setTimeout(() => {
            avatar.classList.remove("hidden");
            avatar.classList.add("animate-fly");
        }, 500);

        // Step 2: Show speech bubble and type text
        setTimeout(() => {
            speechBubble.classList.remove("hidden");
            speechBubble.classList.add("show");
            
            // Speak the message out loud
            const speech = new SpeechSynthesisUtterance(message);
            speech.rate = 0.9; // Slightly slower for clarity
            window.speechSynthesis.speak(speech);

            typeWriter();
        }, 1500);
    });

    // Typing effect function
    function typeWriter() {
        if (typeIndex < message.length) {
            typingText.innerHTML = message.substring(0, typeIndex + 1) + '<span class="cursor"></span>';
            typeIndex++;
            setTimeout(typeWriter, 80); // Speed of typing adjusted to match voice
        } else {
            // Remove cursor after typing is done
            typingText.innerHTML = message;
            
            // Step 3: Wait a bit, then move avatar and show content
            setTimeout(transitionToMain, 1500);
        }
    }

    // Step 3: Transition to main content
    function transitionToMain() {
        // Hide speech bubble
        speechBubble.classList.remove("show");
        speechBubble.classList.add("hidden");

        // Move avatar to the right
        avatarContainer.classList.add("moved-right");

        // Reveal floating nav and content area
        setTimeout(() => {
            mainContent.classList.remove("hidden");
            mainContent.classList.add("visible");
            // By default, open 'Hero' (Home)
            document.querySelector('[data-target="hero"]').click();
        }, 1000); // wait for move animation to start
    }

    // Navigation Logic
    const navItems = document.querySelectorAll(".nav-item");
    const sections = document.querySelectorAll(".content-section");

    navItems.forEach(item => {
        item.addEventListener("click", () => {
            // Remove active from all nav items
            navItems.forEach(nav => nav.classList.remove("active"));
            // Add active to clicked nav item
            item.classList.add("active");

            // Hide all sections
            sections.forEach(section => {
                section.classList.remove("active");
                // Reset animation
                section.style.opacity = '0';
                section.style.transform = 'translateY(20px)';
            });

            // Show targeted section
            const targetId = item.getAttribute("data-target");
            const targetSection = document.getElementById(targetId);
            
            targetSection.classList.add("active");
            
            // Trigger reflow for animation restart
            void targetSection.offsetWidth;
            
            targetSection.style.opacity = '1';
            targetSection.style.transform = 'translateY(0)';
        });
    });

    // Resume Modal Logic
    const viewResumeBtn = document.getElementById("view-resume-btn");
    const resumeModal = document.getElementById("resume-modal");
    const closeResumeBtn = document.getElementById("close-resume");

    if (viewResumeBtn && resumeModal && closeResumeBtn) {
        viewResumeBtn.addEventListener("click", (e) => {
            e.preventDefault();
            resumeModal.classList.remove("hidden");
            // small delay to allow display block to process before opacity transition
            setTimeout(() => {
                resumeModal.classList.add("show");
            }, 10);
        });

        const closeModal = () => {
            resumeModal.classList.remove("show");
            setTimeout(() => {
                resumeModal.classList.add("hidden");
            }, 300); // match transition duration
        };

        closeResumeBtn.addEventListener("click", closeModal);
        resumeModal.addEventListener("click", (e) => {
            if (e.target === resumeModal) {
                closeModal();
            }
        });
    }
});
