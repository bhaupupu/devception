import { Server } from 'socket.io';
import { AuthenticatedSocket } from '../middleware/socketAuth';
import * as gameService from '../../services/game.service';
import { endGame } from '../../services/game.service';

function validateSolution(submittedCode: string, solutionCode: string): boolean {
  // MVP: normalize whitespace and compare
  const normalize = (s: string) => s.replace(/\s+/g, ' ').trim().toLowerCase();
  return normalize(submittedCode) === normalize(solutionCode);
}

export function registerTaskHandlers(io: Server, socket: AuthenticatedSocket): void {
  // Imposter fake-complete: marks task as done without validation, no progress increment
  socket.on(
    'task:fake-complete',
    ({ roomCode, taskId }: { roomCode: string; taskId: string }) => {
      const game = gameService.getLiveGame(roomCode);
      if (!game) return;

      const player = game.players.find((p) => p.userId === socket.userId);
      if (!player || player.role !== 'imposter') return;

      const task = game.tasks.find((t) => t._id === taskId && t.assignedTo === socket.userId);
      if (!task || task.isCompleted) return;

      task.isCompleted = true;
      task.completedBy = socket.userId;
      if (!player.tasksCompleted.includes(taskId)) {
        player.tasksCompleted.push(taskId);
      }

      // Notify the imposter that their task is done
      socket.emit('task:result', { taskId, passed: true, feedback: 'Task marked complete.' });
      // Broadcast to room so others see progress (progress value unchanged — imposter doesn't help)
      io.to(roomCode).emit('task:completed', {
        taskId,
        completedBy: socket.userId,
        completedByName: socket.displayName,
        sharedProgress: game.sharedProgress,
      });
    }
  );

  socket.on(
    'task:submit',
    async ({
      roomCode,
      taskId,
      submittedCode,
    }: {
      roomCode: string;
      taskId: string;
      submittedCode: string;
    }) => {
      const game = gameService.getLiveGame(roomCode);
      if (!game) return;

      const task = game.tasks.find((t) => t._id === taskId);
      if (!task) {
        socket.emit('task:result', { taskId, passed: false, feedback: 'Task not found' });
        return;
      }

      const passed = validateSolution(submittedCode, task.solutionCode);

      socket.emit('task:result', {
        taskId,
        passed,
        feedback: passed ? 'Correct!' : 'Not quite right, keep trying.',
      });

      if (passed) {
        const result = gameService.completeTask(roomCode, taskId, socket.userId);
        if (result) {
          io.to(roomCode).emit('task:completed', {
            taskId,
            completedBy: socket.userId,
            completedByName: socket.displayName,
            sharedProgress: result.sharedProgress,
          });
          io.to(roomCode).emit('task:progress-update', { sharedProgress: result.sharedProgress });

          if (result.allDone) {
            await endGame(roomCode, 'good-coders');
            io.to(roomCode).emit('game:end', { winner: 'good-coders' });
          }
        }
      }
    }
  );
}
