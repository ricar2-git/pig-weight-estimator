/**
 * Swine Computer Vision & Interactive Biometric Canvas
 * Handles image rendering, landmark pins, and contour visualization
 */

class SwineVision {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.image = null;
    this.scale = 1.0;
    this.offsetX = 0;
    this.offsetY = 0;

    // Measurement landmarks (normalized 0.0 to 1.0 relative to image)
    this.landmarks = {
      snout: { x: 0.18, y: 0.52, label: 'Snout / Hocico', color: '#10b981' },
      shoulder: { x: 0.38, y: 0.38, label: 'Withers / Cruz', color: '#3b82f6' },
      tailBase: { x: 0.82, y: 0.44, label: 'Tail / Cola', color: '#10b981' },
      girthTop: { x: 0.42, y: 0.33, label: 'Spine / Dorso', color: '#8b5cf6' },
      girthBottom: { x: 0.43, y: 0.72, label: 'Belly / Vientre', color: '#8b5cf6' }
    };

    this.activePin = null;
    this.isDragging = false;
    this.onDimensionsChanged = null;

    this.initEvents();
  }

  loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        this.image = img;
        this.autoDetectSwineContours();
        this.render();
        resolve(img);
      };
      img.onerror = reject;
      img.src = src;
    });
  }

  /**
   * Approximate pig contour bounds and initialize landmarks to proportional pig anatomy
   */
  autoDetectSwineContours() {
    if (!this.image) return;

    // Standard lateral swine posture proportions:
    // Snout at ~18-22% x, Tail at ~80-85% x
    // Shoulder withers at ~35-40% x, Girth across thorax
    this.landmarks.snout = { x: 0.18, y: 0.54, label: 'Snout', color: '#10b981' };
    this.landmarks.shoulder = { x: 0.36, y: 0.38, label: 'Shoulder', color: '#3b82f6' };
    this.landmarks.tailBase = { x: 0.82, y: 0.42, label: 'Rump', color: '#10b981' };
    this.landmarks.girthTop = { x: 0.44, y: 0.34, label: 'Dorsal Girth', color: '#8b5cf6' };
    this.landmarks.girthBottom = { x: 0.45, y: 0.74, label: 'Ventral Girth', color: '#8b5cf6' };

    this.notifyDimensions();
  }

  notifyDimensions() {
    if (!this.onDimensionsChanged) return;

    // Calculate length in normalized pixels
    const dx = (this.landmarks.tailBase.x - this.landmarks.snout.x);
    const dy = (this.landmarks.tailBase.y - this.landmarks.snout.y);
    const normLength = Math.sqrt(dx * dx + dy * dy);

    // Calculate depth/girth
    const gdx = (this.landmarks.girthBottom.x - this.landmarks.girthTop.x);
    const gdy = (this.landmarks.girthBottom.y - this.landmarks.girthTop.y);
    const normDepth = Math.sqrt(gdx * gdx + gdy * gdy);

    // Scaling calibration: map to reasonable swine centimeters
    // Baseline length of adult finisher is ~110-125cm, girth ~115-130cm
    const baseScaleCm = 175;
    const lengthCm = Math.round(normLength * baseScaleCm);
    // Swine girth is circular/elliptical perimeter: depth * PI * 0.95
    const girthCm = Math.round(normDepth * baseScaleCm * 2.15);

    this.onDimensionsChanged({ lengthCm, girthCm });
  }

  setDimensionsFromSliders(lengthCm, girthCm) {
    const baseScaleCm = 175;
    const normLength = lengthCm / baseScaleCm;
    const normDepth = girthCm / (baseScaleCm * 2.15);

    // Update landmarks based on sliders
    const midX = 0.50;
    const midY = 0.48;
    this.landmarks.snout.x = Math.max(0.05, midX - normLength / 2);
    this.landmarks.tailBase.x = Math.min(0.95, midX + normLength / 2);

    this.landmarks.girthTop.y = Math.max(0.1, midY - normDepth / 2);
    this.landmarks.girthBottom.y = Math.min(0.95, midY + normDepth / 2);

    this.render();
  }

  render() {
    const ctx = this.ctx;
    const canvas = this.canvas;

    // Handle high DPI display
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;

    // Clear background
    ctx.fillStyle = '#0f172a'; // slate-900
    ctx.fillRect(0, 0, w, h);

    if (!this.image) {
      // Draw placeholder viewfinder reticle
      this.drawPlaceholderViewfinder(ctx, w, h);
      return;
    }

    // Fit image to canvas maintaining aspect ratio
    const imgRatio = this.image.width / this.image.height;
    const canvasRatio = w / h;
    let renderW, renderH, renderX, renderY;

    if (imgRatio > canvasRatio) {
      renderW = w;
      renderH = w / imgRatio;
      renderX = 0;
      renderY = (h - renderH) / 2;
    } else {
      renderH = h;
      renderW = h * imgRatio;
      renderX = (w - renderW) / 2;
      renderY = 0;
    }

    this.imageBounds = { x: renderX, y: renderY, w: renderW, h: renderH };

    // Draw photo
    ctx.drawImage(this.image, renderX, renderY, renderW, renderH);

    // Subtle dark overlay to make pins pop
    ctx.fillStyle = 'rgba(15, 23, 42, 0.20)';
    ctx.fillRect(renderX, renderY, renderW, renderH);

    // Draw Biometric vectors and bounding lines
    this.drawBiometricLines(ctx);

    // Draw Interactive Landmark Pins
    this.drawLandmarks(ctx);
  }

  drawPlaceholderViewfinder(ctx, w, h) {
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);

    // Grid lines
    ctx.beginPath();
    ctx.moveTo(w / 3, 0); ctx.lineTo(w / 3, h);
    ctx.moveTo(2 * w / 3, 0); ctx.lineTo(2 * w / 3, h);
    ctx.moveTo(0, h / 3); ctx.lineTo(w, h / 3);
    ctx.moveTo(0, 2 * h / 3); ctx.lineTo(w, 2 * h / 3);
    ctx.stroke();
    ctx.setLineDash([]);

    // Swine silhouette guide
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    const cx = w / 2;
    const cy = h / 2;
    const cornerSize = 24;

    // Viewfinder bracket corners
    ctx.beginPath();
    // Top-left
    ctx.moveTo(cx - 100, cy - 60 + cornerSize); ctx.lineTo(cx - 100, cy - 60); ctx.lineTo(cx - 100 + cornerSize, cy - 60);
    // Top-right
    ctx.moveTo(cx + 100 - cornerSize, cy - 60); ctx.lineTo(cx + 100, cy - 60); ctx.lineTo(cx + 100, cy - 60 + cornerSize);
    // Bottom-right
    ctx.moveTo(cx + 100, cy + 60 - cornerSize); ctx.lineTo(cx + 100, cy + 60); ctx.lineTo(cx + 100 - cornerSize, cy + 60);
    // Bottom-left
    ctx.moveTo(cx - 100 + cornerSize, cy + 60); ctx.lineTo(cx - 100, cy + 60); ctx.lineTo(cx - 100, cy + 60 - cornerSize);
    ctx.stroke();

    // Guidance text
    ctx.fillStyle = '#94a3b8';
    ctx.font = '13px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Position pig within frame for automatic scan', cx, cy + 90);
  }

  getCanvasCoords(normX, normY) {
    if (!this.imageBounds) return { x: 0, y: 0 };
    return {
      x: this.imageBounds.x + normX * this.imageBounds.w,
      y: this.imageBounds.y + normY * this.imageBounds.h
    };
  }

  drawBiometricLines(ctx) {
    const snout = this.getCanvasCoords(this.landmarks.snout.x, this.landmarks.snout.y);
    const tail = this.getCanvasCoords(this.landmarks.tailBase.x, this.landmarks.tailBase.y);
    const girthT = this.getCanvasCoords(this.landmarks.girthTop.x, this.landmarks.girthTop.y);
    const girthB = this.getCanvasCoords(this.landmarks.girthBottom.x, this.landmarks.girthBottom.y);

    // 1. Length Vector (Snout to Tail) - Emerald Neon
    ctx.beginPath();
    ctx.moveTo(snout.x, snout.y);
    ctx.lineTo(tail.x, tail.y);
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3.5;
    ctx.shadowColor = '#10b981';
    ctx.shadowBlur = 8;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Measurement badge for length
    const midLX = (snout.x + tail.x) / 2;
    const midLY = (snout.y + tail.y) / 2 - 12;
    this.drawBadge(ctx, 'LENGTH / LONGITUD', midLX, midLY, '#065f46');

    // 2. Heart Girth Band (Vertical thoracic diameter) - Violet/Purple Neon
    ctx.beginPath();
    ctx.moveTo(girthT.x, girthT.y);
    ctx.lineTo(girthB.x, girthB.y);
    ctx.strokeStyle = '#a855f7';
    ctx.lineWidth = 3.5;
    ctx.shadowColor = '#a855f7';
    ctx.shadowBlur = 8;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Measurement badge for girth
    const midGX = (girthT.x + girthB.x) / 2 + 36;
    const midGY = (girthT.y + girthB.y) / 2;
    this.drawBadge(ctx, 'GIRTH / TÓRAX', midGX, midGY, '#581c87');
  }

  drawBadge(ctx, text, x, y, bgColor) {
    ctx.font = 'bold 9px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const textWidth = ctx.measureText(text).width;
    const padX = 7;
    const padY = 3.5;

    ctx.fillStyle = bgColor;
    ctx.beginPath();
    ctx.roundRect(x - textWidth / 2 - padX, y - 7 - padY, textWidth + padX * 2, 14 + padY * 2, 4);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.fillText(text, x, y);
  }

  drawLandmarks(ctx) {
    for (const [key, pt] of Object.entries(this.landmarks)) {
      const pos = this.getCanvasCoords(pt.x, pt.y);
      const isHovered = this.activePin === key;

      // Outer glow ring
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, isHovered ? 14 : 10, 0, Math.PI * 2);
      ctx.fillStyle = isHovered ? 'rgba(255, 255, 255, 0.45)' : 'rgba(255, 255, 255, 0.25)';
      ctx.fill();

      // Pin body
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, isHovered ? 9 : 7, 0, Math.PI * 2);
      ctx.fillStyle = pt.color;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.5;
      ctx.fill();
      ctx.stroke();
    }
  }

  initEvents() {
    const getPos = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    };

    const findPin = (pos) => {
      if (!this.imageBounds) return null;
      for (const [key, pt] of Object.entries(this.landmarks)) {
        const cpos = this.getCanvasCoords(pt.x, pt.y);
        const dist = Math.hypot(cpos.x - pos.x, cpos.y - pos.y);
        if (dist <= 22) { // hit radius
          return key;
        }
      }
      return null;
    };

    const onDown = (e) => {
      const pos = getPos(e);
      const hit = findPin(pos);
      if (hit) {
        this.activePin = hit;
        this.isDragging = true;
        this.render();
        e.preventDefault();
      }
    };

    const onMove = (e) => {
      const pos = getPos(e);
      if (this.isDragging && this.activePin && this.imageBounds) {
        // Convert to normalized coordinates
        let normX = (pos.x - this.imageBounds.x) / this.imageBounds.w;
        let normY = (pos.y - this.imageBounds.y) / this.imageBounds.h;
        normX = Math.max(0.02, Math.min(0.98, normX));
        normY = Math.max(0.02, Math.min(0.98, normY));

        this.landmarks[this.activePin].x = normX;
        this.landmarks[this.activePin].y = normY;

        this.notifyDimensions();
        this.render();
        e.preventDefault();
      } else {
        const hit = findPin(pos);
        if (hit !== this.activePin) {
          this.activePin = hit;
          this.canvas.style.cursor = hit ? 'pointer' : 'default';
          this.render();
        }
      }
    };

    const onUp = () => {
      if (this.isDragging) {
        this.isDragging = false;
        this.render();
      }
    };

    this.canvas.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);

    this.canvas.addEventListener('touchstart', onDown, { passive: false });
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onUp);

    window.addEventListener('resize', () => this.render());
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = SwineVision;
}
