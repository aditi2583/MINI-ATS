'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { applicationsAPI } from '@/lib/api';
import useStore from '@/store/useStore';
import toast from 'react-hot-toast';

interface ApplicationModalProps {
  application?: any;
  onClose: () => void;
}

export default function ApplicationModal({
  application,
  onClose,
}: ApplicationModalProps) {
  const { addApplication, updateApplication } = useStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: application || {
      candidateName: '',
      email: '',
      phone: '',
      role: '',
      yearsOfExperience: 0,
      status: 'applied',
      location: '',
      salary: '',
      skills: '',
      notes: '',
    },
  });

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        if (data[key] !== null && data[key] !== undefined) {
          formData.append(key, data[key]);
        }
      });

      if (resumeFile) {
        formData.append('resume', resumeFile);
      }

      if (application) {
        const response = await applicationsAPI.update(application.id, formData);
        updateApplication(application.id, response.data);
        toast.success('Application updated successfully');
      } else {
        const response = await applicationsAPI.create(formData);
        addApplication(response.data);
        toast.success('Application created successfully');
      }

      onClose();
    } catch (error: any) {
      console.error('Failed to save application:', error);
      toast.error(error.response?.data?.error || 'Failed to save application');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />

        <div className="relative bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {application ? 'Edit Application' : 'Add New Application'}
              </h2>
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Candidate Name *
                </label>
                <input
                  {...register('candidateName', { required: 'Name is required' })}
                  className="input-field"
                  placeholder="John Doe"
                />
                {errors.candidateName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.candidateName.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email *
                </label>
                <input
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  type="email"
                  className="input-field"
                  placeholder="john@example.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone
                </label>
                <input
                  {...register('phone')}
                  type="tel"
                  className="input-field"
                  placeholder="+1 234 567 8900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Role *
                </label>
                <input
                  {...register('role', { required: 'Role is required' })}
                  className="input-field"
                  placeholder="Software Engineer"
                />
                {errors.role && (
                  <p className="text-red-500 text-xs mt-1">{errors.role.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Years of Experience *
                </label>
                <input
                  {...register('yearsOfExperience', {
                    required: 'Experience is required',
                    min: { value: 0, message: 'Must be 0 or greater' },
                  })}
                  type="number"
                  className="input-field"
                  placeholder="5"
                />
                {errors.yearsOfExperience && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.yearsOfExperience.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select {...register('status')} className="input-field">
                  <option value="applied">Applied</option>
                  <option value="interview">Interview</option>
                  <option value="offer">Offer</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Location
                </label>
                <input
                  {...register('location')}
                  className="input-field"
                  placeholder="New York, NY"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Expected Salary
                </label>
                <input
                  {...register('salary')}
                  type="number"
                  className="input-field"
                  placeholder="120000"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Skills (comma-separated)
                </label>
                <input
                  {...register('skills')}
                  className="input-field"
                  placeholder="React, Node.js, TypeScript"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Resume
                </label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                  className="input-field"
                />
                {application?.resumeFileName && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Current: {application.resumeFileName}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Notes
                </label>
                <textarea
                  {...register('notes')}
                  rows={3}
                  className="input-field"
                  placeholder="Additional notes about the candidate..."
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? 'Saving...'
                  : application
                  ? 'Update Application'
                  : 'Add Application'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}