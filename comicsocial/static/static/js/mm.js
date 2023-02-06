const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

var mouseX, mouseY;

// Mouse Class
class Mouse
{
    constructor(x, y, width, height, image)
    {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        //new Image image = image
    }
    
    draw()
    {
        ctx.fillStyle = 'blue'
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }
}

// Death Rectangle Class
class DeathRect
{
    constructor(x, y, width, height, image)
    {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        //new Image image = image
    }
    
    draw()
    {
        ctx.fillStyle = 'red'
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }
}

// Finish blcok class
class Finish
{
    constructor(x, y, width, height, image)
    {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        //new Image image = image
    }
    
    draw()
    {
        ctx.fillStyle = 'green'
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }
}

var mouse = new Mouse(100, 100, 32, 32);

function start()
{
    //mouse = new Mouse(mouseX, mouseY, 32, 32);
    mouse.draw();
}

window.addEventListener("mousemove", (e) => { let mouseX = e.clientX; let mouseY = e.clientY; })
