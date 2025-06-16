// Navbar scroll effect
window.addEventListener("scroll", () => {
  const navbar = document.getElementById("navbar")
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled")
  } else {
    navbar.classList.remove("scrolled")
  }
})

// Intersection Observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay || 0
      setTimeout(() => {
        entry.target.classList.add("visible")
      }, delay)
    }
  })
}, observerOptions)

// Observe all fade-in elements
document.addEventListener("DOMContentLoaded", () => {
  const fadeElements = document.querySelectorAll(".fade-in")
  fadeElements.forEach((el) => observer.observe(el))
})


// Creator card interactions
document.querySelectorAll(".creator-card").forEach((card) => {
  card.addEventListener("click", () => {
    const name = card.dataset.name
    card.style.transform = "scale(0.95)"
    setTimeout(() => {
      card.style.transform = "scale(1.05)"
      setTimeout(() => {
        card.style.transform = "scale(1)"
      }, 150)
    }, 100)
  })
})

// Tech card interactions
document.querySelectorAll(".tech-card").forEach((card) => {
  card.addEventListener("click", () => {
    const tech = card.dataset.tech
    card.style.transform = "scale(0.95) translateY(-5px)"
    setTimeout(() => {
      card.style.transform = "scale(1.05) translateY(-5px)"
      setTimeout(() => {
        card.style.transform = "scale(1) translateY(0)"
      }, 150)
    }, 100)
  })
})

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  })
})

// Add some interactive effects
document.querySelectorAll(".card").forEach((card) => {
  card.addEventListener("mouseenter", () => {
    card.style.transform = "translateY(-10px)"
  })

  card.addEventListener("mouseleave", () => {
    card.style.transform = "translateY(0)"
  })
})

// Console welcome message
console.log(`
🚀 RedeDevs - Portal de Tecnologia
👨‍💻 Desenvolvido pelos alunos do IFSP
💙 Feito com HTML, CSS e JavaScript
`)
