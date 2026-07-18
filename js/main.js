document.addEventListener("DOMContentLoaded", () => {
    const carousels = document.querySelectorAll(".carousel-container, .project-image-wrapper:not(.carousel-container)");

    carousels.forEach(container => {
        // Handle both carousel slides and the single independent video frames natively
        const isCarousel = container.classList.contains("carousel-container");
        const slides = isCarousel ? container.querySelectorAll(".carousel-slide") : [container];
        
        const prevBtn = container.querySelector(".prev-btn");
        const nextBtn = container.querySelector(".next-btn");
        const dotsContainer = container.querySelector(".carousel-dots");
        let currentIndex = 0;

        if (isCarousel && slides.length <= 1) {
            if (prevBtn) prevBtn.style.display = "none";
            if (nextBtn) nextBtn.style.display = "none";
            if (dotsContainer) dotsContainer.style.display = "none";
            return;
        }

        // Generate dots if handling an active carousel layout
        if (isCarousel && dotsContainer) {
            dotsContainer.innerHTML = "";
            slides.forEach((_, index) => {
                const dot = document.createElement("span");
                dot.classList.add("dot");
                if (index === 0) dot.classList.add("active");
                dot.addEventListener("click", (e) => {
                    e.stopPropagation();
                    updateCarousel(index);
                });
                dotsContainer.appendChild(dot);
            });
        }

        const dots = isCarousel ? container.querySelectorAll(".dot") : [];

        // Helper: Pause video slide
        const pauseVideoSlide = (slide) => {
            const video = slide.querySelector("video");
            if (video && !video.paused) {
                video.pause();
                slide.classList.remove("is-playing");
                const playIcon = slide.querySelector(".icon-play");
                const pauseIcon = slide.querySelector(".icon-pause");
                if (playIcon) playIcon.style.display = "block";
                if (pauseIcon) pauseIcon.style.display = "none";
            }
        };

        // Helper: Play/Pause video toggle
        const toggleVideoPlay = (slide) => {
            const video = slide.querySelector("video");
            const playIcon = slide.querySelector(".icon-play");
            const pauseIcon = slide.querySelector(".icon-pause");
            if (!video) return;

            if (video.paused) {
                video.play();
                slide.classList.add("is-playing");
                if (playIcon) playIcon.style.display = "none";
                if (pauseIcon) pauseIcon.style.display = "block";
            } else {
                video.pause();
                slide.classList.remove("is-playing");
                if (playIcon) playIcon.style.display = "block";
                if (pauseIcon) pauseIcon.style.display = "none";
            }
        };

        // Bind events to each individual video element
        slides.forEach(slide => {
            const video = slide.querySelector(".click-video");
            const playBtn = slide.querySelector(".play-btn");
            const seekSlider = slide.querySelector(".seek-slider");

            if (!video) return;

            // Video element click handler
            video.addEventListener("click", (e) => {
                e.stopPropagation();
                toggleVideoPlay(slide);
            });

            // Play overlay button handler
            if (playBtn) {
                playBtn.addEventListener("click", (e) => {
                    e.stopPropagation();
                    toggleVideoPlay(slide);
                });
            }

            // Sync slider track layout during real-time runtime playback
            video.addEventListener("timeupdate", () => {
                if (video.duration && seekSlider) {
                    const progressValue = (video.currentTime / video.duration) * 100;
                    seekSlider.value = progressValue;
                }
            });

            // Scrubbing control event listener (Skip within the video clip)
            if (seekSlider) {
                seekSlider.addEventListener("input", (e) => {
                    e.stopPropagation(); // Keep slider drag isolated from underlying clicks
                    if (video.duration) {
                        const targetTime = (seekSlider.value / 100) * video.duration;
                        video.currentTime = targetTime;
                    }
                });

                // Prevent carousel shifting while dragging progress handle
                seekSlider.addEventListener("click", (e) => e.stopPropagation());
                seekSlider.addEventListener("mousedown", (e) => e.stopPropagation());
            }
        });

        // Carousel translation pipeline logic
        const updateCarousel = (newIndex) => {
            if (!isCarousel) return;
            pauseVideoSlide(slides[currentIndex]);

            slides[currentIndex].classList.remove("active");
            if (dots.length > 0) dots[currentIndex].classList.remove("active");

            currentIndex = (newIndex + slides.length) % slides.length;

            slides[currentIndex].classList.add("active");
            if (dots.length > 0) dots[currentIndex].classList.add("active");
        };

        if (prevBtn) {
            prevBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                updateCarousel(currentIndex - 1);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                updateCarousel(currentIndex + 1);
            });
        }
    });

    // Back to Top Button Functionality
const backToTopBtn = document.getElementById("backToTopBtn");

if (backToTopBtn) {
    // Show button when user scrolls down 500px from the top
    window.addEventListener("scroll", () => {
        if (window.scrollY > 500) {
            backToTopBtn.classList.add("is-visible");
        } else {
            backToTopBtn.classList.remove("is-visible");
        }
    });

    // Smooth scroll back to top on click
    backToTopBtn.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}
});

document.addEventListener("DOMContentLoaded", () => {
    const quickNavContainer = document.querySelector(".project-quick-nav");
    const projectCards = document.querySelectorAll(".project-card");

    if (quickNavContainer && projectCards.length > 0) {
        quickNavContainer.innerHTML = ""; // Clear any static placeholders

        projectCards.forEach(card => {
            const titleElement = card.querySelector(".project-title");
            if (!titleElement) return;

            const titleText = titleElement.textContent.trim();

            // 1. Generate an ID-safe string (e.g. "Voxel Rendering Experiments" -> "voxel-rendering-experiments")
            const generatedId = titleText
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-") // Replace spaces/special characters with dashes
                .replace(/(^-|-$)/g, "");    // Trim leading/trailing dashes

            // 2. Set the ID dynamically on the card
            card.id = generatedId;

            // 3. Create the navigation button element
            const navLink = document.createElement("a");
            navLink.href = `#${generatedId}`;
            navLink.className = "btn-nav";
            navLink.textContent = titleText;

            // 4. Implement smooth behavior on click
            navLink.addEventListener("click", (e) => {
                e.preventDefault();
                const targetElement = document.getElementById(generatedId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
                    // Optional: Update URL hash without jumping the page
                    history.pushState(null, null, `#${generatedId}`);
                }
            });

            quickNavContainer.appendChild(navLink);
        });
    }
});