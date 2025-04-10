"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Repeat2 } from "lucide-react";
import CategorySelector from "./category-selector";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios-instance";
import { issueService } from "@/services";
import { CreateIssueForm } from "./create-Issue-form";

interface DialogProps extends React.ComponentPropsWithoutRef<typeof Dialog> {
  showTrigger?: boolean;
  onSuccess?: () => void;
}

const categoriesx = [
  {
    id: 1,
    name: "Report a bug in the runner application",
    description:
      'If you have issues with GitHub Actions, please follow the "support for GitHub Actions" link, below.',
    externalLink: false,
  },
  {
    id: 2,
    name: "Report a security vulnerability",
    description: "Please review our security policy for more details",
    externalLink: false,
  },
];
export function NewIssueDialog({
  showTrigger = true,
  onSuccess,
  ...props
}: DialogProps) {
  // Fetch colleges on mount
  const { data: categories, isPending: fetchingCategories } = useQuery({
    queryKey: ["colleges"],
    queryFn: async () => await issueService.categories(),
  });
  const [category, setCategory] = React.useState<{
    id: number;
    name: string;
    description: string;
  } | null>(null);
  return (
    <Dialog {...props}>
      {showTrigger ? (
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Repeat2 className="mr-2 size-4" aria-hidden="true" />
            New Issue
          </Button>
        </DialogTrigger>
      ) : null}
      <DialogContent className="max-w-2xl px-0">
        <DialogHeader>
          <DialogTitle className="px-6">Create New Issue</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        {category ? (
          <CreateIssueForm
            category={category}
            onCancel={() => {
              setCategory(null);
            }}
            className="max-h-[calc(27rem+10vh)] overflow-y-auto "
          />
        ) : (
          <CategorySelector
            categories={categories || []}
            loading={fetchingCategories}
            onChange={(value) => setCategory(value)}
            className="max-h-[calc(27rem+10vh)] overflow-y-auto border border-gray-200 shadow-sm"
          />
        )}
        {/* <DialogFooter className="gap-2 px-6 sm:space-x-0">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            aria-label="Submit issue"
            // variant="destructive"
            // onClick={() => {
            //   startActionTransition(async () => {
            //     await handleAction();
            //   });
            // }}
            disabled={!category || fetchingCategories || !categories}
          >

            Create
          </Button>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
}
