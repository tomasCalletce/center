"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Edit2, Check, X } from "lucide-react";

interface EditableSectionProps<T = any> {
  title: string;
  data: T;
  isEditing?: boolean;
  onEdit?: () => void;
  onSave?: (data: T) => Promise<void>;
  onCancel?: () => void;
  renderView: (data: T) => React.ReactNode;
  renderEdit: (data: T, onChange: (data: T) => void) => React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}

export function EditableSection<T>({
  title,
  data,
  isEditing: externalIsEditing,
  onEdit,
  onSave,
  onCancel,
  renderView,
  renderEdit,
  className = "border-dashed",
  icon
}: EditableSectionProps<T>) {
  const [internalIsEditing, setInternalIsEditing] = useState(false);
  const [editData, setEditData] = useState<T>(data);
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
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center">
            {icon && <div className="mr-3">{icon}</div>}
            <div className="h-1 w-6 bg-slate-900 rounded-full" />
            <span className="ml-3 text-sm uppercase tracking-wider font-medium">
              {title}
            </span>
          </div>
          
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isSaving}
                >
                  <X className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  <Check className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={handleEdit}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isEditing 
          ? renderEdit(editData, setEditData)
          : renderView(data)
        }
      </CardContent>
    </Card>
  );
} 