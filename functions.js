const story = document.querySelector("#scrollStory");
const panels = document.querySelectorAll(".panel");

function clamp(value, min = 0, max = 1) {
    return Math.min(Math.max(value, min), max);
}

function smoothstep(value) {
    return value * value * (3 - 2 * value);
}

function updateScrollStory() {
    if (!story) {
        return;
    }

    const storyRect = story.getBoundingClientRect();
    const scrollableDistance = story.offsetHeight - window.innerHeight;
    const progress = clamp(-storyRect.top / scrollableDistance);

    story.style.setProperty("--progress", progress.toFixed(4));

    panels.forEach((panel) => {
        const start = Number(panel.dataset.start);
        const end = Number(panel.dataset.end);
        const isLastPanel = end === 1;
        const isActive = progress >= start && (isLastPanel ? progress <= end : progress < end);

        if (!isActive) {
            panel.classList.remove("is-visible");
            panel.style.setProperty("--panel-opacity", "0");
            return;
        }

        const localProgress = clamp((progress - start) / (end - start));
        const transitionSize = 0.14;
        const enterProgress = start === 0 ? 1 : smoothstep(clamp(localProgress / transitionSize));
        const exitProgress = smoothstep(clamp((localProgress - (1 - transitionSize)) / transitionSize));
        const opacity = enterProgress * (1 - exitProgress);
        const yPosition = (1 - enterProgress) * 54 - exitProgress * 54;
        const scale = 0.96 + opacity * 0.04;

        panel.classList.toggle("is-visible", opacity > 0.02);
        panel.style.setProperty("--panel-opacity", opacity.toFixed(4));
        panel.style.setProperty("--panel-y", `${yPosition}px`);
        panel.style.setProperty("--panel-scale", scale.toFixed(4));
        panel.style.setProperty("--panel-blur", `${(1 - opacity) * 12}px`);
    });
}

window.addEventListener("scroll", updateScrollStory, { passive: true });
window.addEventListener("resize", updateScrollStory);
updateScrollStory();
