'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface Task {
  description: string;
  tool?: string;
  args?: Record<string, any>;
  status?: string;
  result?: string;
}

export default function TasksPage() {
  const [threadId] = useState(() => crypto.randomUUID());
  const [tasks, setTasks] = useState<Task[]>([{ description: '' }]);
  const [running, setRunning] = useState(false);

  const updateTask = (index: number, value: string) => {
    setTasks((prev) => {
      const next = [...prev];
      next[index].description = value;
      return next;
    });
  };

  const addTask = () => setTasks((prev) => [...prev, { description: '' }]);

  const createTasks = async () => {
    await fetch('/api/tasks/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ thread_id: threadId, tasks }),
    });
  };

  const runTasks = async () => {
    setRunning(true);
    const res = await fetch('/api/tasks/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ thread_id: threadId }),
    });
    if (res.ok) {
      const data = await res.json();
      setTasks(data.tasks as Task[]);
    }
    setRunning(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      {tasks.map((task, index) => (
        <div key={index} className="space-y-2 border-b pb-4">
          <Textarea
            value={task.description}
            placeholder="Task description..."
            onChange={(e) => updateTask(index, e.target.value)}
          />
          {task.status === 'completed' && (
            <div className="p-2 bg-secondary/20 rounded-md">
              <p className="text-sm whitespace-pre-wrap">{task.result}</p>
            </div>
          )}
        </div>
      ))}
      <Button variant="secondary" onClick={addTask} className="mt-2">
        Add Task
      </Button>
      <div className="flex gap-2 pt-2">
        <Button onClick={createTasks} variant="outline">
          Save
        </Button>
        <Button onClick={runTasks} disabled={running}>
          {running ? 'Running...' : 'Run'}
        </Button>
      </div>
    </div>
  );
}