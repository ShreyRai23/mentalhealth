'use client';
import React, { useRef, useEffect } from 'react';

const PulseRunner: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Game constants
    const GRAVITY = 0.45;
    const FLAP_V = -8.5;
    const PIPE_GAP = 150;
    const PIPE_W = 60;
    const PIPE_INTERVAL = 1400; // ms between pipes
    const GROUND_H = 80;

    // State
    let lastTime = 0;
    let pipes: { x: number; top: number; passed?: boolean }[] = [];
    let running = false;
    let gameOver = false;
    let score = 0;
    let highScore = 0;
    let pipeTimer = 0;
    let frame = 0;

    // Bird
    const bird = {
      x: 110,
      y: canvas.height / 2,
      r: 16,
      vy: 0,
      rot: 0,
    };

    // Responsive scaling
    function fit() {
      const parent = canvas!.parentElement;
      if (!parent) return;

      const margin = 20;
      const w = parent.clientWidth - margin * 2;
      const h = parent.clientHeight - margin * 2;
      let scale = Math.min(w / canvas.width, h / canvas.height);
      
      canvas!.style.width = Math.round(canvas.width * scale) + 'px';
      canvas!.style.height = Math.round(canvas.height * scale) + 'px';
    }
    window.addEventListener('resize', fit);
    fit();

    // Input
    function flap() {
      if (gameOver) return;
      bird.vy = FLAP_V;
      running = true;
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.code === 'Space') {
        e.preventDefault();
        flap();
      }
      if (e.key === 'r' || e.key === 'R') reset();
    }

    function handleCanvasClick() {
        if (gameOver) {
            reset();
        } else {
            flap();
        }
    }

    window.addEventListener('keydown', handleKeyDown);
    canvas.addEventListener('mousedown', handleCanvasClick);
    const touchHandler = (e: TouchEvent) => { e.preventDefault(); handleCanvasClick() };
    canvas.addEventListener('touchstart', touchHandler, { passive: false });

    // Pipes generator
    function spawnPipe() {
      const minTop = 60;
      const maxTop = canvas.height - GROUND_H - PIPE_GAP - 60;
      const top = minTop + Math.random() * Math.max(0, maxTop - minTop);
      pipes.push({ x: canvas.width, top: top });
    }

    // Reset game
    function reset() {
      pipes = [];
      bird.x = 110;
      bird.y = canvas.height / 2;
      bird.vy = 0;
      bird.rot = 0;
      lastTime = performance.now();
      pipeTimer = 0;
      running = false;
      gameOver = false;
      score = 0;
      frame = 0;
    }
    reset();

    // Collision helpers
    function rectsOverlap(
      ax: number, ay: number, aw: number, ah: number,
      bx: number, by: number, bw: number, bh: number
    ) {
      return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
    }

    // Main loop
    let animationFrameId: number;
    function loop(t: number) {
      const dt = Math.min(34, t - lastTime);
      lastTime = t;
      frame++;

      if (!gameOver && running) {
        // Physics
        bird.vy += GRAVITY;
        bird.y += bird.vy;
        bird.rot = Math.max(-0.6, Math.min(1.0, bird.vy * 0.04));

        // Pipes movement
        const spd = 2.2 + Math.min(2, score * 0.03);
        for (let p of pipes) p.x -= spd;

        // Spawn pipes
        pipeTimer += dt;
        if (pipeTimer >= PIPE_INTERVAL) {
          pipeTimer = 0;
          spawnPipe();
        }

        // Remove offscreen & increase score
        if (pipes.length > 0 && pipes[0].x + PIPE_W < bird.x - bird.r && !pipes[0].passed) {
          score++;
          if (score > highScore) highScore = score;
          pipes[0].passed = true;
        }
        
        if (pipes.length > 0 && pipes[0].x + PIPE_W < 0) {
            pipes.shift();
        }


        // Collisions with pipes
        for (let p of pipes) {
          if (
            rectsOverlap(bird.x - bird.r, bird.y - bird.r, bird.r * 2, bird.r * 2, p.x, 0, PIPE_W, p.top) ||
            rectsOverlap(bird.x - bird.r, bird.y - bird.r, bird.r * 2, bird.r * 2, p.x, p.top + PIPE_GAP, PIPE_W, canvas.height - GROUND_H - (p.top + PIPE_GAP))
          ) {
            gameOver = true;
          }
        }

        // Floor/ceiling collision
        if (bird.y + bird.r > canvas.height - GROUND_H || bird.y - bird.r < 0) {
          gameOver = true;
        }

        if (gameOver) running = false;
      }

      render();
      animationFrameId = requestAnimationFrame(loop);
    }
    
    // Draw functions
    function drawBackground() {
        ctx.fillStyle = '#74c27f';
        ctx.globalAlpha = 0.6;
        ctx.beginPath();
        ctx.ellipse(80, canvas.height - 150, 120, 60, 0, 0, Math.PI*2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(380, canvas.height - 160, 140, 70, 0, 0, Math.PI*2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }

    function drawPipes() {
        for (let p of pipes) {
            const grad = ctx.createLinearGradient(p.x, 0, p.x + PIPE_W, 0);
            grad.addColorStop(0, '#2b8a3a');
            grad.addColorStop(0.5, '#3aa34a');
            grad.addColorStop(1, '#2b8a3a');
            ctx.fillStyle = grad;

            ctx.fillRect(p.x, 0, PIPE_W, p.top);
            ctx.fillRect(p.x, p.top + PIPE_GAP, PIPE_W, canvas.height - GROUND_H - (p.top + PIPE_GAP));
            
            const capH = 20;
            const gradCap = ctx.createLinearGradient(p.x - 8, 0, p.x + PIPE_W + 16, 0);
            gradCap.addColorStop(0, '#226a2e');
            gradCap.addColorStop(0.5, '#349a43');
            gradCap.addColorStop(1, '#226a2e');
            ctx.fillStyle = gradCap;

            ctx.fillRect(p.x - 8, p.top - capH, PIPE_W + 16, capH);
            ctx.fillRect(p.x - 8, p.top + PIPE_GAP, PIPE_W + 16, capH);
        }
    }

    function drawGround() {
        ctx.fillStyle = '#d5b280';
        ctx.fillRect(0, canvas.height - GROUND_H, canvas.width, GROUND_H);
        ctx.fillStyle = '#b59468';
        ctx.fillRect(0, canvas.height - GROUND_H, canvas.width, 10);

        ctx.fillStyle = '#caa86b';
        for (let i=0;i<canvas.width;i+=30) ctx.fillRect(i + 5, canvas.height - GROUND_H + 15, 4, 4);
    }

    function drawBird() {
        ctx.save();
        ctx.translate(bird.x, bird.y);
        ctx.rotate(bird.rot);
        
        // Wing animation
        const wingAngle = Math.sin(frame * 0.4) * 0.4 - 0.2;
        
        // body
        ctx.fillStyle = '#ffdd57';
        ctx.beginPath();
        ctx.ellipse(0, 0, bird.r*1.1, bird.r, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#d8b940';
        ctx.lineWidth = 1;
        ctx.stroke();

        // wing
        ctx.fillStyle = '#f5c24a';
        ctx.beginPath();
        ctx.ellipse(-2, 2, bird.r*0.65, bird.r*0.4, wingAngle, 0, Math.PI * 2);
        ctx.fill();
        
        // eye
        ctx.fillStyle = '#222';
        ctx.beginPath();
        ctx.arc(bird.r * 0.4, -4, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(bird.r * 0.45, -4.5, 1, 0, Math.PI * 2);
        ctx.fill();
        
        // beak
        ctx.fillStyle = '#ff8a2c';
        ctx.beginPath();
        ctx.moveTo(bird.r*0.9, 0);
        ctx.lineTo(bird.r * 1.9, -4);
        ctx.lineTo(bird.r * 1.9, 4);
        ctx.closePath();
        ctx.fill();
        
        ctx.restore();
    }
    
    function drawUI() {
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.font = '20px "Lexend", system-ui, Segoe UI, Roboto';
        ctx.textAlign = 'left';
        ctx.fillText('Score: ' + score, 12, 28);
        ctx.textAlign = 'right';
        ctx.fillText('High: ' + highScore, canvas.width - 12, 28);

        if (!running && !gameOver) {
            ctx.fillStyle = 'rgba(255,255,255,0.9)';
            ctx.textAlign = 'center';
            ctx.font = '28px "Lexend", system-ui, Segoe UI, Roboto';
            ctx.fillText('Click / Space to flap', canvas.width/2, canvas.height/2 - 10);
            ctx.font = '16px "Lexend", system-ui, Segoe UI, Roboto';
            ctx.fillText('Game will start when you flap', canvas.width/2, canvas.height/2 + 18);
        }

        if (gameOver) {
            ctx.fillStyle = 'rgba(0,0,0,0.7)';
            ctx.fillRect(canvas.width/2 - 150, canvas.height/2 - 70, 300, 140);
            ctx.fillStyle = '#fff';
            ctx.font = '32px "Lexend", system-ui, Segoe UI, Roboto';
            ctx.textAlign = 'center';
            ctx.fillText('Game Over', canvas.width/2, canvas.height/2 - 22);
            ctx.font = '18px "Lexend", system-ui, Segoe UI, Roboto';
            ctx.fillText('Score: ' + score + '   High: ' + highScore, canvas.width/2, canvas.height/2 + 12);
            ctx.fillText('Click to Restart', canvas.width/2, canvas.height/2 + 42);
        }
    }

    function render() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawBackground();
      drawPipes();
      drawGround();
      drawBird();
      drawUI();
    }

    // Start loop
    animationFrameId = requestAnimationFrame(loop);
    
    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', fit);
      window.removeEventListener('keydown', handleKeyDown);
      canvas.removeEventListener('mousedown', handleCanvasClick);
      canvas.removeEventListener('touchstart', touchHandler);
    };
  }, []);

  return <canvas ref={canvasRef} width="480" height="640" className="bg-gradient-to-b from-[#80d0ff] to-[#bfe9ff] rounded-lg shadow-lg"></canvas>;
};

export default PulseRunner;
