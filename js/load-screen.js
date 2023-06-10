const runScreenLoader = (() => {
    const canvas = document.querySelector(".load-screen canvas");
    const ctx = canvas.getContext("2d");
    let particles = [];
    let amount = 0;

    let ww = canvas.width = window.innerWidth;
    let wh = canvas.height = window.innerHeight;

    function Particle(x, y) {
        this.shouldMove = true;
        this.x = Math.random() * ww;
        this.y = Math.random() * wh;
        this.dest = {
            x: x,
            y: y
        };
        this.r = Math.random() + 1;
        this.vx = (Math.random() - 0.5) * 20;
        this.vy = (Math.random() - 0.5) * 20;
        this.accX = 0;
        this.accY = 0;
        this.friction = Math.random() * 0.01 + 0.94;

        this.color = '#fff';
    }

    Particle.prototype.render = function () {
        if (!this.shouldMove) {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, Math.PI * 2, 0);
            ctx.fill();
            return;
        }

        this.accX = (this.dest.x - this.x) / 1000;
        this.accY = (this.dest.y - this.y) / 1000;
        this.vx += this.accX;
        this.vy += this.accY;
        this.vx *= this.friction;
        this.vy *= this.friction;

        this.x += this.vx;
        this.y += this.vy;
        if (Math.abs(this.x - this.dest.x) < 2) {
            this.x = this.dest.x;
        }
        if (Math.abs(this.y - this.dest.y) < 2) {
            this.y = this.dest.y;
        }
        if (this.x === this.dest.x && this.y === this.dest.y) {
            this.shouldMove = false;
        }
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, Math.PI * 2, false);
        ctx.fill();


    }

    function runScreenLoader() {
        ww = canvas.width = window.innerWidth;
        wh = canvas.height = window.innerHeight;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.font = "normal " + (ww / 10) + "px monospace";
        ctx.textAlign = "center";
        ctx.fillText('Particle OS', ww / 2, wh / 2);

        const data = ctx.getImageData(0, 0, ww, wh).data;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = "screen";

        particles = [];
        for (let i = 0; i < ww; i += Math.round(ww / 1000)) {
            for (let j = 0; j < wh; j += Math.round(ww / 1000)) {
                if (data[((i + j * ww) * 4) + 3] > 150) {
                    particles.push(new Particle(i, j));
                }
            }
        }
        amount = particles.length;

        requestAnimationFrame(render);
    }


    function render() {
        const particlesToMove = particles.filter(p => p.shouldMove);
        if (particlesToMove.length) {
            requestAnimationFrame(render);
        } else {
            dispatchOsEvents(osEventsTypes.SCREEN_LOAD_END);
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < amount; i++) {
            particles[i].render();
        }
    }


    return runScreenLoader;
})();
