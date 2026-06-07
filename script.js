document.addEventListener("DOMContentLoaded", () => {
    const avatar = document.getElementById("avatar");
    const avatarContainer = document.getElementById("avatar-container");
    const speechBubble = document.getElementById("speech-bubble");
    const typingText = document.getElementById("typing-text");
    const mainContent = document.getElementById("main-content");
    
    const startOverlay = document.getElementById("start-overlay");
    const startBtn = document.getElementById("start-btn");

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
});
