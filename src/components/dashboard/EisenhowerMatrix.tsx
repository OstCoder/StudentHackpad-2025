import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Task } from '@/types/studypulse';
import { categorizeTasksByQuadrant, formatMinutes } from '@/utils/taskLogic';
import { Button } from '@/components/ui/button';

interface EisenhowerMatrixProps {
  tasks: Task[];
}

const QuadrantCard = ({
  title,
  description,
  tasks,
  color,
  isExpanded,
}: {
  title: string;
  description: string;
  tasks: Task[];
  color: string;
  isExpanded: boolean;
}) => (
  <div
    className={`
      p-4 rounded-lg border-2 transition-all duration-300
      ${color}
      ${isExpanded ? 'row-span-2' : ''}
      hover:shadow-md
    `}
  >
    <h4 className="font-semibold text-lg mb-1">{title}</h4>
    <p className="text-xs text-muted-foreground mb-3">{description}</p>
    <p className="text-3xl font-bold mb-3">{tasks.length}</p>

    {isExpanded && (
      <div className="space-y-2 max-h-96 overflow-y-auto animate-fade-in-up">
        {tasks.map((task) => (
          <div key={task.id} className="p-3 bg-background/50 rounded-lg text-sm">
            <p className="font-medium">{task.title}</p>
            <p className="text-xs text-muted-foreground">{task.course}</p>
            <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
              <span>{formatMinutes(task.minutes)}</span>
              <span>{new Date(task.dueDate).toLocaleDateString()}</span>
              <span>U:{task.urgency}</span>
              <span>I:{task.importance}</span>
            </div>
          </div>
        ))}
        {tasks.length === 0 && (
          <p className="text-sm text-muted-foreground">No tasks in this quadrant</p>
        )}
      </div>
    )}
  </div>
);

export const EisenhowerMatrix = ({ tasks }: EisenhowerMatrixProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const quadrants = categorizeTasksByQuadrant(tasks);

  return (
    <Card className="p-6 glass border-2 border-primary/20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">Eisenhower Matrix</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="gap-2"
        >
          {isExpanded ? (
            <>
              Collapse <ChevronUp className="w-4 h-4" />
            </>
          ) : (
            <>
              Expand <ChevronDown className="w-4 h-4" />
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <QuadrantCard
          title="Q1: Do First"
          description="Urgent & Important"
          tasks={quadrants.Q1}
          color="border-destructive bg-destructive/5"
          isExpanded={isExpanded}
        />
        <QuadrantCard
          title="Q2: Schedule"
          description="Not Urgent, Important"
          tasks={quadrants.Q2}
          color="border-primary bg-primary/5"
          isExpanded={isExpanded}
        />
        <QuadrantCard
          title="Q3: Delegate"
          description="Urgent, Not Important"
          tasks={quadrants.Q3}
          color="border-accent bg-accent/5"
          isExpanded={isExpanded}
        />
        <QuadrantCard
          title="Q4: Maybe Later"
          description="Not Urgent, Not Important"
          tasks={quadrants.Q4}
          color="border-muted bg-muted/5"
          isExpanded={isExpanded}
        />
      </div>
    </Card>
  );
};
