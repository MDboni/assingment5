import {
  CreditCardIcon,
  MagnifyingGlassIcon,
  PaperPlaneTiltIcon,
} from "@phosphor-icons/react/dist/ssr";

const STEPS = [
  {
    icon: MagnifyingGlassIcon,
    title: "Browse & filter",
    body: "Search by city, area, budget, bedrooms or amenities until you find the right fit.",
  },
  {
    icon: PaperPlaneTiltIcon,
    title: "Send a request",
    body: "Pick a move-in date and send a rental request straight to the landlord.",
  },
  {
    icon: CreditCardIcon,
    title: "Pay securely",
    body: "Once approved, pay through Stripe Checkout and get an instant receipt.",
  },
];

export function HowItWorks() {
  return (
    <div className="grid gap-px border border-border bg-border sm:grid-cols-3">
      {STEPS.map((step, index) => (
        <div key={step.title} className="group bg-background p-7">
          <div className="flex items-center justify-between">
            <span className="grid size-9 place-items-center border border-primary/30 bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <step.icon weight="bold" className="size-4" />
            </span>

            <span className="text-3xl font-semibold text-muted-foreground/20">
              0{index + 1}
            </span>
          </div>

          <h3 className="mt-6 text-sm font-medium">{step.title}</h3>

          <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
            {step.body}
          </p>
        </div>
      ))}
    </div>
  );
}
