document.addEventListener('DOMContentLoaded', () => {
    const giftBox = document.getElementById('giftBox');
    const giftContainer = document.getElementById('giftContainer');
    const celebrationContainer = document.getElementById('celebrationContainer');
    const musicBtn = document.getElementById('musicBtn');
    const bgMusic = document.getElementById('bgMusic');

    let confettiFrameId = null;
    let balloonIntervalId = null;

    // Theme Colors for Balloons
    const balloonColors = ['#ab47bc', '#A91079', '#FF8E53', '#FF6B6B', '#8e24aa'];

    // --- 1. CONFETTI RAIN ---
    function startConfettiRain() {
        const colors = ['#ab47bc', '#A91079', '#FF8E53', '#ffffff'];

        (function frame() {
            // Stop if music is paused or ended
            if (bgMusic.paused || bgMusic.ended) return;

            // Left Side
            confetti({
                particleCount: 2, angle: 60, spread: 55, origin: { x: 0 },
                colors: colors, zIndex: 10000
            });
            // Right Side
            confetti({
                particleCount: 2, angle: 120, spread: 55, origin: { x: 1 },
                colors: colors, zIndex: 10000
            });

            confettiFrameId = requestAnimationFrame(frame);
        }());
    }

    // --- 2. BALLOON SPAWNING ---
    function startBalloons() {
        // Create a new balloon every 0.8 seconds
        balloonIntervalId = setInterval(() => {
            createBalloon();
        }, 800);
    }

    function createBalloon() {
        const balloon = document.createElement('div');
        balloon.classList.add('balloon');
        
        // FIX: Only use 90% of screen width so balloons don't overflow the right side
        balloon.style.left = Math.random() * 90 + 'vw';
        
        // Random Color (assigned to CSS Variable)
        const randomColor = balloonColors[Math.floor(Math.random() * balloonColors.length)];
        balloon.style.setProperty('--balloon-color', randomColor);
        
        // Random Speed
        const duration = Math.random() * 6 + 6; 
        balloon.style.setProperty('--float-duration', duration + 's');

        document.body.appendChild(balloon);

        // Cleanup after animation
        setTimeout(() => {
            balloon.remove();
        }, duration * 1000);
    }

    function stopEffects() {
        if (confettiFrameId) cancelAnimationFrame(confettiFrameId);
        if (balloonIntervalId) clearInterval(balloonIntervalId);
    }

    // --- 3. EVENT LISTENERS ---

    // START effects when music plays
    bgMusic.addEventListener('play', () => {
        musicBtn.innerText = "⏸ Pause Music";
        startConfettiRain();
        startBalloons();
    });

    // STOP effects when music pauses
    bgMusic.addEventListener('pause', () => {
        musicBtn.innerText = "🎶 Play Music";
        stopEffects();
    });

    // STOP effects when music ends
    bgMusic.addEventListener('ended', () => {
        musicBtn.innerText = "🎶 Play Music";
        stopEffects();
    });

    // Manual Button Toggle
    musicBtn.addEventListener('click', () => {
        if (bgMusic.paused) {
            bgMusic.play();
        } else {
            bgMusic.pause();
        }
    });

    // Gift Box Click Sequence
    giftBox.addEventListener('click', () => {
        giftBox.classList.add('box-open');
        
        setTimeout(() => {
            giftContainer.classList.add('d-none');
            celebrationContainer.classList.remove('d-none');
            celebrationContainer.classList.add('d-flex');
            
            // Trigger Music (which triggers effects)
            bgMusic.volume = 0.5;
            bgMusic.play().catch(e => {
                console.log("Autoplay blocked");
                musicBtn.innerText = "🎶 Play Music (Click Me)";
            });
        }, 800);
    });
});