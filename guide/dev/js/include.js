async function loadLayout() {
  const headerEl = document.getElementById("header");
  const footerEl = document.getElementById("footer");

  if (headerEl) {
    const res = await fetch(`/static/html/header.html`);
    if (res.ok) headerEl.innerHTML = await res.text();
  }

  if (footerEl) {
    const res = await fetch(`/static/html/footer.html`);
    if (res.ok) footerEl.innerHTML = await res.text();
  }

  const jsList = ["/static/scripts/bundle.js"];
  jsList.forEach((src) => {
    const script = document.createElement("script");
    script.src = src;
    document.body.appendChild(script);
  });
}

loadLayout();
