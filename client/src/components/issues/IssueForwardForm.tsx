import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useForwardIssue } from "@/admin/hooks/useForwardIssue";
import { useLecturers } from "@/admin/hooks/useLecturers";
import { useDepartments } from "@/admin/hooks/useDepartments";
import { Loader2 } from "lucide-react";

interface User {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
}

interface IssueForwardFormProps {
    issue: {
        id: number;
        token: string;
        title: string;
        description: string;
        status: string;
        priority: number;
        category: number;
        college: number;
        course: number;
        course_unit: number;
        semester: number;
        year_of_study: number;
        created_at: string;
        updated_at: string;
        resolved_at: string | null;
        resolution_details: string | null;
        created_by: User;
        assigned_to: User;
        modified_by: User | null;
        closed_by: User | null;
        forwarded_to: User | null;
        attachments: any[];
    };
    onCloseModal?: () => void;
}

export default function IssueForwardForm({ issue, onCloseModal }: IssueForwardFormProps) {
    const [selectedDepartment, setSelectedDepartment] = useState<string>("");
    const [selectedLecturer, setSelectedLecturer] = useState<string>("");
    const [isDepartmentSelectOpen, setIsDepartmentSelectOpen] = useState(false);
    const [isLecturerSelectOpen, setIsLecturerSelectOpen] = useState(false);
    const { forwardIssue, isForwarding } = useForwardIssue();
    const { departments, isLoading: isLoadingDepartments } = useDepartments();
    const { lecturers, isLoading: isLoadingLecturers } = useLecturers(selectedDepartment ? parseInt(selectedDepartment) : undefined);

    // Prevent clicks inside the form from closing the modal
    const handleContainerClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedDepartment || !selectedLecturer) {
            return;
        }

        forwardIssue(
            {
                token: issue.token,
                lecturerId: parseInt(selectedLecturer)
            },
            {
                onSuccess: () => {
                    onCloseModal?.();
                }
            }
        );
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white" onClick={handleContainerClick}>
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Forward Issue</h2>
                <p className="text-sm text-gray-600 mt-1">
                    Forward this issue to a lecturer for specialized handling
                </p>
            </div>

            <div className="space-y-4 mb-6">
                <div>
                    <Label className="text-sm font-medium text-gray-700">Issue Title</Label>
                    <Input
                        value={issue.title}
                        readOnly
                        className="mt-1 bg-gray-50 border-gray-200"
                    />
                </div>

                <div>
                    <Label className="text-sm font-medium text-gray-700">Description</Label>
                    <Textarea
                        value={issue.description}
                        readOnly
                        className="mt-1 bg-gray-50 border-gray-200 min-h-[80px] resize-none"
                    />
                </div>

                <div>
                    <Label className="text-sm font-medium text-gray-700">Created By</Label>
                    <Input
                        value={`${issue.created_by.first_name} ${issue.created_by.last_name} (${issue.created_by.email})`}
                        readOnly
                        className="mt-1 bg-gray-50 border-gray-200"
                    />
                </div>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); handleSubmit(e); }} className="space-y-4">
                <div onClick={(e) => e.stopPropagation()}>
                    <Label htmlFor="department" className="text-sm font-medium text-gray-700">
                        Select Department *
                    </Label>
                    <Select
                        value={selectedDepartment}
                        onValueChange={(value) => {
                            setSelectedDepartment(value);
                            setSelectedLecturer(""); // Reset lecturer when department changes
                        }}
                        open={isDepartmentSelectOpen}
                        onOpenChange={(open) => {
                            setIsDepartmentSelectOpen(open);
                            // Prevent modal from closing when dropdown opens/closes
                            if (open) {
                                setTimeout(() => {
                                    const selectContent = document.querySelector('[data-radix-select-content]');
                                    if (selectContent) {
                                        selectContent.addEventListener('click', (e) => e.stopPropagation(), true);
                                    }
                                }, 10);
                            }
                        }}
                    >
                        <SelectTrigger className="mt-1">
                            <SelectValue placeholder={
                                isLoadingDepartments
                                    ? "Loading departments..."
                                    : departments.length === 0
                                        ? "No departments available"
                                        : "Choose a department"
                            } />
                        </SelectTrigger>
                        <SelectContent>
                            {!isLoadingDepartments && departments.length > 0 && (
                                departments.map((department: any) => (
                                    <SelectItem key={department.id} value={department.id.toString()}>
                                        {department.name}
                                    </SelectItem>
                                ))
                            )}
                        </SelectContent>
                    </Select>
                </div>

                <div onClick={(e) => e.stopPropagation()}>
                    <Label htmlFor="lecturer" className="text-sm font-medium text-gray-700">
                        Select Lecturer *
                    </Label>
                    <Select
                        value={selectedLecturer}
                        onValueChange={setSelectedLecturer}
                        disabled={!selectedDepartment}
                        open={isLecturerSelectOpen}
                        onOpenChange={(open) => {
                            setIsLecturerSelectOpen(open);
                            // Prevent modal from closing when dropdown opens/closes
                            if (open) {
                                setTimeout(() => {
                                    const selectContent = document.querySelector('[data-radix-select-content]');
                                    if (selectContent) {
                                        selectContent.addEventListener('click', (e) => e.stopPropagation(), true);
                                    }
                                }, 10);
                            }
                        }}
                    >
                        <SelectTrigger className="mt-1">
                            <SelectValue placeholder={
                                !selectedDepartment
                                    ? "Select a department first"
                                    : isLoadingLecturers
                                        ? "Loading lecturers..."
                                        : lecturers.length === 0
                                            ? "No lecturers available in this department"
                                            : "Choose a lecturer"
                            } />
                        </SelectTrigger>
                        <SelectContent>
                            {!isLoadingLecturers && lecturers.length > 0 && selectedDepartment && (
                                lecturers.map((lecturer: any) => (
                                    <SelectItem key={lecturer.id} value={lecturer.id.toString()}>
                                        {lecturer.full_name} ({lecturer.email})
                                    </SelectItem>
                                ))
                            )}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex gap-3 pt-4" onClick={(e) => e.stopPropagation()}>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={(e) => {
                            e.stopPropagation();
                            onCloseModal?.();
                        }}
                        className="flex-1"
                        disabled={isForwarding}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        onClick={(e) => e.stopPropagation()}
                        disabled={!selectedDepartment || !selectedLecturer || isForwarding || isLoadingLecturers || isLoadingDepartments}
                        className="flex-1"
                    >
                        {isForwarding ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                Forwarding...
                            </>
                        ) : (
                            'Forward Issue'
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
