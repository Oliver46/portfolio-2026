/* ==========================================================================
   Leon Oliver — shared site script
   Each block checks for its target element before running, so this single
   file can be safely included on every page without errors.
   ========================================================================== */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {

    /* ---------------- Footer year ---------------- */
    var yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* ---------------- Active nav link ---------------- */
    var here = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
    document.querySelectorAll(".pf-nav-links a, .footer-col a").forEach(function (link) {
      var target = (link.getAttribute("href") || "").split("#")[0].toLowerCase();
      if (target && target === here) link.classList.add("is-active");
    });

    /* ---------------- Hero load-in animation ---------------- */
    var heroText = document.querySelector(".pf-text");
    var heroImage = document.querySelector(".oliver-image");
    if (heroText) setTimeout(function () { heroText.classList.add("animate"); }, 250);
    if (heroImage) setTimeout(function () { heroImage.classList.add("animate"); }, 650);

    /* ---------------- Stats counter (home page) ---------------- */
    var statsRow = document.querySelector(".stats-row");
    if (statsRow) {
      var counters = [
        { id: "pd", target: 50 },
        { id: "ce", target: 7 },
        { id: "is", target: 10 }
      ];
      var runCounters = function () {
        counters.forEach(function (c) {
          var el = document.getElementById(c.id);
          if (!el) return;
          var current = 0;
          var step = Math.max(1, Math.round(c.target / 40));
          var timer = setInterval(function () {
            current = Math.min(current + step, c.target);
            el.textContent = current;
            if (current >= c.target) clearInterval(timer);
          }, 30);
        });
      };
      var statsObserver = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            runCounters();
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });
      statsObserver.observe(statsRow);
    }

    /* ---------------- Experience tabs (experience page) ---------------- */
    var expPanel = document.getElementById("exp-panel");
    if (expPanel && window.EXPERIENCE_DATA) {
      var checkSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
      var data = window.EXPERIENCE_DATA;
      var tabs = document.querySelectorAll(".exp-tab");

      var renderExperience = function (key) {
        var entry = data[key];
        if (!entry) return;
        var bulletsHtml = entry.bullets.map(function (b) {
          return "<li>" + checkSvg + "<span>" + b + "</span></li>";
        }).join("");
        expPanel.innerHTML =
          '<h3 class="exp-role">' + entry.role + ' <span class="exp-at">@ ' + entry.company + "</span></h3>" +
          '<p class="exp-dates">' + entry.dates + "</p>" +
          (entry.location ? '<p class="exp-location">' + entry.location + "</p>" : "") +
          '<ul class="exp-bullets">' + bulletsHtml + "</ul>";
      };

      tabs.forEach(function (tab) {
        tab.addEventListener("click", function () {
          tabs.forEach(function (t) {
            t.classList.remove("active");
            t.setAttribute("aria-selected", "false");
          });
          tab.classList.add("active");
          tab.setAttribute("aria-selected", "true");
          renderExperience(tab.getAttribute("data-company"));
        });
      });

      var firstTab = document.querySelector(".exp-tab.active") || tabs[0];
      if (firstTab) renderExperience(firstTab.getAttribute("data-company"));
    }

    /* ---------------- Portfolio filter (projects page) ---------------- */
    var filterBtns = document.querySelectorAll(".filter-btn");
    var pfCards = document.querySelectorAll(".pf-card");
    if (filterBtns.length && pfCards.length) {
      filterBtns.forEach(function (btn) {
        btn.addEventListener("click", function () {
          filterBtns.forEach(function (b) { b.classList.remove("active"); });
          btn.classList.add("active");
          var f = btn.getAttribute("data-filter");
          pfCards.forEach(function (card) {
            var cats = (card.getAttribute("data-cat") || "").split(" ");
            var show = f === "all" || cats.indexOf(f) !== -1;
            card.classList.toggle("hide", !show);
          });
        });
      });
    }

    /* ---------------- Portfolio modal (projects page) ---------------- */
    var pfModal = document.getElementById("pfModal");
    if (pfModal && window.PROJECTS_DATA) {
      var PROJECTS = window.PROJECTS_DATA;
      var pfModalImg = document.getElementById("pfModalImg");
      var pfModalCat = document.getElementById("pfModalCat");
      var pfModalTitle = document.getElementById("pfModalTitle");
      var pfModalDesc = document.getElementById("pfModalDesc");
      var pfModalTags = document.getElementById("pfModalTags");
      var pfModalStats = document.getElementById("pfModalStats");

      var closePfModal = function () {
        pfModal.classList.remove("open");
        pfModal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
      };

      document.querySelectorAll(".pf-card").forEach(function (card) {
        card.addEventListener("click", function () {
          var id = card.getAttribute("data-modal");
          var p = PROJECTS[id];
          if (!p) return;
          pfModalImg.src = p.img;
          pfModalImg.alt = p.title + " website case study image";
          pfModalCat.textContent = p.cat;
          pfModalTitle.textContent = p.title;
          pfModalDesc.textContent = p.desc;
          pfModalTags.innerHTML = p.tags.map(function (t) { return "<span>" + t + "</span>"; }).join("");
          pfModalStats.innerHTML = p.stats.map(function (s) {
            return "<div><strong>" + s[0] + "</strong><span>" + s[1] + "</span></div>";
          }).join("");
          pfModal.classList.add("open");
          pfModal.setAttribute("aria-hidden", "false");
          document.body.style.overflow = "hidden";
        });
      });

      document.querySelectorAll("[data-modal-close]").forEach(function (el) {
        el.addEventListener("click", closePfModal);
      });
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") closePfModal();
      });
    }

    /* ---------------- Contact form validation (contact page) ---------------- */
    var contactForm = document.getElementById("contactForm");
    if (contactForm) {
      var formSuccess = document.getElementById("formSuccess");

      var setError = function (fieldId, hasError) {
        var field = document.getElementById(fieldId);
        if (field) field.classList.toggle("error", hasError);
      };

      contactForm.addEventListener("submit", function (e) {
        e.preventDefault();
        var name = document.getElementById("cf-name");
        var email = document.getElementById("cf-email");
        var message = document.getElementById("cf-message");
        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        var nameValid = name.value.trim().length > 1;
        var emailValid = emailPattern.test(email.value.trim());
        var messageValid = message.value.trim().length > 4;

        setError("field-name", !nameValid);
        setError("field-email", !emailValid);
        setError("field-message", !messageValid);

        if (nameValid && emailValid && messageValid) {
          contactForm.reset();
          if (formSuccess) formSuccess.classList.add("show");
        } else if (formSuccess) {
          formSuccess.classList.remove("show");
        }
      });

      ["cf-name", "cf-email", "cf-message"].forEach(function (id) {
        var input = document.getElementById(id);
        if (input) {
          input.addEventListener("input", function () {
            var fieldWrap = input.closest(".field");
            if (fieldWrap) fieldWrap.classList.remove("error");
          });
        }
      });
    }

  });
})();
