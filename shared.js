function initCanvas(id) {
  const canvas = document.getElementById(id);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const T = 'rgba(0,212,170,', B = 'rgba(79,195,247,', P = 'rgba(179,157,219,', O = 'rgba(255,112,67,';

  class Atom {
    constructor() { this.reset(true); }
    reset(init) {
      this.x = Math.random() * window.innerWidth;
      this.y = init ? Math.random() * window.innerHeight : window.innerHeight + 20;
      this.r = 3 + Math.random() * 4;
      this.vx = (Math.random() - .5) * 0.1;
      this.vy = -(0.05 + Math.random() * 0.1);
      this.alpha = 0.2 + Math.random() * 0.3;
      const p = Math.random();
      this.col = p < 0.5 ? T : p < 0.75 ? B : P;
      this.label = ['C', 'N', 'O', 'H', 'S', 'P', 'Cl', 'F'][Math.floor(Math.random() * 8)];
      this.pulse = Math.random() * Math.PI * 2;
      this.ps = 0.01 + Math.random() * 0.015;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.pulse += this.ps;
      if (this.y < -20) this.reset(false);
    }
    draw() {
      const pr = this.r + Math.sin(this.pulse) * 1.2;
      const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, pr * 2.5);
      g.addColorStop(0, this.col + (this.alpha * 0.3) + ')');
      g.addColorStop(1, this.col + '0)');
      ctx.beginPath(); ctx.arc(this.x, this.y, pr * 2.5, 0, Math.PI * 2);
      ctx.fillStyle = g; ctx.fill();
      ctx.beginPath(); ctx.arc(this.x, this.y, pr, 0, Math.PI * 2);
      ctx.fillStyle = this.col + this.alpha + ')'; ctx.fill();
      if (this.r > 4) {
        ctx.font = `bold ${7 + this.r}px monospace`;
        ctx.fillStyle = this.col + '0.6)';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(this.label, this.x, this.y);
      }
    }
  }

  class Ring {
    constructor() { this.reset(true); }
    reset(init) {
      this.cx = 60 + Math.random() * (window.innerWidth - 120);
      this.cy = init ? Math.random() * window.innerHeight : window.innerHeight + 80;
      this.size = 28 + Math.random() * 36;
      this.rot = Math.random() * Math.PI * 2;
      this.rotV = (Math.random() - .5) * 0.002;
      this.vy = -(0.02 + Math.random() * 0.05);
      this.alpha = 0.03 + Math.random() * 0.05;
      this.sides = Math.random() < 0.6 ? 6 : 5;
      const p = Math.random();
      this.col = p < 0.5 ? T : p < 0.75 ? B : P;
    }
    update() {
      this.cy += this.vy;
      this.rot += this.rotV;
      if (this.cy < -120) this.reset(false);
    }
    draw() {
      ctx.save(); ctx.translate(this.cx, this.cy); ctx.rotate(this.rot);
      ctx.strokeStyle = this.col + this.alpha + ')'; ctx.lineWidth = 0.6; ctx.beginPath();
      for (let i = 0; i < this.sides; i++) {
        const a = (Math.PI * 2 / this.sides) * i - Math.PI / 2;
        i === 0 ? ctx.moveTo(Math.cos(a) * this.size, Math.sin(a) * this.size) : ctx.lineTo(Math.cos(a) * this.size, Math.sin(a) * this.size);
      }
      ctx.closePath(); ctx.stroke();
      ctx.restore();
    }
  }

  class Pill {
    constructor() { this.reset(true); }
    reset(init) {
      this.x = 40 + Math.random() * (window.innerWidth - 80);
      this.y = init ? Math.random() * window.innerHeight : window.innerHeight + 40;
      this.w = 32 + Math.random() * 36; this.h = 14 + Math.random() * 10;
      this.rot = (Math.random() - .5) * 1.2; this.rotV = (Math.random() - .5) * 0.004;
      this.vy = -(0.04 + Math.random() * 0.08); this.vx = (Math.random() - .5) * 0.08;
      this.alpha = 0.02 + Math.random() * 0.04;
      const p = Math.random();
      this.col = p < 0.4 ? T : p < 0.65 ? B : p < 0.85 ? P : O;
    }
    update() { this.x += this.vx; this.y += this.vy; this.rot += this.rotV; if (this.y < -60) this.reset(false); }
    draw() {
      ctx.save(); ctx.translate(this.x, this.y); ctx.rotate(this.rot);
      const r = this.h / 2;
      ctx.beginPath();
      ctx.moveTo(-this.w / 2 + r, -r);
      ctx.arcTo(this.w / 2, -r, this.w / 2, r, r);
      ctx.arcTo(this.w / 2, r, -this.w / 2 + r, r, r);
      ctx.arcTo(-this.w / 2, r, -this.w / 2, -r, r);
      ctx.arcTo(-this.w / 2, -r, this.w / 2, -r, r);
      ctx.closePath();
      ctx.strokeStyle = this.col + this.alpha + ')'; ctx.lineWidth = 0.6; ctx.stroke();
      ctx.restore();
    }
  }

  function drawBonds(atoms) {
    for (let i = 0; i < atoms.length; i++) for (let j = i + 1; j < atoms.length; j++) {
      const dx = atoms[i].x - atoms[j].x, dy = atoms[i].y - atoms[j].y, d = Math.sqrt(dx * dx + dy * dy);
      if (d < 100) {
        ctx.beginPath(); ctx.moveTo(atoms[i].x, atoms[i].y); ctx.lineTo(atoms[j].x, atoms[j].y);
        ctx.strokeStyle = `rgba(0,212,170,${(1 - (d / 100)) * 0.06})`; ctx.lineWidth = 0.8; ctx.stroke();
      }
    }
  }

  /* Goal 6: Increased number of particles for premium effect */
  const atoms = Array.from({ length: 55 }, () => new Atom());
  const rings = Array.from({ length: 18 }, () => new Ring());
  const pills = Array.from({ length: 14 }, () => new Pill());

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    rings.forEach(r => { r.update(); r.draw(); });
    pills.forEach(p => { p.update(); p.draw(); });
    drawBonds(atoms);
    atoms.forEach(a => { a.update(); a.draw(); });
    requestAnimationFrame(animate);
  }
  animate();
}
