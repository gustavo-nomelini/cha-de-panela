document.addEventListener("DOMContentLoaded", function () {
  // Add meta description and title dynamically based on viewport
  if (window.innerWidth <= 768) {
    document.querySelector('meta[name="description"]').setAttribute('content', 
      'Chá de Panela de Gus & Jess (Mobile) - Evento em 19/04/2025. Confirme sua presença!');
  }
  
  // Check for support of the Performance API and send metrics
  if ('performance' in window && 'PerformanceObserver' in window) {
    // Create performance observer to track page load metrics
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        // Log or send these metrics to your analytics
        console.log(`${entry.name}: ${entry.startTime.toFixed(0)}ms`);
      });
    });
    
    // Observe different performance metrics
    observer.observe({entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift']});
  }

  // Check and apply CORS headers dynamically if needed
  function applyCorsIfNeeded() {
    const originUrl = window.location.origin;
    
    // Only apply CORS for cross-domain requests
    if (document.domain !== window.location.hostname) {
      console.log("Cross-domain detected, CORS headers should be properly set on the server");
    }
  }
  applyCorsIfNeeded();
  
  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: "smooth",
        });
      }
    });
  });

  // Carousel functionality - improved version
  initCarousel();

  function initCarousel() {
    const carouselContainer = document.getElementById("carousel-slides");
    const indicators = document.querySelectorAll(".carousel-indicator");
    
    // Check if carousel elements exist before initializing
    if (!carouselContainer || indicators.length === 0) {
      console.warn("Carousel elements not found");
      return;
    }
    
    let currentSlide = 0;
    let autoSlideInterval;
    let isTransitioning = false;
    
    // Detect if user is on mobile
    const isMobile = window.innerWidth <= 768;
    
    // Adjust timings based on device
    const transitionDuration = isMobile ? 800 : 800; // milliseconds
    const slideInterval = isMobile ? 8000 : 6000; // milliseconds
    
    // Function to show specific slide with smoother transition
    function showSlide(index) {
      if (isTransitioning) return; // Prevent rapid transitions
      isTransitioning = true;
      
      // Update slides position
      carouselContainer.style.transform = `translateX(-${index * 16.666}%)`;
      
      // Update indicators
      indicators.forEach(dot => dot.classList.remove('active'));
      indicators[index].classList.add('active');
      
      // Update current slide index
      currentSlide = index;
      
      // Reset transition flag after animation completes
      setTimeout(() => {
        isTransitioning = false;
      }, transitionDuration);
    }

    // Initialize carousel and set first slide as active
    showSlide(0);

    // Add click event to each indicator with debounce
    indicators.forEach(indicator => {
      indicator.addEventListener('click', function() {
        if (isTransitioning) return;
        
        const slideIndex = parseInt(this.getAttribute('data-index'));
        showSlide(slideIndex);
        resetAutoSlide();
      });
    });

    // Add touch swipe capability
    let touchStartX = 0;
    let touchEndX = 0;
    
    const carousel = document.querySelector('.carousel');
    
    carousel.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    carousel.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
      const swipeThreshold = 50;
      if (isTransitioning) return;
      
      if (touchEndX < touchStartX - swipeThreshold) {
        // Swipe left - next slide
        const nextSlide = (currentSlide + 1) % indicators.length;
        showSlide(nextSlide);
        resetAutoSlide();
      }
      
      if (touchEndX > touchStartX + swipeThreshold) {
        // Swipe right - previous slide
        const prevSlide = (currentSlide - 1 + indicators.length) % indicators.length;
        showSlide(prevSlide);
        resetAutoSlide();
      }
    }

    // Auto slide functionality with improved timing
    function startAutoSlide() {
      // Clear any existing interval first to prevent multiple intervals
      clearInterval(autoSlideInterval);
      
      autoSlideInterval = setInterval(() => {
        if (!document.hidden) {  // Only advance slides if page is visible
          const nextSlide = (currentSlide + 1) % indicators.length;
          showSlide(nextSlide);
        }
      }, slideInterval);
      
      console.log("Auto slide started"); // Debug message
    }

    // Reset auto slide timer when manually changing slides
    function resetAutoSlide() {
      clearInterval(autoSlideInterval);
      startAutoSlide();
    }

    // Start auto sliding immediately
    startAutoSlide();

    // Pause auto slide when hovering over carousel
    carousel.addEventListener('mouseenter', () => {
      clearInterval(autoSlideInterval);
    });
    
    carousel.addEventListener('mouseleave', () => {
      startAutoSlide();
    });
    
    // Handle visibility change
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        clearInterval(autoSlideInterval);
      } else {
        startAutoSlide();
      }
    });
    
    // Prevent rapid sliding with keyboard navigation
    carousel.setAttribute('tabindex', '0');
    carousel.addEventListener('keydown', (e) => {
      if (isTransitioning) return;
      
      if (e.key === 'ArrowRight') {
        const nextSlide = (currentSlide + 1) % indicators.length;
        showSlide(nextSlide);
        resetAutoSlide();
      }
      
      if (e.key === 'ArrowLeft') {
        const prevSlide = (currentSlide - 1 + indicators.length) % indicators.length;
        showSlide(prevSlide);
        resetAutoSlide();
      }
    });
    
    // Handle window resize to adjust carousel behavior
    window.addEventListener('resize', () => {
      const newIsMobile = window.innerWidth <= 768;
      if (newIsMobile !== isMobile) {
        // Restart carousel if device type changed
        clearInterval(autoSlideInterval);
        startAutoSlide();
      }
    });
  }

  // Form handling com integração Google Forms
  const form = document.getElementById("rsvp-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const name = document.getElementById("name").value;
      const guests = document.getElementById("guests").value;

      // Validação do formulário
      if (!name || !guests) {
        showNotification(
          "Por favor, preencha todos os campos obrigatórios",
          "error",
        );
        return;
      }

      // Add CORS headers to the form submission
      const headers = new Headers({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Access-Control-Allow-Origin': '*'
      });

      // Mostrar feedback para o usuário
      showNotification(`Processando sua confirmação, ${name}...`, "info");

      // Substituir com o ID real do seu formulário Google
      const formId = "1FAIpQLScTgMkGKFWLJPrj1aOwLnyvAd_7b1LV4fGq1XA8EBYxR14tZA";

      // Substituir com os IDs reais dos seus campos
      const nameFieldId = "494432199";
      const guestsFieldId = "1498135098";

      // Try fetch API first (with CORS support) before falling back to the iframe method
      const formData = new URLSearchParams();
      formData.append(`entry.${nameFieldId}`, name);
      formData.append(`entry.${guestsFieldId}`, guests);
      
      // Try the fetch method with proper CORS headers
      fetch(`https://docs.google.com/forms/d/e/${formId}/formResponse`, {
        method: 'POST',
        mode: 'no-cors', // This is important for Google Forms
        headers: headers,
        body: formData,
      })
      .then(() => {
        showNotification(
          `Obrigado, ${name}! Sua presença foi confirmada com ${guests} acompanhante(s).`,
          "success"
        );
        form.reset();
      })
      .catch(error => {
        console.log("Fetch failed, falling back to form submission method", error);
        
        // Fallback to the iframe method
        // Criar um formulário dinâmico e enviá-lo diretamente
        const dynamicForm = document.createElement("form");
        dynamicForm.action = `https://docs.google.com/forms/d/e/${formId}/formResponse`;
        dynamicForm.method = "POST";
        dynamicForm.target = "_blank"; 
        dynamicForm.style.display = "none";

        // Criar campos para os dados
        const nameInput = document.createElement("input");
        nameInput.type = "text";
        nameInput.name = `entry.${nameFieldId}`;
        nameInput.value = name;
        dynamicForm.appendChild(nameInput);

        const guestsInput = document.createElement("input");
        guestsInput.type = "text";
        guestsInput.name = `entry.${guestsFieldId}`;
        guestsInput.value = guests;
        dynamicForm.appendChild(guestsInput);

        // Adicionar ao documento e enviar
        document.body.appendChild(dynamicForm);

        // Criar iframe para capturar o resultado
        const resultFrame = document.createElement("iframe");
        resultFrame.name = "_blank";
        resultFrame.style.display = "none";
        document.body.appendChild(resultFrame);

        // Enviar o formulário
        dynamicForm.submit();

        // Remover o formulário e o iframe após o envio
        setTimeout(() => {
          document.body.removeChild(dynamicForm);
          document.body.removeChild(resultFrame);

          // Mostrar mensagem de confirmação
          showNotification(
            `Obrigado, ${name}! Sua presença foi confirmada com ${guests} acompanhante(s).`,
            "success",
          );
          form.reset();
        }, 2000);
      });
    });
  }

  // Notification system - FUNÇÃO ÚNICA
  function showNotification(message, type = "success") {
    // Remove qualquer notificação existente primeiro
    const existingNotifications = document.querySelectorAll(".notification");
    existingNotifications.forEach((notification) => {
      document.body.removeChild(notification);
    });

    const notificationEl = document.createElement("div");
    notificationEl.className = `fixed top-4 right-4 rounded-lg p-4 shadow-lg z-50 transition-opacity duration-500 notification ${type === "success"
      ? "bg-green-100 text-green-800"
      : type === "error"
        ? "bg-red-100 text-red-800"
        : "bg-blue-100 text-blue-800"
      }`;
    notificationEl.textContent = message;

    document.body.appendChild(notificationEl);

    // Remove notification after 5 seconds
    setTimeout(() => {
      notificationEl.style.opacity = "0";
      setTimeout(() => {
        if (document.body.contains(notificationEl)) {
          document.body.removeChild(notificationEl);
        }
      }, 500);
    }, 5000);
  }

  // Add a countdown timer to the event
  const eventDate = new Date("April 19, 2025 15:00:00").getTime();

  // Update both countdowns
  function updateCountdown() {
    const now = new Date().getTime();
    const distance = eventDate - now;

    if (distance < 0) {
      if (document.getElementById("countdown")) {
        document.getElementById("countdown").innerHTML =
          "<p class='text-tea-dark text-center text-xl'>O evento está acontecendo agora!</p>";
      }
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Update main countdown
    if (
      document.getElementById("days") &&
      document.getElementById("hours") &&
      document.getElementById("minutes") &&
      document.getElementById("seconds")
    ) {
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
  }

  // Initialize countdown
  updateCountdown();
  // Update countdown every second
  setInterval(updateCountdown, 1000);

  // Add SEO-friendly image alt text to all images dynamically
  document.querySelectorAll('img').forEach(img => {
    if (!img.alt || img.alt === '') {
      // Get image filename as fallback alt text
      const imgSrc = img.src;
      const imgName = imgSrc.substring(imgSrc.lastIndexOf('/') + 1, imgSrc.lastIndexOf('.'));
      img.alt = `Imagem: ${imgName.replace(/-/g, ' ')}`;
    }
    
    // Add lazy loading if not already present
    if (!img.hasAttribute('loading')) {
      img.setAttribute('loading', 'lazy');
    }
    
    // Add width and height if missing (helps with CLS)
    if (!img.hasAttribute('width') && !img.hasAttribute('height')) {
      img.addEventListener('load', function() {
        if (!this.hasAttribute('width')) {
          this.setAttribute('width', this.naturalWidth);
        }
        if (!this.hasAttribute('height')) {
          this.setAttribute('height', this.naturalHeight);
        }
      });
    }
  });

  // Add animation to elements when they come into view
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-fade-in");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
    },
  );

  // Observe all sections
  document.querySelectorAll("section > div").forEach((section) => {
    section.classList.add("opacity-0", "transition-opacity", "duration-1000");
    observer.observe(section);
  });

  // Copy PIX key functionality
  const copyPixKeyButton = document.getElementById('copy-pix-key');
  if (copyPixKeyButton) {
    copyPixKeyButton.addEventListener('click', function() {
      const pixKey = "00020126590014br.gov.bcb.pix0111327500098550222Cha de Panela Gus&Jess5204000053039865802BR5922GUSTAVO LOPES NOMELINI6008CASCAVEL62150511ChaDePanela6304E6A1";
      
      // Use the Clipboard API to copy the text
      navigator.clipboard.writeText(pixKey).then(function() {
        // Show confirmation
        const confirmationElement = document.getElementById('copy-confirmation');
        if (confirmationElement) {
          confirmationElement.style.opacity = '1';
          
          // Hide confirmation after 3 seconds
          setTimeout(function() {
            confirmationElement.style.opacity = '0';
          }, 3000);
        }
      }).catch(function(err) {
        // Fallback for browsers that don't support Clipboard API
        const textArea = document.createElement('textarea');
        textArea.value = pixKey;
        textArea.style.position = 'fixed';  // Avoid scrolling to bottom
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
          document.execCommand('copy');
          const confirmationElement = document.getElementById('copy-confirmation');
          if (confirmationElement) {
            confirmationElement.style.opacity = '1';
            
            setTimeout(function() {
              confirmationElement.style.opacity = '0';
            }, 3000);
          }
        } catch (err) {
          console.error('Failed to copy PIX key:', err);
        }
        
        document.body.removeChild(textArea);
      });
    });
  }
});

// Add schema.org metadata for better search results
function addSchemaMetadata() {
  if (!document.querySelector('script[type="application/ld+json"]')) {
    const schema = {
      "@context": "https://schema.org",
      "@type": "Event",
      "name": "Gus & Jess Chá de Panela",
      "startDate": "2025-04-19T15:00",
      "endDate": "2025-04-20T00:00",
      "location": {
        "@type": "Place",
        "name": "Residência",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Rua Plínio Salgado, 549",
          "addressLocality": "Cascavel",
          "addressRegion": "PR",
          "postalCode": "",
          "addressCountry": "BR"
        }
      },
      "image": "img/tea-pot-svgrepo-com.svg",
      "description": "Junte-se conosco em uma tarde comemorativa para celebrar nosso lar, nossa união e amor"
    };
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  }
}

// Execute after a small delay to ensure page is fully loaded
window.addEventListener('load', function() {
  setTimeout(addSchemaMetadata, 100);
});
