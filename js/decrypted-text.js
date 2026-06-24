/**
 * DecryptedText - A Vanilla JS implementation of the React Bits <DecryptedText /> component.
 */
class DecryptedText {
  constructor(element, options = {}) {
    this.el = typeof element === 'string' ? document.querySelector(element) : element;
    if (!this.el) return;

    // Default configuration matching the React component props
    this.config = {
      text: options.text !== undefined ? options.text : this.el.textContent.trim(),
      speed: options.speed || 80,
      maxIterations: options.maxIterations || 60,
      sequential: options.sequential || false,
      revealDirection: options.revealDirection || 'start',
      useOriginalCharsOnly: options.useOriginalCharsOnly || false,
      characters: options.characters || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+',
      className: options.className || '',
      parentClassName: options.parentClassName || '',
      encryptedClassName: options.encryptedClassName || '',
      animateOn: options.animateOn || 'hover',
      clickMode: options.clickMode || 'once',
    };

    this.displayText = this.config.text;
    this.isAnimating = false;
    this.revealedIndices = new Set();
    this.hasAnimated = false;
    this.isDecrypted = this.config.animateOn !== 'click';
    this.direction = 'forward';

    this.intervalId = null;
    this.order = [];
    this.pointer = 0;

    this.initDOM();
    this.initEvents();
  }

  // Precompute the characters set to use for scrambling
  get availableChars() {
    if (this.config.useOriginalCharsOnly) {
      return Array.from(new Set(this.config.text.split(''))).filter(char => char !== ' ');
    }
    return this.config.characters.split('');
  }

  // Set up the DOM structure matching the React version for accessibility
  initDOM() {
    this.el.innerHTML = '';
    
    // Add parent classes
    if (this.config.parentClassName) {
      this.config.parentClassName.split(' ').forEach(cls => {
        if (cls) this.el.classList.add(cls);
      });
    }

    this.el.style.display = 'inline-block';
    this.el.style.whiteSpace = 'pre-wrap';

    // Screen reader only text
    this.srText = document.createElement('span');
    this.srText.style.position = 'absolute';
    this.srText.style.width = '1px';
    this.srText.style.height = '1px';
    this.srText.style.padding = '0';
    this.srText.style.margin = '-1px';
    this.srText.style.overflow = 'hidden';
    this.srText.style.clip = 'rect(0,0,0,0)';
    this.srText.style.border = '0';
    this.srText.textContent = this.config.text;
    this.el.appendChild(this.srText);

    // Visible text container
    this.visibleText = document.createElement('span');
    this.visibleText.setAttribute('aria-hidden', 'true');
    this.el.appendChild(this.visibleText);

    if (this.config.animateOn === 'click') {
      this.encryptInstantly();
    } else {
      this.renderText();
    }
  }

  // Scramble the text based on current revealed indices
  shuffleText(originalText, currentRevealed) {
    const chars = this.availableChars;
    return originalText
      .split('')
      .map((char, i) => {
        if (char === ' ') return ' ';
        if (currentRevealed.has(i)) return originalText[i];
        return chars[Math.floor(Math.random() * chars.length)];
      })
      .join('');
  }

  // Render the spans for each character
  renderText() {
    this.visibleText.innerHTML = '';
    const textSplit = this.displayText.split('');
    
    textSplit.forEach((char, index) => {
      const charSpan = document.createElement('span');
      charSpan.textContent = char;
      
      const isRevealedOrDone = this.revealedIndices.has(index) || (!this.isAnimating && this.isDecrypted);
      
      if (isRevealedOrDone) {
        if (this.config.className) {
          this.config.className.split(' ').forEach(cls => {
            if (cls) charSpan.classList.add(cls);
          });
        }
      } else {
        if (this.config.encryptedClassName) {
          this.config.encryptedClassName.split(' ').forEach(cls => {
            if (cls) charSpan.classList.add(cls);
          });
        }
      }
      this.visibleText.appendChild(charSpan);
    });
  }

  // Compute character reveal order in sequential mode
  computeOrder(len) {
    const order = [];
    if (len <= 0) return order;
    if (this.config.revealDirection === 'start') {
      for (let i = 0; i < len; i++) order.push(i);
      return order;
    }
    if (this.config.revealDirection === 'end') {
      for (let i = len - 1; i >= 0; i--) order.push(i);
      return order;
    }
    // center
    const middle = Math.floor(len / 2);
    let offset = 0;
    while (order.length < len) {
      if (offset % 2 === 0) {
        const idx = middle + offset / 2;
        if (idx >= 0 && idx < len) order.push(idx);
      } else {
        const idx = middle - Math.ceil(offset / 2);
        if (idx >= 0 && idx < len) order.push(idx);
      }
      offset++;
    }
    return order.slice(0, len);
  }

  fillAllIndices() {
    const s = new Set();
    for (let i = 0; i < this.config.text.length; i++) s.add(i);
    return s;
  }

  removeRandomIndices(set, count) {
    const arr = Array.from(set);
    for (let i = 0; i < count && arr.length > 0; i++) {
      const idx = Math.floor(Math.random() * arr.length);
      arr.splice(idx, 1);
    }
    return new Set(arr);
  }

  encryptInstantly() {
    this.revealedIndices = new Set();
    this.displayText = this.shuffleText(this.config.text, this.revealedIndices);
    this.isDecrypted = false;
    this.renderText();
  }

  triggerDecrypt() {
    if (this.config.sequential) {
      this.order = this.computeOrder(this.config.text.length);
      this.pointer = 0;
      this.revealedIndices = new Set();
    } else {
      this.revealedIndices = new Set();
    }
    this.direction = 'forward';
    this.startAnimation();
  }

  triggerReverse() {
    if (this.config.sequential) {
      this.order = this.computeOrder(this.config.text.length).slice().reverse();
      this.pointer = 0;
      this.revealedIndices = this.fillAllIndices();
      this.displayText = this.shuffleText(this.config.text, this.fillAllIndices());
    } else {
      this.revealedIndices = this.fillAllIndices();
      this.displayText = this.shuffleText(this.config.text, this.fillAllIndices());
    }
    this.direction = 'reverse';
    this.startAnimation();
  }

  getNextIndex(revealedSet) {
    const textLength = this.config.text.length;
    switch (this.config.revealDirection) {
      case 'start':
        return revealedSet.size;
      case 'end':
        return textLength - 1 - revealedSet.size;
      case 'center': {
        const middle = Math.floor(textLength / 2);
        const offset = Math.floor(revealedSet.size / 2);
        const nextIndex = revealedSet.size % 2 === 0 ? middle + offset : middle - offset - 1;

        if (nextIndex >= 0 && nextIndex < textLength && !revealedSet.has(nextIndex)) {
          return nextIndex;
        }

        for (let i = 0; i < textLength; i++) {
          if (!revealedSet.has(i)) return i;
        }
        return 0;
      }
      default:
        return revealedSet.size;
    }
  }

  startAnimation() {
    clearInterval(this.intervalId);
    this.isAnimating = true;
    let currentIteration = 0;

    this.intervalId = setInterval(() => {
      if (this.config.sequential) {
        // Sequential Forward
        if (this.direction === 'forward') {
          if (this.revealedIndices.size < this.config.text.length) {
            const nextIndex = this.getNextIndex(this.revealedIndices);
            this.revealedIndices.add(nextIndex);
            this.displayText = this.shuffleText(this.config.text, this.revealedIndices);
            this.renderText();
          } else {
            clearInterval(this.intervalId);
            this.isAnimating = false;
            this.isDecrypted = true;
            this.renderText();
          }
        }
        // Sequential Reverse
        if (this.direction === 'reverse') {
          if (this.pointer < this.order.length) {
            const idxToRemove = this.order[this.pointer++];
            this.revealedIndices.delete(idxToRemove);
            this.displayText = this.shuffleText(this.config.text, this.revealedIndices);
            this.renderText();
            if (this.revealedIndices.size === 0) {
              clearInterval(this.intervalId);
              this.isAnimating = false;
              this.isDecrypted = false;
            }
          } else {
            clearInterval(this.intervalId);
            this.isAnimating = false;
            this.isDecrypted = false;
            this.renderText();
          }
        }
      } else {
        // Non-Sequential Forward
        if (this.direction === 'forward') {
          this.displayText = this.shuffleText(this.config.text, this.revealedIndices);
          this.renderText();
          currentIteration++;
          if (currentIteration >= this.config.maxIterations) {
            clearInterval(this.intervalId);
            this.isAnimating = false;
            this.displayText = this.config.text;
            this.isDecrypted = true;
            this.renderText();
          }
        }
        // Non-Sequential Reverse
        if (this.direction === 'reverse') {
          let currentSet = this.revealedIndices;
          if (currentSet.size === 0) {
            currentSet = this.fillAllIndices();
          }
          const removeCount = Math.max(1, Math.ceil(this.config.text.length / Math.max(1, this.config.maxIterations)));
          const nextSet = this.removeRandomIndices(currentSet, removeCount);
          this.revealedIndices = nextSet;
          this.displayText = this.shuffleText(this.config.text, nextSet);
          this.renderText();
          currentIteration++;
          if (nextSet.size === 0 || currentIteration >= this.config.maxIterations) {
            clearInterval(this.intervalId);
            this.isAnimating = false;
            this.isDecrypted = false;
            this.displayText = this.shuffleText(this.config.text, new Set());
            this.renderText();
          }
        }
      }
    }, this.config.speed);
  }

  handleClick() {
    if (this.config.animateOn !== 'click') return;

    if (this.config.clickMode === 'once') {
      if (this.isDecrypted) return;
      this.direction = 'forward';
      this.triggerDecrypt();
    }

    if (this.config.clickMode === 'toggle') {
      if (this.isDecrypted) {
        this.triggerReverse();
      } else {
        this.direction = 'forward';
        this.triggerDecrypt();
      }
    }
  }

  triggerHoverDecrypt() {
    if (this.isAnimating) return;

    this.revealedIndices = new Set();
    this.isDecrypted = false;
    this.displayText = this.config.text;
    this.direction = 'forward';
    this.isAnimating = true;
    this.startAnimation();
  }

  resetToPlainText() {
    clearInterval(this.intervalId);
    this.isAnimating = false;
    this.revealedIndices = new Set();
    this.displayText = this.config.text;
    this.isDecrypted = true;
    this.direction = 'forward';
    this.renderText();
  }

  initEvents() {
    // Hover events
    if (this.config.animateOn === 'hover' || this.config.animateOn === 'inViewHover') {
      this.el.addEventListener('mouseenter', () => this.triggerHoverDecrypt());
      this.el.addEventListener('mouseleave', () => this.resetToPlainText());
    }

    // Click events
    if (this.config.animateOn === 'click') {
      this.el.addEventListener('click', () => this.handleClick());
    }

    // View observer
    if (this.config.animateOn === 'view' || this.config.animateOn === 'inViewHover') {
      const observerCallback = entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !this.hasAnimated) {
            this.triggerDecrypt();
            this.hasAnimated = true;
          }
        });
      };

      const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
      };

      const observer = new IntersectionObserver(observerCallback, observerOptions);
      observer.observe(this.el);
    }
  }
}

// Export to window for vanilla scripts
window.DecryptedText = DecryptedText;
