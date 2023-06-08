const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//console.log(ctx);
ctx.fillStyle = 'white';
ctx.strokeStyle = 'white';
ctx.lineWidth = 1;
//ctx.lineCap = 'round';
//arc x, y, radius, startAngle, endAngle Radians 
//StartAngle is at 3'oclock and goes clockwise (opposite rotation to regular math)
//ctx.arc(100,100, 150, 0, Math.PI );
//ctx.fill();

class Particle {
    constructor(effect) {
        this.effect = effect;
        this.x = Math.floor(Math.random() * this.effect.width);
        this.y = Math.floor(Math.random() * this.effect.height);
        this.speedX;
        this.speedY;
        this.speedModifier = Math.floor(Math.random() * 5 + 1);
        this.history = [{x: this.x, y: this.y}];
        this.maxLenght = Math.floor(Math.random() * 200 + 10);
        this.timer = this.maxLenght * 2;
        this.angle = 0;
        this.colors = ['#4c026b', '#730d9e', '#9622c7', '#b44ae0', '#cd72f2'];
        this.color = this.colors[Math.floor(Math.random() * this.colors.length)];

    }
    draw(context) { 
        //context.fillRect(this.x, this.y, 10, 10);
        context.beginPath();
        context.moveTo(this.history[0].x, this.history[0].y);
        for (let i = 0; i < this.history.length; i++) {
            context.lineTo(this.history[i].x, this.history[i].y)
        }
        context.strokeStyle = this.color;
        context.stroke();

    }
    // update() {
    //     this.angle += 0.5;
    //     this.x += this.speedX + Math.sin(this.angle) * 10;
    //     this.y += this.speedY + Math.cos(this.angle) * 7;
    //     this.history.push({x: this.x, y: this.y});
    //     if (this.history.length > this.maxLenght){
    //         this.history.shift();
    //     }
    // }
    update() {
        this.timer--;
        if (this.timer >= 1){
            let x = Math.floor(this.x / this.effect.cellSize);
            let y = Math.floor(this.y / this.effect.cellSize);
            let index = y * this.effect.cols + x;
            this.angle = this.effect.flowField[index];
            this.speedX = Math.cos(this.angle);
            this.speedY = Math.sin(this.angle);
            this.x += this.speedX * this.speedModifier;
            this.y += this.speedY * this.speedModifier;
            this.history.push({x: this.x, y: this.y});
            if (this.history.length > this.maxLenght) {
                this.history.shift();
            }
        } else if (this.history.length > 1){
            this.history.shift();
        } else {
            this.reset();
        }
        

    }
    reset() {
        this.x = Math.floor(Math.random() * this.effect.width);
        this.y = Math.floor(Math.random() * this.effect.height);
        this.history = [{x: this.x, y: this.y}];
        this.timer = this.maxLenght * 2;
    }
}

class Effect {
    constructor(canvas) {
        this.canvas = canvas
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.particles = [];
        
        //this.cellSize = 20;
        this.rows;
        this.cols;
        this.flowField = [];
        this.init();
        window.addEventListener('keydown', e => {
            if (e.key === 'd') {
                this.debug = !this.debug;
            }
            
        });
        window.addEventListener('resize', e => {
            this.resize(e.target.innerWidth, e.target.innerHeight)
        })
    }
    resize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
        //init();
    }
    init() {
        //create flow field
        this.rows = Math.floor(this.height / this.cellSize);
        this.cols = Math.floor(this.width / this.cellSize);
        this.flowField = [];
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                let angle = (Math.cos(x * this.zoom) + Math.sin(y * this.zoom)) * this.curve;
                this.flowField.push(angle);
            }
            //console.log(this.flowField);
        }
        //
        this.particles = [];
        for (let i = 0; i < this.numberOfParticles; i++) {
            this.particles.push(new Particle(this));
        }
        
    }
    drawGrid(context) {
        context.save();
        context.strokeStyle = 'red';
        context.lineWidth = 0.7;
        for (let c = 0; c < this.cols; c++) {
            context.beginPath();
            context.moveTo(this.cellSize * c, 0);
            context.lineTo(this.cellSize * c, this.height);
            context.stroke();
        }
        for (let r = 0; r < this.rows; r++) {
            context.beginPath();
            context.moveTo(0, this.cellSize * r);
            context.lineTo(this.width, this.cellSize * r);
            context.stroke();
        }
        context.restore();
    }
    render(context) {
        if (this.debug === true) {
            this.drawGrid(context);
        }
        this.particles.forEach(particle => {
            particle.draw(context);
            particle.update();
        })
    }
    
}
Effect.prototype.numberOfParticles = 2000;
Effect.prototype.curve = 2.2;
Effect.prototype.zoom = 0.2;
Effect.prototype.cellSize = 10;
Effect.prototype.debug = true;
const effect = new Effect(canvas);
console.log(effect);


function animate() {
    ctx.clearRect(0,0, canvas.width, canvas.height);
    effect.render(ctx);
    requestAnimationFrame(animate);
}
animate();