'use client';

import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface TaskCardProps {
  id: string;
  description: string;
  status?: string;
  result?: string;
  onChange: (value: string) => void;
}

export function TaskCard({ id, description, status, result, onChange }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  } as React.CSSProperties;

  return (
    <Card ref={setNodeRef} style={style} className="space-y-2" {...attributes} {...listeners}>
      <CardContent className="space-y-2 p-4">
        <Textarea
          value={description}
          placeholder="Task description..."
          onChange={(e) => onChange(e.target.value)}
        />
        {status === 'completed' && (
          <div className="p-2 bg-secondary/20 rounded-md">
            <p className="text-sm whitespace-pre-wrap">{result}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
