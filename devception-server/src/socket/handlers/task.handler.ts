import { Server } from 'socket.io';
import { AuthenticatedSocket } from '../middleware/socketAuth';
import * as gameService from '../../services/game.service';
import { endGame } from '../../services/game.service';
import { runTestCases } from '../../services/taskRunner.service';

export function registerTaskHandlers(io: Server, socket: AuthenticatedSocket): void {
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
        socket.emit('task:result', {
          taskId,
          passed: false,
          feedback: 'Task not found.',
          verdicts: [],
          supported: true,
        });
        return;
      }

      const { supported, allPassed, verdicts, note } = runTestCases(
        game.language,
        submittedCode,
        task.testCases ?? []
      );

      const passedCount = verdicts.filter((v) => v.passed).length;
      const feedback = !supported
        ? note ?? 'Test execution unsupported for this language.'
        : allPassed
          ? `All ${verdicts.length} test cases passed.`
          : `${passedCount}/${verdicts.length} test cases passed.`;

      socket.emit('task:result', {
        taskId,
        passed: allPassed,
        feedback,
        verdicts,
        supported,
      });

      if (allPassed) {
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
            try { await endGame(roomCode, 'good-coders'); } catch (err) { console.error('endGame error:', err); }
            io.to(roomCode).emit('game:end', { winner: 'good-coders' });
          }
        }
      }
    }
  );
}
