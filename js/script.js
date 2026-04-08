/*Copyright (c) 2023 by Hakim El Hattab (https://codepen.io/hakimel/pen/bzrZGo)
*          *     .        *  .    *    *   . 
 .  *  move your mouse to over the stars   .
 *  .  .   change these values:   .  *
   .      * .        .          * .       */
const STAR_COLOR = '#fff';
const STAR_SIZE = 3;
const STAR_MIN_SCALE = 0.2;
const OVERFLOW_THRESHOLD = 50;
const STAR_COUNT = ( window.innerWidth + window.innerHeight ) / 6;

const canvas = document.querySelector( 'canvas' ),
      context = canvas.getContext( '2d' );

let scale = 1, // device pixel ratio
    width,
    height;

let stars = [];

let pointerX,
    pointerY;

let velocity = { x: 0, y: 0, tx: 0, ty: 0, z: 0.0005 };

let touchInput = false;

generate();
resize();
step();

window.onresize = resize;
document.addEventListener('mousemove', onMouseMove);
document.addEventListener('touchmove', onTouchMove);
document.addEventListener('touchend', onMouseLeave);
document.addEventListener('mouseleave', onMouseLeave);

function generate() {

   for( let i = 0; i < STAR_COUNT; i++ ) {
    stars.push({
      x: 0,
      y: 0,
      z: STAR_MIN_SCALE + Math.random() * ( 1 - STAR_MIN_SCALE )
    });
   }

}

function placeStar( star ) {

  star.x = Math.random() * width;
  star.y = Math.random() * height;

}

function recycleStar( star ) {

  let direction = 'z';

  let vx = Math.abs( velocity.x ),
	    vy = Math.abs( velocity.y );

  if( vx > 1 || vy > 1 ) {
    let axis;

    if( vx > vy ) {
      axis = Math.random() < vx / ( vx + vy ) ? 'h' : 'v';
    }
    else {
      axis = Math.random() < vy / ( vx + vy ) ? 'v' : 'h';
    }

    if( axis === 'h' ) {
      direction = velocity.x > 0 ? 'l' : 'r';
    }
    else {
      direction = velocity.y > 0 ? 't' : 'b';
    }
  }
  
  star.z = STAR_MIN_SCALE + Math.random() * ( 1 - STAR_MIN_SCALE );

  if( direction === 'z' ) {
    star.z = 0.1;
    star.x = Math.random() * width;
    star.y = Math.random() * height;
  }
  else if( direction === 'l' ) {
    star.x = -OVERFLOW_THRESHOLD;
    star.y = height * Math.random();
  }
  else if( direction === 'r' ) {
    star.x = width + OVERFLOW_THRESHOLD;
    star.y = height * Math.random();
  }
  else if( direction === 't' ) {
    star.x = width * Math.random();
    star.y = -OVERFLOW_THRESHOLD;
  }
  else if( direction === 'b' ) {
    star.x = width * Math.random();
    star.y = height + OVERFLOW_THRESHOLD;
  }

}

function resize() {

  scale = window.devicePixelRatio || 1;

  width = window.innerWidth * scale;
  height = window.innerHeight * scale;

  canvas.width = width;
  canvas.height = height;

  stars.forEach( placeStar );

}

function step() {

  context.clearRect( 0, 0, width, height );

  update();
  render();

  requestAnimationFrame( step );

}

function update() {

  velocity.tx *= 0.8;
  velocity.ty *= 0.8;

  velocity.x += ( velocity.tx - velocity.x ) * 0.8;
  velocity.y += ( velocity.ty - velocity.y ) * 0.8;

  stars.forEach( ( star ) => {

    star.x += velocity.x * star.z;
    star.y += velocity.y * star.z;

    star.x += ( star.x - width/2 ) * velocity.z * star.z;
    star.y += ( star.y - height/2 ) * velocity.z * star.z;
    star.z += velocity.z;
  
    // recycle when out of bounds
    if( star.x < -OVERFLOW_THRESHOLD || star.x > width + OVERFLOW_THRESHOLD || star.y < -OVERFLOW_THRESHOLD || star.y > height + OVERFLOW_THRESHOLD ) {
      recycleStar( star );
    }

  } );

}

function render() {

  stars.forEach( ( star ) => {

    context.beginPath();
    context.lineCap = 'round';
    context.lineWidth = STAR_SIZE * star.z * scale;
    context.globalAlpha = 0.5 + 0.5*Math.random();
    context.strokeStyle = STAR_COLOR;

    context.beginPath();
    context.moveTo( star.x, star.y );

    var tailX = velocity.x * 2,
        tailY = velocity.y * 2;

    // stroke() wont work on an invisible line
    if( Math.abs( tailX ) < 0.1 ) tailX = 0.5;
    if( Math.abs( tailY ) < 0.1 ) tailY = 0.5;

    context.lineTo( star.x + tailX, star.y + tailY );

    context.stroke();

  } );

}

function movePointer( x, y ) {

  if( typeof pointerX === 'number' && typeof pointerY === 'number' ) {

    let ox = x - pointerX,
        oy = y - pointerY;

    velocity.tx = velocity.tx + ( ox / 8*scale ) * ( touchInput ? 1 : -1 );
    velocity.ty = velocity.ty + ( oy / 8*scale ) * ( touchInput ? 1 : -1 );

  }

  pointerX = x;
  pointerY = y;

}

function onMouseMove( event ) {

  touchInput = false;

  movePointer( event.clientX, event.clientY );

}

function onTouchMove( event ) {

  touchInput = true;

  movePointer( event.touches[0].clientX, event.touches[0].clientY, true );

  event.preventDefault();

}

function onMouseLeave() {

  pointerX = null;
  pointerY = null;

}

// Project Tab Filtering
document.addEventListener('DOMContentLoaded', function() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const projectCards = document.querySelectorAll('.project-card');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons
      tabBtns.forEach(b => b.classList.remove('active'));
      // Add active class to clicked button
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');

        if (filter === 'all' || category === filter) {
          card.classList.remove('hidden');
          card.style.animation = 'fadeIn 0.5s ease forwards';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
});

// Add fadeIn animation
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(style);

// ---------- yearly contribution graph (canvas) ----------
// aggregates last 360 days into 24 bi-weekly buckets (15 days each, 2 per month)
async function renderGithubYearGraph() {
  const canvas = document.getElementById('gh-year-canvas');
  const wrap = canvas ? canvas.parentElement : null;
  const fallback = document.getElementById('gh-year-fallback');
  const totalEl = document.getElementById('gh-year-total');
  if (!canvas || !wrap) return;

  let contributions;
  try {
    const resp = await fetch('https://github-contributions-api.jogruber.de/v4/cdneeee?y=last');
    if (!resp.ok) throw new Error('status ' + resp.status);
    const json = await resp.json();
    contributions = json.contributions;
  } catch (err) {
    console.warn('[github year graph] fetch failed:', err);
    wrap.hidden = true;
    if (fallback) fallback.hidden = false;
    return;
  }
  if (!Array.isArray(contributions) || contributions.length === 0) {
    wrap.hidden = true;
    if (fallback) fallback.hidden = false;
    return;
  }

  // total = full last-year window (matches what GitHub shows on the profile)
  const yearWindow = contributions.slice(-365);
  const total = yearWindow.reduce((s, d) => s + (d.count || 0), 0);
  if (totalEl) totalEl.textContent = total.toLocaleString() + ' contributions';

  // build 24 bi-weekly buckets ending today (15 days × 24 = 360 days)
  const BUCKETS = 24;
  const BUCKET_DAYS = 15;
  const needed = BUCKETS * BUCKET_DAYS;
  const tail = contributions.slice(-needed);
  const buckets = [];
  for (let i = 0; i < BUCKETS; i++) {
    const slice = tail.slice(i * BUCKET_DAYS, (i + 1) * BUCKET_DAYS);
    if (slice.length === 0) continue;
    const count = slice.reduce((s, d) => s + (d.count || 0), 0);
    buckets.push({ startDate: new Date(slice[0].date), count });
  }

  const draw = () => {
    const dpr = window.devicePixelRatio || 1;
    const rect = wrap.getBoundingClientRect();
    const W = Math.max(320, Math.round(rect.width));
    const H = Math.max(180, Math.round(rect.height));
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);

    const pad = { l: 40, r: 18, t: 14, b: 30 };
    const cw = W - pad.l - pad.r;
    const ch = H - pad.t - pad.b;
    if (cw <= 0 || ch <= 0) return;

    const maxCount = Math.max(1, ...buckets.map(b => b.count));
    // round to a tighter y-axis max so the graph looks more filled
    const niceMax = Math.max(5, Math.ceil(maxCount / 5) * 5);

    // horizontal grid + y labels
    ctx.font = '10px "Space Mono", ui-monospace, monospace';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'right';
    const ySteps = 4;
    for (let i = 0; i <= ySteps; i++) {
      const y = pad.t + (ch / ySteps) * i;
      ctx.strokeStyle = 'rgba(123, 0, 255, 0.12)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(pad.l, y);
      ctx.lineTo(pad.l + cw, y);
      ctx.stroke();
      const val = Math.round(niceMax * (1 - i / ySteps));
      ctx.fillStyle = '#7b00ff';
      ctx.fillText(String(val), pad.l - 8, y);
    }

    // x positions for each bucket
    const pts = buckets.map((b, i) => ({
      x: pad.l + (cw * i) / Math.max(1, buckets.length - 1),
      y: pad.t + ch - (b.count / niceMax) * ch,
      bucket: b
    }));

    // month labels: show when the month of a bucket start-date is new
    const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    let lastMonth = -1;
    pts.forEach((p) => {
      const m = p.bucket.startDate.getMonth();
      if (m !== lastMonth) {
        ctx.strokeStyle = 'rgba(123, 0, 255, 0.10)';
        ctx.beginPath();
        ctx.moveTo(p.x, pad.t);
        ctx.lineTo(p.x, pad.t + ch);
        ctx.stroke();
        ctx.fillStyle = '#7b00ff';
        ctx.fillText(monthNames[m], p.x, pad.t + ch + 8);
        lastMonth = m;
      }
    });

    // Catmull-Rom to cubic Bezier — passes through every data point exactly
    // For each segment P1->P2, control points are:
    //   c1 = P1 + (P2 - P0) / (6 * tension)
    //   c2 = P2 - (P3 - P1) / (6 * tension)
    const tracePath = (moveStart = true) => {
      if (moveStart) ctx.moveTo(pts[0].x, pts[0].y);
      const tension = 1; // 1 = standard Catmull-Rom
      for (let i = 0; i < pts.length - 1; i++) {
        const p0 = pts[i - 1] || pts[i];
        const p1 = pts[i];
        const p2 = pts[i + 1];
        const p3 = pts[i + 2] || pts[i + 1];
        const c1x = p1.x + (p2.x - p0.x) / (6 * tension);
        const c1y = p1.y + (p2.y - p0.y) / (6 * tension);
        const c2x = p2.x - (p3.x - p1.x) / (6 * tension);
        const c2y = p2.y - (p3.y - p1.y) / (6 * tension);
        // clamp control points inside the chart so curves don't overshoot top
        const clampY = (y) => Math.max(pad.t, Math.min(pad.t + ch, y));
        ctx.bezierCurveTo(c1x, clampY(c1y), c2x, clampY(c2y), p2.x, p2.y);
      }
    };

    // area fill
    const grad = ctx.createLinearGradient(0, pad.t, 0, pad.t + ch);
    grad.addColorStop(0, 'rgba(123, 0, 255, 0.55)');
    grad.addColorStop(1, 'rgba(0, 161, 255, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pad.t + ch);
    ctx.lineTo(pts[0].x, pts[0].y);
    tracePath(false);
    ctx.lineTo(pts[pts.length - 1].x, pad.t + ch);
    ctx.closePath();
    ctx.fill();

    // line on top
    ctx.strokeStyle = '#00a1ff';
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.beginPath();
    tracePath();
    ctx.stroke();

    // small points at each bucket
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#00a1ff';
    ctx.lineWidth = 1.5;
    pts.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });
  };

  // wait one frame so the wrap has its final layout size before first draw
  requestAnimationFrame(draw);

  if ('ResizeObserver' in window) {
    const ro = new ResizeObserver(() => {
      // debounce via rAF
      window.cancelAnimationFrame(draw._raf);
      draw._raf = window.requestAnimationFrame(draw);
    });
    ro.observe(wrap);
  } else {
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(draw, 120);
    });
  }
}
document.addEventListener('DOMContentLoaded', renderGithubYearGraph);

// ---------- scroll reveal ----------
document.addEventListener('DOMContentLoaded', () => {
  const revealEls = document.querySelectorAll('.reveal, .reveal-stagger');
  if (!('IntersectionObserver' in window) || revealEls.length === 0) {
    revealEls.forEach(el => el.classList.add('in-view'));
    return;
  }
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px'
  });
  revealEls.forEach(el => revealObserver.observe(el));
});

// ---------- active nav highlight ----------
document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelectorAll('.navbar .menu li a[href^="#"]');
  if (navLinks.length === 0) return;

  const linkByHash = new Map();
  navLinks.forEach(link => {
    const hash = link.getAttribute('href');
    if (hash && hash.startsWith('#') && hash.length > 1) {
      linkByHash.set(hash.slice(1), link);
    }
  });

  const sections = Array.from(linkByHash.keys())
    .map(id => document.getElementById(id))
    .filter(Boolean);

  if (sections.length === 0) return;

  const setActive = (id) => {
    navLinks.forEach(l => l.classList.remove('active-nav'));
    const link = linkByHash.get(id);
    if (link) link.classList.add('active-nav');
  };

  if (!('IntersectionObserver' in window)) return;

  const visibility = new Map();
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      visibility.set(entry.target.id, entry.intersectionRatio);
    });
    let topId = null;
    let topRatio = 0;
    visibility.forEach((ratio, id) => {
      if (ratio > topRatio) {
        topRatio = ratio;
        topId = id;
      }
    });
    if (topId && topRatio > 0) setActive(topId);
  }, {
    // trigger as a section crosses the middle of the viewport
    rootMargin: '-40% 0px -50% 0px',
    threshold: [0, 0.25, 0.5, 0.75, 1]
  });

  sections.forEach(sec => navObserver.observe(sec));

  // smooth-scroll anchor clicks (also closes mobile menu if open)
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const hash = link.getAttribute('href');
      if (!hash || !hash.startsWith('#')) return;
      const target = document.getElementById(hash.slice(1));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', hash);
      const menu = document.querySelector('.navbar .menu');
      if (menu && menu.classList.contains('active')) {
        menu.classList.remove('active');
        document.querySelector('.menu-btn i')?.classList.remove('active');
      }
    });
  });
});
