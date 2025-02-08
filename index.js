// initialization

const RESPONSIVE_WIDTH = 1024;

let headerWhiteBg = false;
let isHeaderCollapsed = window.innerWidth < RESPONSIVE_WIDTH;
const collapseBtn = document.getElementById("collapse-btn");
const collapseHeaderItems = document.getElementById("collapsed-header-items");

const navToggles = document.querySelectorAll('[id^="nav-dropdown-toggle"]');
const navDropdowns = document.querySelectorAll('[id^="nav-dropdown-list"]');

function onHeaderClickOutside(e) {
  if (!collapseHeaderItems.contains(e.target)) {
    toggleHeader();
  }
}

function toggleHeader() {
  if (isHeaderCollapsed) {
    // collapseHeaderItems.classList.remove("max-md:tw-opacity-0")
    collapseHeaderItems.classList.add(
      "max-lg:!tw-opacity-100",
      "tw-min-h-[90vh]"
    );
    collapseHeaderItems.style.height = "90vh";
    collapseBtn.classList.remove("bi-list");
    collapseBtn.classList.add("bi-x", "max-lg:tw-fixed");
    isHeaderCollapsed = false;

    document.body.classList.add("modal-open");

    setTimeout(() => window.addEventListener("click", onHeaderClickOutside), 1);
  } else {
    collapseHeaderItems.classList.remove(
      "max-lg:!tw-opacity-100",
      "tw-min-h-[90vh]"
    );
    collapseHeaderItems.style.height = "0vh";

    collapseBtn.classList.remove("bi-x", "max-lg:tw-fixed");

    collapseBtn.classList.add("bi-list");
    document.body.classList.remove("modal-open");

    isHeaderCollapsed = true;
    window.removeEventListener("click", onHeaderClickOutside);
  }
}

function responsive() {
  if (!isHeaderCollapsed) {
    toggleHeader();
  }

  // Remove all existing event listeners first
  navToggles.forEach((toggle, index) => {
    const dropdown = navDropdowns[index];
    toggle.removeEventListener('mouseenter', toggle._openHandler);
    dropdown.removeEventListener('mouseleave', dropdown._closeHandler);
    toggle.removeEventListener('click', toggle._clickHandler);
  });

  if (window.innerWidth > RESPONSIVE_WIDTH) {
    collapseHeaderItems.style.height = "";
    
    // Desktop behavior - hover only
    navToggles.forEach((toggle, index) => {
      const dropdown = navDropdowns[index];
      
      toggle._openHandler = () => openNavDropdown(dropdown);
      dropdown._closeHandler = () => closeNavDropdown(dropdown);
      
      toggle.addEventListener('mouseenter', toggle._openHandler);
      dropdown.addEventListener('mouseleave', dropdown._closeHandler);
    });
  } else {
    // Mobile behavior - click only
    navToggles.forEach((toggle, index) => {
      const dropdown = navDropdowns[index];
      
      toggle._clickHandler = (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleNavDropdown(dropdown);
      };
      
      toggle.addEventListener('click', toggle._clickHandler);
    });
    
    isHeaderCollapsed = true;
  }
}

// Initialize responsive behavior
responsive();
window.addEventListener("resize", responsive);

// Remove initial click handlers since they'll be added in responsive()
navToggles.forEach((toggle) => {
  const oldClickHandler = toggle.getAttribute('onclick');
  if (oldClickHandler) {
    toggle.removeAttribute('onclick');
  }
});

/** Dark and light theme */
if (
  localStorage.getItem("color-mode") === "dark" ||
  (!("color-mode" in localStorage) &&
    window.matchMedia("(prefers-color-scheme: dark)").matches)
) {
  document.documentElement.classList.add("tw-dark");
  updateToggleModeBtn();
} else {
  document.documentElement.classList.remove("tw-dark");
  updateToggleModeBtn();
}

function toggleMode() {
  //toggle between dark and light mode
  document.documentElement.classList.toggle("tw-dark");
  updateToggleModeBtn();
}

function updateToggleModeBtn() {
  const toggleIcon = document.querySelector("#toggle-mode-icon");

  if (document.documentElement.classList.contains("tw-dark")) {
    // dark mode
    toggleIcon.classList.remove("bi-sun");
    toggleIcon.classList.add("bi-moon");
    localStorage.setItem("color-mode", "dark");
  } else {
    toggleIcon.classList.add("bi-sun");
    toggleIcon.classList.remove("bi-moon");
    localStorage.setItem("color-mode", "light");
  }
}

const promptWindow = new Prompt("#pixa-playground");
const promptForm = document.querySelector("#prompt-form");
const promptInput = promptForm.querySelector("input[name='prompt']");

const MAX_PROMPTS = 3;

promptForm.addEventListener("submit", (event) => {
  event.preventDefault();


  if (promptWindow.promptList.length >= MAX_PROMPTS) return false;

  promptWindow.addPrompt(promptInput.value);
  promptInput.value = "";

  if (promptWindow.promptList.length >= MAX_PROMPTS) {
    // prompt signup once the user makes 3 prompts, ideally must be throttled via backend API
    const signUpPrompt = document.querySelector("#signup-prompt");
    signUpPrompt.classList.add("tw-scale-100");
    signUpPrompt.classList.remove("tw-scale-0");

    promptForm.querySelectorAll("input").forEach((e) => {
      e.disabled = true;
    });
  }

  return false;
});

const dropdowns = document.querySelectorAll(".dropdown");
dropdowns.forEach(
  (dropdown) => new Dropdown(`#${dropdown.id}`, promptWindow.setAIModel)
);

function toggleNavDropdown(dropdown) {
  const isOpen = dropdown.getAttribute("data-open") === "true";
  
  // Close all other dropdowns
  navDropdowns.forEach((other) => {
    if (other !== dropdown) {
      closeNavDropdown(other);
    }
  });

  if (isOpen) {
    closeNavDropdown(dropdown);
  } else {
    openNavDropdown(dropdown);
  }
}

function openNavDropdown(dropdown) {
  // Remove any existing classes first
  closeNavDropdown(dropdown);
  
  dropdown.classList.add(
    "tw-opacity-100",
    "tw-scale-100",
    "tw-min-w-[320px]"
  );
  
  if (window.innerWidth <= RESPONSIVE_WIDTH) {
    dropdown.classList.add("max-lg:!tw-h-fit", "max-lg:tw-min-h-[450px]");
  }

  dropdown.setAttribute("data-open", "true");
}

function closeNavDropdown(dropdown) {
  dropdown.classList.remove(
    "tw-opacity-100",
    "tw-scale-100",
    "tw-min-w-[320px]",
    "max-lg:!tw-h-fit",
    "max-lg:tw-min-h-[450px]"
  );

  dropdown.setAttribute("data-open", "false");
}

const videoBg = document.querySelector("#video-container-bg");
const videoContainer = document.querySelector("#video-container");

function openVideo() {
  videoBg.classList.remove("tw-scale-0", "tw-opacity-0");
  videoBg.classList.add("tw-scale-100", "tw-opacity-100");
  videoContainer.classList.remove("tw-scale-0");
  videoContainer.classList.add("tw-scale-100");

  document.body.classList.add("modal-open");
}

function closeVideo() {
  videoContainer.classList.add("tw-scale-0");
  videoContainer.classList.remove("tw-scale-100");

  setTimeout(() => {
    videoBg.classList.remove("tw-scale-100", "tw-opacity-100");
    videoBg.classList.add("tw-scale-0", "tw-opacity-0");
  }, 400);

  document.body.classList.remove("modal-open");
}

/**
 * Animations
 */

const typed = new Typed("#prompts-sample", {
  strings: [
    "How to solve a rubik's cube? Step by step guide",
    "What's Pixa playground?",
    "How to build an AI SaaS App?",
    "How to integrate Pixa API?",
  ],
  typeSpeed: 80,
  smartBackspace: true,
  loop: true,
  backDelay: 2000,
});

gsap.registerPlugin(ScrollTrigger);

gsap.to(".reveal-up", {
  opacity: 0,
  y: "100%",
});

// straightens the slanting image
gsap.to("#dashboard", {
  scale: 1,
  translateY: 0,
  // translateY: "0%",
  rotateX: "0deg",
  scrollTrigger: {
    trigger: "#hero-section",
    start: window.innerWidth > RESPONSIVE_WIDTH ? "top 95%" : "top 70%",
    end: "bottom bottom",
    scrub: 1,
    // markers: true,
  },
});

// FAQ Accordion functionality
// document.addEventListener("DOMContentLoaded", () => {
//   const accordions = document.querySelectorAll(".faq-accordion");

//   accordions.forEach((accordion) => {
//     accordion.addEventListener("click", function () {
//       // Toggle active class on the accordion
//       this.classList.toggle("active");

//       // Get the content panel and icon
//       const panel = this.nextElementSibling;
//       const icon = this.querySelector(".bi-plus");

//       // Toggle panel visibility
//       if (this.classList.contains("active")) {
//         // Open this panel
//         panel.style.display = "block";
//         icon.style.transform = "rotate(45deg)";
//       } else {
//         // Close this panel
//         panel.style.display = "none";
//         icon.style.transform = "rotate(0deg)";
//       }

//       // Close other panels
//       accordions.forEach((otherAccordion) => {
//         if (otherAccordion !== this) {
//           otherAccordion.classList.remove("active");
//           const otherPanel = otherAccordion.nextElementSibling;
//           const otherIcon = otherAccordion.querySelector(".bi-plus");
//           otherPanel.style.display = "none";
//           otherIcon.style.transform = "rotate(0deg)";
//         }
//       });
//     });

//     // Initially hide all panels
//     const panel = accordion.nextElementSibling;
//     panel.style.display = "none";
//   });
// });

// // ------------- reveal section animations ---------------

// const sections = gsap.utils.toArray("section");

// sections.forEach((sec) => {
//   const revealUptimeline = gsap.timeline({
//     paused: true,
//     scrollTrigger: {
//       trigger: sec,
//       start: "10% 80%", // top of trigger hits the top of viewport
//       end: "20% 90%",
//       // markers: true,
//       // scrub: 1,
//     },
//   });

//   revealUptimeline.to(sec.querySelectorAll(".reveal-up"), {
//     opacity: 1,
//     duration: 0.8,
//     y: "0%",
//     stagger: 0.2,
//   });
// });

// // Add this at the global scope
// window.toggleFaq = function (element) {
//   // Get the content element
//   const content = element.nextElementSibling;
//   const icon = element.querySelector(".bi-plus");

//   // Close all other FAQs
//   document.querySelectorAll(".faq-content").forEach((item) => {
//     if (item !== content && !item.classList.contains("tw-hidden")) {
//       item.classList.add("tw-hidden");
//       const otherIcon = item.previousElementSibling.querySelector(".bi-plus");
//       if (otherIcon) {
//         otherIcon.style.transform = "rotate(0deg)";
//       }
//     }
//   });



  // Toggle current FAQ
  content.classList.toggle("tw-hidden");
  icon.style.transform = content.classList.contains("tw-hidden")
    ? "rotate(0deg)"
    : "rotate(45deg)";
};

// Add click handlers for mobile
navToggles.forEach((toggle, index) => {
  const dropdown = navDropdowns[index];
  toggle.addEventListener('click', () => {
    if (window.innerWidth <= RESPONSIVE_WIDTH) {
      toggleNavDropdown(dropdown);
    }
  });
});
