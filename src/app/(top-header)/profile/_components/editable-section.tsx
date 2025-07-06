"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Edit2, Check, X } from "lucide-react";
import { type User } from "~/server/db/schemas/users";

interface EditableSectionProps {
  title: string;
  data: User;
  isEditing?: boolean;
  onEdit?: () => void;
  onSave?: (data: User) => Promise<void>;
  onCancel?: () => void;
  renderView: (data: User) => React.ReactNode;
  renderEdit: (data: User, onChange: (data: User) => void) => React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}

export const EditableSection: React.FC<EditableSectionProps> = ({
  title,
  data,
  isEditing: externalIsEditing,
  onEdit,
  onSave,
  onCancel,
  renderView,
  renderEdit,
  className = "",
  icon,
}) => {
  const [internalIsEditing, setInternalIsEditing] = useState(false);
  const [editData, setEditData] = useState<User>(data);
  const [isSaving, setIsSaving] = useState(false);

  const isEditing = externalIsEditing ?? internalIsEditing;

  const handleEdit = () => {
    if (onEdit) {
      onEdit();
    } else {
      setInternalIsEditing(true);
      setEditData(data);
    }
  };

  const handleSave = async () => {
    if (!onSave) return;

    setIsSaving(true);
    try {
      await onSave(editData);
      setInternalIsEditing(false);
    } catch (error) {
      console.error("Save failed:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      setInternalIsEditing(false);
      setEditData(data);
    }
  };

  return (
    <div
      className={`group relative overflow-hidden bg-white/70 backdrop-blur-sm border border-slate-200/60 rounded-xl ${className}`}
    >
      {/* Header */}
      <div className="px-6 py-3 border-b border-slate-100/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Icon container */}
            {icon && (
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                <div className="text-slate-600">{icon}</div>
              </div>
            )}

            {/* Title */}
            <div className="space-y-1">
              <h3 className="text-sm font-semibold tracking-wide text-slate-900 uppercase">
                {title}
              </h3>
              <div className="w-8 h-px bg-slate-300" />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
            {isEditing ? (
              <>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600 border-dashed"
                >
                  <X className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="h-8 w-8 p-0 bg-slate-900 hover:bg-slate-800"
                >
                  <Check className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                variant="ghost"
                onClick={handleEdit}
                className="h-8 w-8 p-0 hover:bg-slate-100 border-dashed"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-4">
        {isEditing ? renderEdit(editData, setEditData) : renderView(data)}
      </div>
    </div>
  );
};
