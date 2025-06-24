'use client';

import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Check } from 'lucide-react';

interface TaskCardProps {
  id: string;
  description: string;
  status?: string;
  result?: string;
  onChange: (value: string) => void;
  isLast?: boolean;
}

export function TaskCard({ id, description, status, result, onChange, isLast }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  } as React.CSSProperties;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={
        'relative pl-10 ' + (!isLast ? 'border-l border-muted-foreground/30' : '')
      }
    >
      <span className="absolute -left-3 top-3 flex flex-col items-center">
        <span
          className={
            'w-3 h-3 rounded-full flex items-center justify-center border ' +
            (status === 'completed'
              ? 'bg-primary text-white border-primary'
              : 'bg-background border-muted-foreground')
          }
        >
          {status === 'completed' && <Check className="w-2 h-2" />}
        </span>
        {!isLast && <span className="flex-1 w-px bg-muted-foreground" />}
      </span>
      <div className="absolute -left-8 top-3 cursor-grab" {...listeners}>
        <GripVertical className="w-4 h-4 text-muted-foreground" />
      </div>
      <Card className="space-y-2" {...attributes}>
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
    </div>
  );
}
