import { useState, type FormEvent } from "react";
import {
  priorityOptions,
  ticketPriorities,
  ticketStatuses,
  type TicketPriority,
  type TicketStatus,
} from "../utils/tickets";
import type { TicketFormValues } from "../types/ticket";

interface TicketFormProps {
  onCreate: (values: TicketFormValues) => Promise<void>;
  isSubmitting: boolean;
}

const initialValues: TicketFormValues = {
  title: "",
  description: "",
  status: ticketStatuses[0],
  priority: ticketPriorities[1],
};

export function TicketForm({ onCreate, isSubmitting }: TicketFormProps) {
  const [values, setValues] = useState<TicketFormValues>(initialValues);

  const updateField = <Key extends keyof TicketFormValues>(key: Key, value: TicketFormValues[Key]) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onCreate({
      ...values,
      title: values.title.trim(),
      description: values.description.trim(),
    });
    setValues(initialValues);
  };

  return (
    <section className="glass-panel rounded-[1.5rem] p-4 shadow-[0_30px_80px_rgba(2,6,23,0.6)] sm:p-5">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/70">Create ticket</p>
          <h2 className="mt-2 text-xl font-semibold text-white">Capture the issue in one pass</h2>
        </div>
      </div>

      <form className="space-y-3.5" onSubmit={handleSubmit}>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-200" htmlFor="title">
            Title
          </label>
          <input
            id="title"
            value={values.title}
            onChange={(event) => updateField("title", event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-2.5 text-slate-50 outline-none transition placeholder:text-slate-500 focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/20"
            placeholder="Example: Login button is unresponsive"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-200" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            value={values.description}
            onChange={(event) => updateField("description", event.target.value)}
            className="min-h-28 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-2.5 text-slate-50 outline-none transition placeholder:text-slate-500 focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/20"
            placeholder="Short context for the person picking it up"
            rows={5}
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200" htmlFor="status">
              Status
            </label>
            <select
              id="status"
              value={values.status}
              onChange={(event) => updateField("status", event.target.value as TicketStatus)}
              className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-2.5 text-white outline-none transition [color-scheme:dark] focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/20"
            >
              {ticketStatuses.map((status) => (
                <option key={status} value={status} className="bg-slate-900 text-white">
                  {status.replaceAll("_", " ")}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200" htmlFor="priority">
              Priority
            </label>
            <select
              id="priority"
              value={values.priority}
              onChange={(event) => updateField("priority", event.target.value as TicketPriority)}
              className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-2.5 text-white outline-none transition [color-scheme:dark] focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/20"
            >
              {priorityOptions.map((option) => (
                <option key={option.value} value={option.value} className="bg-slate-900 text-white">
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:scale-[1.01] hover:shadow-lg hover:shadow-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Creating ticket..." : "Create ticket"}
        </button>
      </form>
    </section>
  );
}