// DOM loaded event
document.addEventListener("DOMContentLoaded", function () {
  // Initialize countdown
  initCountdown();

  // Initialize smooth scrolling
  initSmoothScrolling();

  // Initialize mobile navigation
  initMobileNav();

  // Initialize RSVP form
  initRSVPForm();

  // Initialize parallax effect
  initParallaxEffect();

  // Initialize wedding music
  initWeddingMusic();

  // Initialize hero slider
  initHeroSlider();

  // Initialize scroll animations
  initScrollAnimations();

  // Tự cuộn xuống khi khách đứng yên ở ảnh bìa
  initHeroAutoScroll();
});

// Countdown Timer (config-loader gọi lại hàm này với ngày trong wedding-config.json)
function initCountdown(dateTime = "2026-11-15T09:00:00") {
  const weddingDate = new Date(dateTime).getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    if (distance < 0) {
      clearInterval(window.countdownInterval);
      document.getElementById("countdown").innerHTML =
        '<h3 class="countdown-done"> 💕</h3>';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("days").textContent = days
      .toString()
      .padStart(2, "0");
    document.getElementById("hours").textContent = hours
      .toString()
      .padStart(2, "0");
    document.getElementById("minutes").textContent = minutes
      .toString()
      .padStart(2, "0");
    document.getElementById("seconds").textContent = seconds
      .toString()
      .padStart(2, "0");
  }

  clearInterval(window.countdownInterval);
  updateCountdown();
  window.countdownInterval = setInterval(updateCountdown, 1000);
}

// Khách đứng ở ảnh bìa quá 8 giây mà chưa cuộn -> tự cuộn xuống phần tiếp theo (chỉ một lần)
function initHeroAutoScroll() {
  const IDLE_MS = 5000;
  const hero = document.getElementById("home");
  const next = hero && hero.nextElementSibling;
  if (!next) return;

  let timer = null;
  const userEvents = ["scroll", "wheel", "touchstart", "keydown"];

  function scrollToNext() {
    const navbar = document.querySelector(".navbar");
    const offset = navbar ? navbar.offsetHeight : 0;
    window.scrollTo({ top: next.offsetTop - offset, behavior: "smooth" });
  }

  // Mũi tên ở ảnh bìa: bấm để cuộn xuống
  const scrollDownBtn = hero.querySelector(".scroll-down");
  if (scrollDownBtn) {
    scrollDownBtn.addEventListener("click", () => {
      stop();
      scrollToNext();
    });
  }

  function stop() {
    clearTimeout(timer);
    userEvents.forEach((evt) =>
      window.removeEventListener(evt, onUserActivity),
    );
  }

  function onUserActivity() {
    // Khách đã tự cuộn khỏi ảnh bìa -> không tự cuộn nữa
    if (window.scrollY > 50) {
      stop();
      return;
    }
    restart();
  }

  function restart() {
    clearTimeout(timer);
    timer = setTimeout(() => {
      stop();
      if (window.scrollY > 50) return;
      scrollToNext();
    }, IDLE_MS);
  }

  userEvents.forEach((evt) =>
    window.addEventListener(evt, onUserActivity, { passive: true }),
  );
  restart();
}

// Smooth Scrolling for Navigation
function initSmoothScrolling() {
  const navLinks = document.querySelectorAll('a[href^="#"]');

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
}

// Mobile Navigation
function initMobileNav() {
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector(".nav-menu");
  const navLinks = document.querySelectorAll(".nav-menu a");

  if (hamburger && navMenu) {
    // Toggle menu khi click hamburger
    hamburger.addEventListener("click", function () {
      navMenu.classList.toggle("active");
    });

    // Đóng menu khi click vào link trên mobile
    navLinks.forEach((link) => {
      link.addEventListener("click", function () {
        // Chỉ đóng menu nếu đang ở mobile mode (menu đang active)
        if (navMenu.classList.contains("active")) {
          navMenu.classList.remove("active");
        }
      });
    });

    // Đóng menu khi click outside
    document.addEventListener("click", function (event) {
      const isClickInsideNav =
        navMenu.contains(event.target) || hamburger.contains(event.target);

      if (!isClickInsideNav && navMenu.classList.contains("active")) {
        navMenu.classList.remove("active");
      }
    });
  }
}

// Hero Slider với hỗ trợ desktop và mobile
let currentHeroIndex = 0;
let heroSlides = null;
let heroDots = null;

// Function để lấy active hero slider dựa trên screen size
function getActiveHeroSlider() {
  const isMobile = window.innerWidth <= 768;
  const mobileSlider = document.querySelector(".hero-slider-mobile");
  const desktopSlider = document.querySelector(".hero-slider-desktop");

  if (isMobile && mobileSlider) {
    return mobileSlider;
  } else if (!isMobile && desktopSlider) {
    return desktopSlider;
  }

  // Fallback: return any available slider
  return mobileSlider || desktopSlider;
}

// Function để update hero slider elements
function updateHeroSliderElements() {
  const activeSlider = getActiveHeroSlider();
  console.log(
    "Active slider:",
    activeSlider ? activeSlider.className : "none found",
  );

  if (activeSlider) {
    heroSlides = activeSlider.querySelectorAll(".hero-slide");
    heroDots = document.querySelectorAll(".hero-dot");

    console.log(
      "Found",
      heroSlides.length,
      "slides and",
      heroDots.length,
      "dots",
    );

    // Reset current index if needed
    if (currentHeroIndex >= heroSlides.length) {
      currentHeroIndex = 0;
    }
  } else {
    console.warn("No active hero slider found");
    heroSlides = null;
    heroDots = null;
  }
}

function showHeroSlide(index) {
  // Update elements nếu cần
  if (!heroSlides || heroSlides.length === 0) {
    updateHeroSliderElements();
  }

  if (!heroSlides || heroSlides.length === 0) {
    console.warn("No hero slides available to show");
    return;
  }

  // Validate index
  if (index < 0 || index >= heroSlides.length) {
    console.warn("Invalid slide index:", index);
    return;
  }

  // Hide all hero slides in current active slider
  heroSlides.forEach((slide) => slide.classList.remove("active"));

  // Hide all dots
  if (heroDots) {
    heroDots.forEach((dot) => dot.classList.remove("active"));
  }

  // Show current hero slide
  if (heroSlides[index]) {
    heroSlides[index].classList.add("active");
    if (heroDots && heroDots[index]) {
      heroDots[index].classList.add("active");
    }
  }
}

function changeHeroSlide(direction) {
  // Ensure elements are updated
  updateHeroSliderElements();

  if (!heroSlides || heroSlides.length === 0) {
    console.warn("No hero slides found");
    return;
  }

  currentHeroIndex += direction;
  if (currentHeroIndex >= heroSlides.length) {
    currentHeroIndex = 0;
  } else if (currentHeroIndex < 0) {
    currentHeroIndex = heroSlides.length - 1;
  }

  showHeroSlide(currentHeroIndex);
}

function currentHeroSlide(index) {
  // Ensure elements are updated
  updateHeroSliderElements();

  if (!heroSlides || heroSlides.length === 0) {
    console.warn("No hero slides found");
    return;
  }

  currentHeroIndex = index - 1;
  // Validate index bounds
  if (currentHeroIndex < 0) {
    currentHeroIndex = 0;
  } else if (currentHeroIndex >= heroSlides.length) {
    currentHeroIndex = heroSlides.length - 1;
  }

  showHeroSlide(currentHeroIndex);
}

// Initialize Hero Slider với hỗ trợ responsive
function initHeroSlider() {
  console.log("Initializing hero slider...");

  // Update elements khi khởi tạo
  updateHeroSliderElements();

  // Initialize first slide
  showHeroSlide(0);

  // Make functions globally available for onclick handlers
  window.changeHeroSlide = changeHeroSlide;
  window.currentHeroSlide = currentHeroSlide;

  // Auto-change hero slide every 7 seconds - only start after initialization
  let autoSlideInterval = setInterval(function () {
    if (heroSlides && heroSlides.length > 0) {
      changeHeroSlide(1);
    }
  }, 7000);

  // Listen for window resize để update slider khi chuyển device
  window.addEventListener("resize", function () {
    clearTimeout(this.resizeTimer);
    this.resizeTimer = setTimeout(() => {
      const prevSlideCount = heroSlides ? heroSlides.length : 0;
      updateHeroSliderElements();
      const newSlideCount = heroSlides ? heroSlides.length : 0;

      // If slide count changed, reset to first slide
      if (prevSlideCount !== newSlideCount) {
        currentHeroIndex = 0;
      }

      showHeroSlide(currentHeroIndex);
    }, 250);
  });

  // Ensure proper cleanup on page unload
  window.addEventListener("beforeunload", function () {
    if (autoSlideInterval) {
      clearInterval(autoSlideInterval);
    }
  });

  console.log(
    "Hero slider initialized with",
    heroSlides ? heroSlides.length : 0,
    "slides",
  );
}

// Parallax Effect
function initParallaxEffect() {
  window.addEventListener("scroll", function () {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector(".hero");
    if (!hero || scrolled > hero.offsetHeight) return;

    // Chỉ dịch ảnh nền bên trong khung (hero có overflow: hidden),
    // không dịch cả khung để tránh hở khoảng trống với phần bên dưới
    hero.querySelectorAll(".hero-slider").forEach((slider) => {
      slider.style.transform = `translateY(${scrolled * 0.4}px)`;
    });
  });
}

// RSVP Form Handling
function initRSVPForm() {
  const rsvpForm = document.getElementById("rsvpForm");

  if (rsvpForm) {
    rsvpForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Get form data
      const formData = new FormData(this);
      const data = {};

      for (let [key, value] of formData.entries()) {
        data[key] = value;
      }

      // Basic validation
      if (!data.guestName || !data.attendance) {
        alert("Vui lòng điền đầy đủ thông tin bắt buộc.");
        return;
      }

      // Simulate form submission
      submitRSVP(data);
    });
  }
}

// RSVP Submission (placeholder for actual implementation)
function submitRSVP(data) {
  // Show loading state
  const submitBtn = document.querySelector(".submit-btn");
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang gửi...';
  submitBtn.disabled = true;

  // Simulate API call
  setTimeout(function () {
    // Success message
    alert(
      "Cảm ơn bạn đã xác nhận tham dự! Chúng tôi rất mong được gặp bạn trong ngày trọng đại.",
    );

    // Reset form
    document.getElementById("rsvpForm").reset();

    // Reset button
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;

    // Log data (for debugging)
    console.log("RSVP Data:", data);

    // Gửi data lên Google Sheets
    sendToGoogleSheets(data);
  }, 2000);
}

// Google Sheets Integration
function sendToGoogleSheets(data) {
  // Thay YOUR_GOOGLE_APPS_SCRIPT_URL bằng URL thực từ Apps Script deployment
  const scriptURL =
    ""; // TODO: dán link Google Apps Script của bạn khi bật lại phần RSVP

  // Map dữ liệu từ form fields sang format mong đợi
  const mappedData = {
    name: data.guestName || "",
    email: data.guestEmail || "",
    phone: data.guestPhone || "",
    attendance:
      data.attendance === "yes"
        ? "Có, tôi sẽ tham dự"
        : data.attendance === "no"
          ? "Rất tiếc, tôi không thể tham dự"
          : data.attendance || "",
    guests: data.guestCount || 1,
    message: data.message || "",
  };

  // Hiển thị loading
  console.log("📤 Sending RSVP to Google Sheets...");
  console.log("📋 Original data:", data);
  console.log("📋 Mapped data:", mappedData);

  fetch(scriptURL, {
    method: "POST",
    mode: "no-cors", // Google Apps Script yêu cầu no-cors
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(mappedData),
  })
    .then(() => {
      // No-cors mode không thể đọc response, nhưng request đã được gửi
      console.log("✅ Lời chúc đã được gửi");
      showToastMessage(
        "Cảm ơn bạn! Thông tin đã được lưu vào Google Sheets 💕",
        "success",
      );
    })
    .catch((error) => {
      console.error("❌ Error sending to Google Sheets:", error);
      showToastMessage("Có lỗi xảy ra, vui lòng thử lại sau.", "error");
    });
}

// Hiển thị toast notification
function showToastMessage(message, type = "success") {
  const isSuccess = type === "success";
  const bgColor = isSuccess
    ? "linear-gradient(45deg, #28a745, #20c997)"
    : "linear-gradient(45deg, #dc3545, #e74c3c)";
  const icon = isSuccess ? "fa-check-circle" : "fa-exclamation-circle";

  const toast = document.createElement("div");
  toast.innerHTML = `
        <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${bgColor};
            color: white;
            padding: 15px 20px;
            border-radius: 12px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.15);
            z-index: 9999;
            font-family: var(--font-primary);
            font-size: 14px;
            max-width: 350px;
            animation: slideInRight 0.5s ease-out;
        ">
            <i class="fas ${icon}" style="margin-right: 10px; font-size: 16px;"></i>
            ${message}
        </div>
    `;

  // Thêm CSS animation nếu chưa có
  if (!document.querySelector("#toast-animation-style")) {
    const style = document.createElement("style");
    style.id = "toast-animation-style";
    style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
    document.head.appendChild(style);
  }

  document.body.appendChild(toast);

  // Auto remove sau 5 giây
  setTimeout(() => {
    if (toast.parentNode) {
      toast.style.animation = "slideInRight 0.5s ease-out reverse";
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 500);
    }
  }, 5000);
}

// Animation on Scroll
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-in");
      }
    });
  }, observerOptions);

  // Observe sections for animation
  const sections = document.querySelectorAll("section");
  sections.forEach((section) => {
    observer.observe(section);
  });
}

// Utility Functions
function formatDate(date) {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return date.toLocaleDateString("vi-VN", options);
}

// Social Media Sharing
function shareOnFacebook() {
  const url = encodeURIComponent(window.location.href);
  const text = encodeURIComponent(" Hãy tham dự đám cưới của chúng tôi.");
  window.open(
    `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`,
    "_blank",
  );
}

function shareOnTwitter() {
  const url = encodeURIComponent(window.location.href);
  const text = encodeURIComponent(" 💕");
  window.open(
    `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
    "_blank",
  );
}

// Error Handling for Images
function handleImageError() {
  const images = document.querySelectorAll("img");

  images.forEach((img) => {
    img.addEventListener("error", function () {
      // Replace with placeholder if image fails to load
      this.src =
        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4gPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2RkZCIvPiA8dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1zaXplPSIxOCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iIGZpbGw9IiM5OTkiPkltYWdlPC90ZXh0Pjwvc3ZnPg==";
      this.alt = "Placeholder Image";
    });
  });
}

// Wedding Music Control
function initWeddingMusic() {
  const musicToggle = document.getElementById("musicToggle");
  const weddingMusic = document.getElementById("weddingMusic");
  const musicIcon = musicToggle.querySelector("i");
  const unlockEvents = ["pointerdown", "touchend", "click", "keydown"];

  // Khách đã chủ động tắt nhạc thì không tự bật lại
  let userMuted = false;

  weddingMusic.volume = 0.3;

  // Nhạc bắt đầu từ giây data-start (đặt trong config: musicSettings.startTime)
  const getStartTime = () => Number(weddingMusic.dataset.start) || 0;

  function seekToStart() {
    const start = getStartTime();
    if (weddingMusic.duration && start >= weddingMusic.duration) return;
    weddingMusic.currentTime = start;
  }

  // Tua tới giây bắt đầu mỗi khi nhạc được tải (kể cả khi config đổi file)
  if (weddingMusic.readyState >= 1) seekToStart();
  weddingMusic.addEventListener("loadedmetadata", seekToStart);

  // Tự lặp lại nhưng quay về giây bắt đầu, không về 0:00
  weddingMusic.addEventListener("ended", () => {
    seekToStart();
    weddingMusic.play().catch(() => {});
  });

  // Giao diện nút luôn theo trạng thái thật của audio
  function updateButton() {
    const on = !weddingMusic.paused && !weddingMusic.muted;
    musicToggle.classList.toggle("playing", on);
    musicToggle.classList.toggle("muted", !on);
    musicIcon.classList.toggle("fa-volume-up", on);
    musicIcon.classList.toggle("fa-volume-mute", !on);
  }

  function playWithSound() {
    weddingMusic.muted = false;
    return weddingMusic.play();
  }

  function removeUnlockListeners() {
    unlockEvents.forEach((evt) =>
      document.removeEventListener(evt, unlockAudio, true),
    );
  }

  // Lần tương tác đầu tiên của khách: bật tiếng
  function unlockAudio(e) {
    if (musicToggle.contains(e.target) || userMuted) return; // Nút loa tự xử lý
    playWithSound()
      .then(removeUnlockListeners)
      .catch(() => {});
  }

  // Tự động phát khi vào trang. Nếu trình duyệt chặn phát có tiếng,
  // phát ở chế độ tắt tiếng và bật tiếng ngay khi khách chạm/bấm vào trang
  function autoPlay() {
    playWithSound()
      .then(removeUnlockListeners)
      .catch(() => {
        weddingMusic.muted = true;
        weddingMusic.play().catch(() => {});
        updateButton();
      });
  }

  musicToggle.addEventListener("click", function () {
    const on = !weddingMusic.paused && !weddingMusic.muted;
    if (on) {
      userMuted = true;
      weddingMusic.pause();
    } else {
      userMuted = false;
      removeUnlockListeners();
      playWithSound().catch((error) =>
        console.log("Không thể phát nhạc:", error),
      );
    }
  });

  ["play", "pause", "volumechange"].forEach((evt) =>
    weddingMusic.addEventListener(evt, updateButton),
  );

  weddingMusic.addEventListener(
    "error",
    function () {
      console.log("Lỗi khi tải nhạc cưới");
    },
    true,
  );

  unlockEvents.forEach((evt) =>
    document.addEventListener(evt, unlockAudio, true),
  );
  updateButton();
  autoPlay();
}

// Hearts animation
function createFloatingHearts() {
  const heartsContainer = document.createElement("div");
  heartsContainer.className = "floating-hearts";
  heartsContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 10;
        overflow: hidden;
    `;
  document.body.appendChild(heartsContainer);

  function createHeart() {
    const heart = document.createElement("div");
    heart.innerHTML = "💕 💕";
    heart.style.cssText = `
            position: absolute;
            font-size: ${Math.random() * 20 + 15}px;
            opacity: ${Math.random() * 0.5 + 0.3};
            animation: floatUp ${Math.random() * 3 + 4}s linear infinite;
            left: ${Math.random() * 100}%;
            top: 100%;
        `;

    heartsContainer.appendChild(heart);

    setTimeout(() => {
      if (heart.parentNode) {
        heart.parentNode.removeChild(heart);
      }
    }, 7000);
  }

  // Create hearts periodically
  setInterval(createHeart, 500);
}

// Add CSS for floating hearts animation
const heartStyle = document.createElement("style");
heartStyle.textContent = `
    @keyframes floatUp {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0.7;
        }
        100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(heartStyle);

// Initialize advanced features
document.addEventListener("DOMContentLoaded", function () {
  setTimeout(createFloatingHearts, 2000); // Start hearts after 2 seconds
});

// Copy account information function
function copyAccountInfo(type) {
  let accountInfo = "";

  if (type === "bride") {
    const bankName = document.querySelector(
      ".bride-banking .bank-name",
    ).textContent;
    const accountNumber = document.querySelector(
      ".bride-banking .account-number",
    ).textContent;
    const accountName = document.querySelector(
      ".bride-banking .account-name",
    ).textContent;

    accountInfo = `Ngân hàng: ${bankName}\nSố tài khoản: ${accountNumber}\nTên tài khoản: ${accountName}`;
  } else if (type === "groom") {
    const bankName = document.querySelector(
      ".groom-banking .bank-name",
    ).textContent;
    const accountNumber = document.querySelector(
      ".groom-banking .account-number",
    ).textContent;
    const accountName = document.querySelector(
      ".groom-banking .account-name",
    ).textContent;

    accountInfo = `Ngân hàng: ${bankName}\nSố tài khoản: ${accountNumber}\nTên tài khoản: ${accountName}`;
  }

  // Copy to clipboard
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard
      .writeText(accountInfo)
      .then(() => {
        showCopySuccess(type);
      })
      .catch((err) => {
        fallbackCopyTextToClipboard(accountInfo, type);
      });
  } else {
    fallbackCopyTextToClipboard(accountInfo, type);
  }
}

// Fallback copy function for older browsers
function fallbackCopyTextToClipboard(text, type) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    const successful = document.execCommand("copy");
    if (successful) {
      showCopySuccess(type);
    } else {
      showCopyError();
    }
  } catch (err) {
    showCopyError();
  }

  document.body.removeChild(textArea);
}

// Show copy success message
function showCopySuccess(type) {
  const button = document.querySelector(`.${type}-banking .copy-btn`);
  const originalText = button.innerHTML;

  button.innerHTML = '<i class="fas fa-check"></i> Đã sao chép!';
  button.style.background = "linear-gradient(45deg, #28a745, #20c997)";

  setTimeout(() => {
    button.innerHTML = originalText;
    button.style.background = "linear-gradient(45deg, #a64d5f, #d49aa4)";
  }, 2000);
}

// Show copy error message
function showCopyError() {
  alert("Không thể sao chép tự động. Vui lòng sao chép thông tin thủ công.");
}

// Initialize error handling when DOM is loaded
document.addEventListener("DOMContentLoaded", handleImageError);

// Scroll animations for couple section
function initScrollAnimations() {
  // Create intersection observer
  const observerOptions = {
    threshold: 0.2, // Trigger when 20% of element is visible
    rootMargin: "0px 0px -50px 0px", // Start animation slightly before element comes into view
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Add animation class when element comes into view
        entry.target.classList.add("animate");

        // Chỉ chạy hiệu ứng một lần để nội dung không bị ẩn lại khi cuộn qua
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all elements with animate-on-scroll class
  const animatedElements = document.querySelectorAll(".animate-on-scroll");
  animatedElements.forEach((element) => {
    observer.observe(element);
  });

  // Alternative: Simple scroll event listener (fallback for older browsers)
  window.addEventListener("scroll", throttle(checkScrollAnimations, 100));
}

// Throttle function to improve performance
function throttle(func, limit) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Check scroll animations (fallback function)
function checkScrollAnimations() {
  const animatedElements = document.querySelectorAll(".animate-on-scroll");
  const windowHeight = window.innerHeight;

  animatedElements.forEach((element) => {
    const elementTop = element.getBoundingClientRect().top;
    const elementBottom = element.getBoundingClientRect().bottom;

    // Check if element is in viewport
    if (elementTop < windowHeight * 0.8 && elementBottom > 0) {
      element.classList.add("animate");
    }
  });
}
