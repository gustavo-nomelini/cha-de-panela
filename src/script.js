document.addEventListener("DOMContentLoaded", function () {
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

      // Mostrar feedback para o usuário
      showNotification(`Processando sua confirmação, ${name}...`, "info");

      // Substituir com o ID real do seu formulário Google
      const formId = "1FAIpQLScTgMkGKFWLJPrj1aOwLnyvAd_7b1LV4fGq1XA8EBYxR14tZA";

      // Substituir com os IDs reais dos seus campos
      const nameFieldId = "494432199";
      const guestsFieldId = "1498135098";

      // Criar um formulário dinâmico e enviá-lo diretamente
      const dynamicForm = document.createElement("form");
      dynamicForm.action = `https://docs.google.com/forms/d/e/${formId}/formResponse`;
      dynamicForm.method = "POST";
      dynamicForm.target = "_blank"; // Envia para uma nova guia (que pode ser fechada automaticamente)
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
  const eventDate = new Date("April 15, 2025 15:00:00").getTime();

  // Update both countdowns
  function updateCountdown() {
    const now = new Date().getTime();
    const distance = eventDate - now;

    if (distance < 0) {
      if (document.getElementById("countdown")) {
        document.getElementById("countdown").innerHTML =
          "<p class='text-tea-dark text-center text-xl'>O chá está acontecendo agora!</p>";
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
});
