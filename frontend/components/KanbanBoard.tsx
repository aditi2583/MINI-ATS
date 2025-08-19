'use client';

import { useState, useEffect } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import KanbanColumn from './KanbanColumn';
import KanbanCard from './KanbanCard';
import { applicationsAPI } from '@/lib/api';
import useStore from '@/store/useStore';
import toast from 'react-hot-toast';

const columns = [
  { id: 'applied', title: 'Applied', color: 'border-blue-500' },
  { id: 'interview', title: 'Interview', color: 'border-yellow-500' },
  { id: 'offer', title: 'Offer', color: 'border-green-500' },
  { id: 'rejected', title: 'Rejected', color: 'border-red-500' },
];

export default function KanbanBoard() {
  const { applications, setApplications, updateApplication, filters } = useStore();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    fetchApplications();
  }, [filters]);

  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      const response = await applicationsAPI.getAll(filters);
      setApplications(response.data);
    } catch (error) {
      console.error('Failed to fetch applications:', error);
      toast.error('Failed to load applications');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || active.id === over.id) return;

    const activeApp = applications.find((app) => app.id === active.id);
    if (!activeApp) return;

    const newStatus = over.id as string;
    if (activeApp.status === newStatus) return;

    updateApplication(activeApp.id, { status: newStatus as any });

    try {
      await applicationsAPI.updateStatus(activeApp.id, newStatus);
      toast.success(`Moved ${activeApp.candidateName} to ${newStatus}`);
    } catch (error) {
      console.error('Failed to update status:', error);
      toast.error('Failed to update application status');
      updateApplication(activeApp.id, { status: activeApp.status });
    }
  };

  const getApplicationsByStatus = (status: string) => {
    return applications.filter((app) => app.status === status);
  };

  const activeApplication = activeId
    ? applications.find((app) => app.id === activeId)
    : null;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {columns.map((column) => {
          const columnApplications = getApplicationsByStatus(column.id);
          
          return (
            <KanbanColumn
              key={column.id}
              id={column.id}
              title={column.title}
              count={columnApplications.length}
              color={column.color}
            >
              <SortableContext
                items={columnApplications.map((app) => app.id)}
                strategy={verticalListSortingStrategy}
              >
                {columnApplications.map((application) => (
                  <KanbanCard
                    key={application.id}
                    application={application}
                  />
                ))}
              </SortableContext>
            </KanbanColumn>
          );
        })}
      </div>

      <DragOverlay>
        {activeApplication && (
          <div className="drag-overlay">
            <KanbanCard application={activeApplication} isDragging />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}