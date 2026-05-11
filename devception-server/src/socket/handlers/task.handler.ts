import { Server } from 'socket.io';
import { AuthenticatedSocket } from '../middleware/socketAuth';
import * as gameService from '../../services/game.service';
import { endGame } from '../../services/game.service';
import { runTestCases } from '../../services/taskRunner.service';
import { logger } from '../../utils/logger';

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

      // Bug fix: use task.language (each task declares its own language), NOT
      // game.language. A C++ lobby can contain Python tasks and vice-versa.
      const taskLanguage = (task as any).language ?? game.language;
      const { supported, allPassed, verdicts, note } = runTestCases(
        taskLanguage,
        submittedCode,
        task.testCases ?? []
      );

      const passedCount = verdicts.filter((v) => v.passed).length;
      const feedback = !supported
        ? note ?? 'Test execution unsupported for this language.'
        : allPassed
          ? `All ${verdicts.length} test cases passed.`
          : `${passedCount}/${verdicts.length} test cases passed.`;

      // On failure: send ONLY the failed verdicts so players cannot reverse-engineer
      // the solution by observing which cases already pass. On full success, reveal all.
      const visibleVerdicts = allPassed ? verdicts : verdicts.filter((v) => !v.passed);

      socket.emit('task:result', {
        taskId,
        passed: allPassed,
        feedback,
        verdicts: visibleVerdicts,
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
            // Guard against double endGame: editor debounce may also fire
            // simultaneously. completeTask returns null on a re-call, so this
            // branch only executes once per game.
            try { await endGame(roomCode, 'good-coders'); } catch (err) { logger.error('endGame on task completion failed', err as Error); }
            io.to(roomCode).emit('game:end', { winner: 'good-coders' });
          }
        }
      }
    }
  );
}
