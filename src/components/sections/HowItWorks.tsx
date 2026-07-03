import { product } from "@/config/product";

// #how-it-works — 3-step delivery process (PRD §13.4).
const steps = [
  {
    n: 1,
    title: "Order Online",
    body: "Place your order in 2 minutes.",
  },
  {
    n: 2,
    title: "We Confirm",
    body: "We call to confirm your address and payment.",
  },
  {
    n: 3,
    title: "Delivered to You",
    body: `Free delivery in ${product.deliveryEstimate}.`,
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-deep-navy text-text-light">
      <div className="section">
        <h2 className="font-display text-3xl md:text-4xl">How It Works</h2>
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="text-center md:text-left">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gold font-semibold text-midnight md:mx-0">
                {s.n}
              </div>
              <h3 className="mt-4 font-display text-xl text-text-light">
                {s.title}
              </h3>
              <p className="mt-2 text-text-light/70">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
