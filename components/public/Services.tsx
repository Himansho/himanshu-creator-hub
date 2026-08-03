import Reveal from "./Reveal";

const SERVICES = [
  {
    name: "App Building",
    description:
      "Turning real problems into working web apps — designed, built, and shipped with modern tools and AI-assisted workflows.",
  },
  {
    name: "Web Design",
    description:
      "Clean, modern, conversion-focused websites with careful attention to layout, typography, and user experience.",
  },
  {
    name: "AI Products",
    description:
      "Prototyping and launching AI-powered tools and experiences — from idea to something people can actually use.",
  },
  {
    name: "Branding",
    description:
      "Cohesive visual identities that communicate a clear, memorable presence across every touchpoint.",
  },
  {
    name: "Product Thinking",
    description:
      "Helping ideas become products: scoping what matters, cutting what doesn't, and shipping the thing.",
  },
];

/** Jack-style Services: white sheet with rounded top, numbered list. */
export default function Services() {
  return (
    <section
      id="services"
      className="scroll-mt-24 rounded-t-[40px] bg-white px-5 py-20 sm:rounded-t-[50px] sm:px-8 sm:py-24 md:rounded-t-[60px] md:px-10 md:py-32"
    >
      <Reveal>
        <h2
          className="mb-16 text-center font-black uppercase leading-none tracking-tight text-[#0C0C0C] sm:mb-20 md:mb-28"
          style={{ fontSize: "clamp(3rem, 12vw, 160px)" }}
        >
          Services
        </h2>
      </Reveal>

      <div className="mx-auto max-w-5xl">
        {SERVICES.map((service, index) => (
          <Reveal key={service.name} delay={index * 100}>
            <div
              className="flex flex-col gap-4 py-8 sm:flex-row sm:items-start sm:gap-10 sm:py-10 md:gap-14 md:py-12"
              style={{
                borderTop:
                  index === 0 ? "none" : "1px solid rgba(12, 12, 12, 0.15)",
              }}
            >
              <span
                className="shrink-0 font-black leading-none text-[#0C0C0C]"
                style={{ fontSize: "clamp(3rem, 10vw, 140px)" }}
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="flex flex-col gap-3 pt-2 sm:pt-4">
                <h3
                  className="font-medium uppercase text-[#0C0C0C]"
                  style={{ fontSize: "clamp(1rem, 2.2vw, 2.1rem)" }}
                >
                  {service.name}
                </h3>
                <p
                  className="max-w-2xl font-light leading-relaxed text-[#0C0C0C]"
                  style={{
                    fontSize: "clamp(0.85rem, 1.6vw, 1.25rem)",
                    opacity: 0.6,
                  }}
                >
                  {service.description}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
