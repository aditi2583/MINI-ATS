'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Mail, MapPin, Calendar, Briefcase, FileText, Edit2, Trash2 } from 'lucide-react';
import { formatDate, getStatusColor, cn } from '@/lib/utils';
import { useState } from 'react';
import ApplicationModal from './ApplicationModal';
import ResumeViewer from './ResumeViewer';
import { applicationsAPI } from '@/lib/api';
import useStore from '@/store/useStore';
import toast from 'react-hot-toast';

interface KanbanCardProps {
  application: any;
  isDragging?: boolean;
}

export default function KanbanCard({ application, isDragging }: KanbanCardProps) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showResumeViewer, setShowResumeViewer] = useState(false);
  const { deleteApplication } = useStore();
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({
    id: application.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(`Delete application from ${application.candidateName}?`)) return;

    try {
      await applicationsAPI.delete(application.id);
      deleteApplication(application.id);
      toast.success('Application deleted successfully');
    } catch (error) {
      console.error('Failed to delete application:', error);
      toast.error('Failed to delete application');
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowEditModal(true);
  };

  if (isDragging) {
    return (
      <div className="kanban-card opacity-90">
        <div className="flex justify-between items-start mb-3">
          <h4 className="font-semibold text-gray-900 dark:text-white">
            {application.candidateName}
          </h4>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          {application.role}
        </p>
      </div>
    );
  }

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={cn(
          'kanban-card',
          isSortableDragging && 'opacity-50'
        )}
        {...attributes}
        {...listeners}
      >
        <div className="flex justify-between items-start mb-3">
          <h4 className="font-semibold text-gray-900 dark:text-white">
            {application.candidateName}
          </h4>
          <div className="flex space-x-1">
            <button
              onClick={handleEdit}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
              aria-label="Edit"
            >
              <Edit2 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </button>
            <button
              onClick={handleDelete}
              className="p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
              aria-label="Delete"
            >
              <Trash2 className="w-4 h-4 text-red-500 dark:text-red-400" />
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <Briefcase className="w-4 h-4" />
            <span>{application.role}</span>
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <Mail className="w-4 h-4" />
            <span className="truncate">{application.email}</span>
          </div>

          {application.location && (
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <MapPin className="w-4 h-4" />
              <span>{application.location}</span>
            </div>
          )}

          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(application.appliedDate)}</span>
          </div>

          {application.resumeLink && (
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <FileText className="w-4 h-4" />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowResumeViewer(true);
                }}
                className="text-primary-600 hover:underline"
              >
                Resume
              </button>
            </div>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {application.yearsOfExperience} years exp
          </span>
          <span
            className={cn(
              'px-2 py-1 rounded-full text-xs font-medium',
              getStatusColor(application.status)
            )}
          >
            {application.status}
          </span>
        </div>
      </div>

      {showEditModal && (
        <ApplicationModal
          application={application}
          onClose={() => setShowEditModal(false)}
        />
      )}

      {showResumeViewer && application.resumeLink && (
        <ResumeViewer
          resumeUrl={application.resumeLink}
          fileName={application.resumeFileName || 'Resume.pdf'}
          onClose={() => setShowResumeViewer(false)}
        />
      )}
    </>
  );
}