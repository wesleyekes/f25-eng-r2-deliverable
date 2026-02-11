"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Database } from "@/lib/schema";

type Species = Database["public"]["Tables"]["species"]["Row"];

export default function SpeciesDetailDialog({ species }: { species: Species }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="mt-3 w-full">Learn More</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{species.scientific_name}</DialogTitle>
          {species.common_name && <DialogDescription className="italic">{species.common_name}</DialogDescription>}
        </DialogHeader>

        <div className="space-y-3">
          <p>
            <strong>Kingdom:</strong> {species.kingdom}
          </p>

          {species.total_population && (
            <p>
              <strong>Total Population:</strong> {species.total_population.toLocaleString()}
            </p>
          )}

          {species.description && (
            <p>
              <strong>Description:</strong> {species.description}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
