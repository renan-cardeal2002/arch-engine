'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DndContext, PointerSensor, useSensor, useSensors, closestCenter } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { TaskCard } from '@/components/task-card';

interface Task {
  id: string;
  description: string;
  tool?: string;
  args?: Record<string, any>;
  status?: string;
  result?: string;
}

export default function TasksPage() {
  const [threadId] = useState(() => crypto.randomUUID());
  const [tasks, setTasks] = useState<Task[]>([{ id: crypto.randomUUID(), description: '' }]);
  const [running, setRunning] = useState(false);
  const sensors = useSensors(useSensor(PointerSensor));

  const updateTask = (id: string, value: string) => {
    setTasks((prev) => {
      const next = [...prev];
      const idx = next.findIndex((t) => t.id === id);
      if (idx !== -1) next[idx].description = value;
      return next;
    });
  };

  const addTask = () => setTasks((prev) => [...prev, { id: crypto.randomUUID(), description: '' }]);

  const createTasks = async () => {
    await fetch('/api/tasks/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        thread_id: threadId,
        tasks: tasks.map(({ id, ...rest }) => rest),
      }),
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
      setTasks((prev) =>
        prev.map((t, i) => ({ ...t, ...data.tasks[i] }))
      );
    }
    setRunning(false);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setTasks((items) => {
        const oldIndex = items.findIndex((t) => t.id === active.id);
        const newIndex = items.findIndex((t) => t.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
          <ol className="space-y-4">
            {tasks.map((task, idx) => (
              <TaskCard
                key={task.id}
                id={task.id}
                description={task.description}
                status={task.status}
                result={task.result}
                onChange={(v) => updateTask(task.id, v)}
                isLast={idx === tasks.length - 1}
              />
            ))}
          </ol>
        </SortableContext>
      </DndContext>
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
