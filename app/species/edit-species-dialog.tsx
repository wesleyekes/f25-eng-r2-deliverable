"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createBrowserSupabaseClient } from "@/lib/client-utils";
import type { Database } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type Species = Database["public"]["Tables"]["species"]["Row"];

const schema = z.object({
  scientific_name: z.string().min(1),
  common_name: z.string().nullable(),
  description: z.string().nullable(),
  total_population: z.number().nullable(),
});

type FormValues = z.infer<typeof schema>;

export default function EditSpeciesDialog({ species }: { species: Species }) {
  const router = useRouter();
  const supabase = createBrowserSupabaseClient();
  const [open, setOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      scientific_name: species.scientific_name,
      common_name: species.common_name,
      description: species.description,
      total_population: species.total_population,
    },
  });

  async function onSubmit(values: z.infer<typeof schema>): Promise<void> {
    const { error } = await supabase.from("species").update(values).eq("id", species.id);

    if (!error) {
      setOpen(false);
      router.refresh();
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="mt-2 w-full">
          Edit
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Species</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void form.handleSubmit(onSubmit)(e);
            }}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="scientific_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Scientific Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="common_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Common Name</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ""} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="total_population"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Population</FormLabel>
                  <FormControl>
                    <Input type="number" value={field.value ?? ""} onChange={(e) => field.onChange(+e.target.value)} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} value={field.value ?? ""} />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex gap-2">
              <Button type="submit" className="flex-1">
                Save
              </Button>
              <DialogClose asChild>
                <Button variant="secondary" className="flex-1">
                  Cancel
                </Button>
              </DialogClose>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
