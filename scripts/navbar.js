const usuario = JSON.parse(localStorage.getItem("usuario"));
const login = document.getElementById("login");
const logout = document.getElementById("logout");
const perfil = document.getElementById("perfil");

// Controle de visibilidade dos elementos de navegação
if (usuario === null) {
  login.style.display = "block";
  perfil.style.display = "none";
} else {
  login.style.display = "none";
  perfil.style.display = "block";
}

// Funcionalidade do dropdown do perfil
document.addEventListener("DOMContentLoaded", () => {
  const perfilToggle = document.getElementById("perfilToggle");
  const dropdownMenu = document.getElementById("dropdownMenu");
  const navDropdown = document.querySelector(".nav-dropdown");

  if (perfilToggle && dropdownMenu) {
    // Toggle dropdown ao clicar
    perfilToggle.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      const isVisible = dropdownMenu.style.opacity === "1";

      if (isVisible) {
        hideDropdown();
      } else {
        showDropdown();
      }
    });

    // Mostrar dropdown no hover
    navDropdown.addEventListener("mouseenter", () => {
      showDropdown();
    });

    // Esconder dropdown quando sair do hover
    navDropdown.addEventListener("mouseleave", () => {
      hideDropdown();
    });

    // Fechar dropdown ao clicar fora
    document.addEventListener("click", (e) => {
      if (!navDropdown.contains(e.target)) {
        hideDropdown();
      }
    });

    function showDropdown() {
      dropdownMenu.style.opacity = "1";
      dropdownMenu.style.visibility = "visible";
      dropdownMenu.style.transform = "translateY(0)";
    }

    function hideDropdown() {
      dropdownMenu.style.opacity = "0";
      dropdownMenu.style.visibility = "hidden";
      dropdownMenu.style.transform = "translateY(10px)";
    }
  }
});

// Logout functionality
if (logout) {
  logout.addEventListener("click", (e) => {
  e.preventDefault();
  localStorage.removeItem("usuario");
  setTimeout(() => {
    window.location.href = "login.html";
  }, 500); // 0.5s ou ajuste para o tempo que quiser
});

}

// Navbar scroll effect
window.addEventListener("scroll", () => {
  const navbar = document.getElementById("navbar");
  if (navbar) {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }
});

// Mobile menu functionality
document.addEventListener("DOMContentLoaded", () => {
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const navLinks = document.getElementById("navLinks");

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener("click", () => {
      const isVisible = navLinks.classList.contains("active");

      if (isVisible) {
        navLinks.classList.remove("active");
        navLinks.style.display = "none";
      } else {
        navLinks.classList.add("active");
        navLinks.style.display = "flex";
        navLinks.style.flexDirection = "column";
        navLinks.style.position = "absolute";
        navLinks.style.top = "100%";
        navLinks.style.left = "0";
        navLinks.style.right = "0";
        navLinks.style.background = "rgba(15, 23, 42, 0.98)";
        navLinks.style.padding = "1rem";
        navLinks.style.borderTop = "1px solid #334155";
        navLinks.style.zIndex = "1000";
      }
    });
  }
});

// Search functionality
document.addEventListener("DOMContentLoaded", () => {
  const searchBtn = document.getElementById("btnPesquisa");
  const searchInput = document.getElementById("pesquisa");

  if (searchBtn && searchInput) {
    // Search button click
    searchBtn.addEventListener("click", (e) => {
      e.preventDefault();
      performSearch();
    });

    // Enter key search
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        performSearch();
      }
    });

    function performSearch() {
      const searchTerm = searchInput.value.trim();

      if (searchTerm) {
        // Add visual feedback
        searchInput.style.transform = "scale(0.95)";
        setTimeout(() => {
          searchInput.style.transform = "scale(1)";
        }, 150);

        // Trigger search in index.js if the function exists
        if (typeof window.performNewsSearch === "function") {
          window.performNewsSearch(searchTerm);
        } else {
          // Fallback: trigger the existing search functionality
          const btnPesq = document.getElementById("btnPesquisa");
          if (btnPesq) {
            btnPesq.click();
          }
        }
      }
    }
  }
});
