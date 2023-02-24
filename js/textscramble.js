// TextScramble
// ——————————————————————————————————————————————————

class TextScramble {
  constructor(el, options) {
    this.el = el instanceof HTMLElement ? el : document.querySelector(el);
    this.chars = options.chars || '!<>-_\\/[]{}—=+*^?#________';
    this.interval = options.interval || 60;
    this.animationTimeout = options.animationTimeout || 800;
    this.phrases = options.phrases || [];
    this.currentPhraseIndex = 0;
    this.loop = options.loop || false;
    this.update = this.update.bind(this);
    this.start();
  }

  start() {
    this.currentPhraseIndex = 0;
    this.startAnimation();
  }

  startAnimation() {
    const currentPhrase = this.phrases[this.currentPhraseIndex];
    this.setText(currentPhrase).then(() => {
      setTimeout(() => {
        if (this.currentPhraseIndex === this.phrases.length - 1 && !this.loop) {
          return;
        }
        this.currentPhraseIndex = (this.currentPhraseIndex + 1) % this.phrases.length;
        this.startAnimation();
      }, this.animationTimeout);
    });
  }

  setText(newText) {
    return new Promise((resolve) => {
      const oldText = this.el.innerText;
      const length = Math.max(oldText.length, newText.length);
      this.queue = [];
      for (let i = 0; i < length; i++) {
        const from = oldText[i] || '';
        const to = newText[i] || '';
        const start = Math.floor(Math.random() * 40);
        const end = start + Math.floor(Math.random() * 40);
        this.queue.push({ from, to, start, end });
      }
      cancelAnimationFrame(this.frameRequest);
      this.frame = 0;
      this.resolve = resolve;
      this.update();
    });
  }

  update() {
    let output = '';
    let complete = 0;
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.randomChar();
          this.queue[i].char = char;
        }
        output += `<span class="dud">${char}</span>`;
      } else {
        output += from;
      }
    }
    this.el.innerHTML = output;
    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }

  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }
}