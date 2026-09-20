import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import HackathonForm from "@/components/HackathonForm";
import LoadingState from "@/components/LoadingState";
import { useHackathonStore } from "@/store/hackathonStore";
import { fetchHackathonById } from "@/services/hackathonService";
import type { Hackathon, HackathonInput } from "@/types/hackathon";

export default function AddEditHackathon() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { add, edit } = useHackathonStore();
  const [initial, setInitial] = useState<Partial<Hackathon> | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(isEdit);

  useEffect(() => {
    if (!id) return;
    fetchHackathonById(id)
      .then((data) => setInitial(data))
      .catch((err) => toast.error((err as Error).message))
      .finally(() => setIsLoading(false));
  }, [id]);

  async function handleSubmit(payload: Partial<HackathonInput>) {
    if (isEdit && id) {
      await edit(id, payload);
      toast.success("Hackathon updated");
      navigate(`/hackathons/${id}`);
    } else {
      const created = await add(payload);
      toast.success("Hackathon added");
      navigate(`/hackathons/${created._id}`);
    }
  }

  if (isLoading) return <LoadingState label="Loading hackathon…" />;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{isEdit ? "Edit Hackathon" : "Add Hackathon"}</h1>
        <p className="text-sm text-[var(--color-text-muted)]">
          {isEdit ? "Update the details for this hackathon." : "Track a new hackathon and all of its important dates."}
        </p>
      </div>
      <HackathonForm initial={initial} submitLabel={isEdit ? "Save Changes" : "Add Hackathon"} onSubmit={handleSubmit} />
    </div>
  );
}
