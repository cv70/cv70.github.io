function updateSnake() {
    // Update direction
    direction = nextDirection;

    // Calculate new head position
    const head = {x: snake[0].x, y: snake[0].y};
    
    switch(direction) {
        case 'up':    head.y--; break;
        case 'down':  head.y++; break;
        case 'left':  head.x--; break;
        case 'right': head.x++; break;
    }

    // Check collision with walls
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        gameOver();
        return;
    }

    // Check collision with self
    for (let i = 0; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver();
            return;
        }
    }

    // Add new head
    snake.unshift(head);

    // Check if snake ate food
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.textContent = `得分: ${score}`;
        generateFood();
        // Speed up slightly with each food eaten
        if (gameSpeed > 50) gameSpeed -= 2;
    } else {
        // Remove tail if no food eaten
        snake.pop();
    }
}

function drawSnake() {
    ctx.fillStyle = 'green';
    for (let i = 0; i < snake.length; i++) {
        ctx.fillRect(snake[i].x * gridSize, snake[i].y * gridSize, gridSize - 1, gridSize - 1);
    }
}