// Game canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game state
const gameState = {
    bee: {
        x: 100,
        y: canvas.height / 2,
        width: 30,
        height: 20,
        speed: 3,
        isLanded: false,
        landedOnFlower: null,
        facingRight: true
    },
    hive: {
        x: 50,
        y: canvas.height / 2 - 40,
        width: 80,
        height: 80
    },
    flower: {
        x: canvas.width - 100,
        y: canvas.height - 100,
        width: 50,
        height: 60
    }
};

// Keyboard state
const keys = {
    up: false,
    down: false,
    left: false,
    right: false,
    space: false,
    spacePressed: false
};

// Event listeners for keyboard input
document.addEventListener('keydown', (e) => {
    switch(e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
            keys.up = true;
            e.preventDefault();
            break;
        case 's':
        case 'arrowdown':
            keys.down = true;
            e.preventDefault();
            break;
        case 'a':
        case 'arrowleft':
            keys.left = true;
            e.preventDefault();
            break;
        case 'd':
        case 'arrowright':
            keys.right = true;
            e.preventDefault();
            break;
        case ' ':
            if (!keys.spacePressed) {
                keys.space = true;
                keys.spacePressed = true;
            }
            e.preventDefault();
            break;
    }
});

document.addEventListener('keyup', (e) => {
    switch(e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
            keys.up = false;
            break;
        case 's':
        case 'arrowdown':
            keys.down = false;
            break;
        case 'a':
        case 'arrowleft':
            keys.left = false;
            break;
        case 'd':
        case 'arrowright':
            keys.right = false;
            break;
        case ' ':
            keys.spacePressed = false;
            break;
    }
});

// Draw the hive
function drawHive() {
    const hive = gameState.hive;

    // Hive body (hexagonal shape)
    ctx.fillStyle = '#D2691E';
    ctx.beginPath();
    ctx.moveTo(hive.x + 10, hive.y);
    ctx.lineTo(hive.x + hive.width - 10, hive.y);
    ctx.lineTo(hive.x + hive.width, hive.y + 20);
    ctx.lineTo(hive.x + hive.width, hive.y + hive.height - 20);
    ctx.lineTo(hive.x + hive.width - 10, hive.y + hive.height);
    ctx.lineTo(hive.x + 10, hive.y + hive.height);
    ctx.lineTo(hive.x, hive.y + hive.height - 20);
    ctx.lineTo(hive.x, hive.y + 20);
    ctx.closePath();
    ctx.fill();

    // Hive entrance
    ctx.fillStyle = '#8B4513';
    ctx.beginPath();
    ctx.arc(hive.x + hive.width / 2, hive.y + hive.height - 20, 15, 0, Math.PI * 2);
    ctx.fill();

    // Hive details (hexagon pattern)
    ctx.strokeStyle = '#8B4513';
    ctx.lineWidth = 2;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 2; j++) {
            const hexX = hive.x + 15 + j * 25;
            const hexY = hive.y + 15 + i * 20;
            drawHexagon(hexX, hexY, 8);
        }
    }
}

// Draw a small hexagon
function drawHexagon(x, y, size) {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i;
        const hx = x + size * Math.cos(angle);
        const hy = y + size * Math.sin(angle);
        if (i === 0) {
            ctx.moveTo(hx, hy);
        } else {
            ctx.lineTo(hx, hy);
        }
    }
    ctx.closePath();
    ctx.stroke();
}

// Draw the flower
function drawFlower() {
    const flower = gameState.flower;

    // Stem
    ctx.strokeStyle = '#4CAF50';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(flower.x + flower.width / 2, flower.y + flower.height);
    ctx.lineTo(flower.x + flower.width / 2, flower.y + 30);
    ctx.stroke();

    // Flower center
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(flower.x + flower.width / 2, flower.y + 20, 12, 0, Math.PI * 2);
    ctx.fill();

    // Petals (rose - red petals)
    ctx.fillStyle = '#FF1744';
    for (let i = 0; i < 8; i++) {
        const angle = (Math.PI * 2 / 8) * i;
        const petalX = flower.x + flower.width / 2 + Math.cos(angle) * 18;
        const petalY = flower.y + 20 + Math.sin(angle) * 18;
        ctx.beginPath();
        ctx.ellipse(petalX, petalY, 8, 12, angle, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Draw the bee
function drawBee() {
    const bee = gameState.bee;

    // Save canvas state and flip if facing left
    ctx.save();

    if (!bee.facingRight) {
        // Flip horizontally
        ctx.translate(bee.x * 2, 0);
        ctx.scale(-1, 1);
    }

    // Bee body
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.ellipse(bee.x, bee.y, bee.width / 2, bee.height / 2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Bee stripes
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(bee.x - 5, bee.y - 8);
    ctx.lineTo(bee.x - 5, bee.y + 8);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(bee.x + 5, bee.y - 8);
    ctx.lineTo(bee.x + 5, bee.y + 8);
    ctx.stroke();

    // Wings (animated if not landed)
    if (!gameState.bee.isLanded) {
        const wingOffset = Math.sin(Date.now() / 50) * 3;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';

        // Left wing
        ctx.beginPath();
        ctx.ellipse(bee.x - 8, bee.y - 10 + wingOffset, 8, 12, -0.3, 0, Math.PI * 2);
        ctx.fill();

        // Right wing
        ctx.beginPath();
        ctx.ellipse(bee.x + 8, bee.y - 10 - wingOffset, 8, 12, 0.3, 0, Math.PI * 2);
        ctx.fill();
    }

    // Bee eyes
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(bee.x + 10, bee.y - 3, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(bee.x + 10, bee.y + 3, 2, 0, Math.PI * 2);
    ctx.fill();

    // Restore canvas state
    ctx.restore();
}

// Check if bee is near flower
function isNearFlower() {
    const bee = gameState.bee;
    const flower = gameState.flower;

    const distance = Math.sqrt(
        Math.pow(bee.x - (flower.x + flower.width / 2), 2) +
        Math.pow(bee.y - (flower.y + 20), 2)
    );

    return distance < 40;
}

// Update game state
function update() {
    // Handle space key for landing/takeoff
    if (keys.space) {
        keys.space = false;

        if (gameState.bee.isLanded) {
            // Take off
            gameState.bee.isLanded = false;
            gameState.bee.landedOnFlower = null;
        } else if (isNearFlower()) {
            // Land on flower
            gameState.bee.isLanded = true;
            gameState.bee.landedOnFlower = gameState.flower;
            gameState.bee.x = gameState.flower.x + gameState.flower.width / 2;
            gameState.bee.y = gameState.flower.y + 20;
        }
    }

    // Move bee only if not landed
    if (!gameState.bee.isLanded) {
        if (keys.up) {
            gameState.bee.y -= gameState.bee.speed;
        }
        if (keys.down) {
            gameState.bee.y += gameState.bee.speed;
        }
        if (keys.left) {
            gameState.bee.x -= gameState.bee.speed;
            gameState.bee.facingRight = false;
        }
        if (keys.right) {
            gameState.bee.x += gameState.bee.speed;
            gameState.bee.facingRight = true;
        }

        // Keep bee within canvas bounds
        gameState.bee.x = Math.max(gameState.bee.width / 2, Math.min(canvas.width - gameState.bee.width / 2, gameState.bee.x));
        gameState.bee.y = Math.max(gameState.bee.height / 2, Math.min(canvas.height - gameState.bee.height / 2, gameState.bee.y));
    }
}

// Draw everything
function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#E3F2FD');
    gradient.addColorStop(1, '#C8E6C9');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grass
    ctx.fillStyle = '#4CAF50';
    ctx.fillRect(0, canvas.height - 80, canvas.width, 80);

    // Add some grass blades
    ctx.strokeStyle = '#388E3C';
    ctx.lineWidth = 2;
    for (let i = 0; i < 30; i++) {
        const x = (i * 30) % canvas.width;
        ctx.beginPath();
        ctx.moveTo(x, canvas.height - 80);
        ctx.lineTo(x - 5, canvas.height - 90);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x + 15, canvas.height - 80);
        ctx.lineTo(x + 10, canvas.height - 85);
        ctx.stroke();
    }

    // Draw game objects
    drawHive();
    drawFlower();
    drawBee();

    // Draw landing indicator
    if (!gameState.bee.isLanded && isNearFlower()) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = '14px Arial';
        ctx.fillText('Press SPACE to land', canvas.width / 2 - 70, 30);
    }

    // Draw landed status
    if (gameState.bee.isLanded) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.font = '14px Arial';
        ctx.fillText('Landed! Press SPACE to take off', canvas.width / 2 - 100, 30);
    }
}

// Game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();
