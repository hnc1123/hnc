document.addEventListener("DOMContentLoaded", () => {
    const header = document.getElementById('navbar');
    if (!header) return;

    const links = [
        { href: "index.html", label: "Home" },
        { href: "quotes.html", label: "Quotes" },
        { href: "projects.html", label: "Projects" },
        { href: "machine.html", label: "Game" }
    ];

    // 判断当前页（GitHub Pages 下可能是 /routine/ 或 /routine/index.html）
    const current = (window.location.pathname.split('/').pop() || "index.html").toLowerCase();

    const nav = document.createElement('nav');
    nav.className = 'navbar';

    const brand = document.createElement('a');
    brand.className = 'nav-brand';
    brand.href = 'index.html';
    brand.innerHTML = '<span class="dot"></span>Routine · 学习站';
    nav.appendChild(brand);

    const wrap = document.createElement('div');
    wrap.className = 'nav-links';

    links.forEach(l => {
        const a = document.createElement('a');
        a.className = 'nav-link';
        a.href = l.href;
        a.textContent = l.label;
        if (l.href.toLowerCase() === current) a.classList.add('active');
        wrap.appendChild(a);
    });

    nav.appendChild(wrap);
    header.appendChild(nav);
});
