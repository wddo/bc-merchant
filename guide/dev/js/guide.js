document.addEventListener("DOMContentLoaded", () => {
  let anchor = false;

  const noEls = document.querySelectorAll(".no");
  noEls.forEach((el, i) => {
    el.textContent = i + 1;
  });

  const tblRows = document.querySelectorAll(".tblGuide tbody tr");
  const tblLinks = document.querySelectorAll(".tblGuide tbody tr a");
  const listNum = (tblLinks.length / tblRows.length) * 100;

  console.log(`총 분량 : ${tblRows.length}`);
  console.log(`작업 분량 : ${tblLinks.length}`);
  console.log(`남은 분량 : ${tblRows.length - tblLinks.length}`);

  const statusTxt = document.querySelector(".tblStatus .txt");
  if (statusTxt) statusTxt.textContent = parseInt(listNum) + "%";

  const statusBar = document.querySelector(".tblStatus .bar em");
  if (statusBar) {
    statusBar.style.transition = "width 800ms";
    statusBar.style.width = listNum + "%";
  }

  function updateNavOnScroll() {
    const guideHeader = document.querySelector(".guideHeader");
    const headHeight = guideHeader ? guideHeader.offsetHeight : 0;

    document.querySelectorAll(".guideTit3").forEach((el) => {
      const scrollHeight = el.getBoundingClientRect().top - headHeight - 50;

      if (scrollHeight < 0 && el.id) {
        const aTag = document.querySelector('a[href$="' + el.id + '"]');
        document
          .querySelectorAll(".gnbDep2 a.navON")
          .forEach((a) => a.classList.remove("navON"));
        if (aTag) aTag.classList.add("navON");
      }
    });
  }

  function scrollToTarget(targetTop, duration, onComplete) {
    const start = window.scrollY;
    const distance = targetTop - start;
    const startTime = performance.now();

    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      window.scrollTo(0, start + distance * progress);
      if (progress < 1) requestAnimationFrame(step);
      else if (onComplete) onComplete();
    }
    requestAnimationFrame(step);
  }

  document.querySelectorAll(".gnbDep2 a[href^='#']").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      anchor = true;
      document
        .querySelectorAll(".gnbDep2 a.navON")
        .forEach((a) => a.classList.remove("navON"));
      link.classList.add("navON");

      const href = link.getAttribute("href");
      const target = href ? document.querySelector(href) : null;
      if (target) {
        const targetTop =
          target.getBoundingClientRect().top + window.scrollY - 210;
        scrollToTarget(targetTop, 500, () => {
          anchor = false;
        });
      } else {
        anchor = false;
      }
    });
  });

  window.addEventListener("scroll", () => {
    if (anchor) return;
    updateNavOnScroll();
  });

  updateNavOnScroll();
});
