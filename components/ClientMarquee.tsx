import { clients } from "@/lib/content";

function Group({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {clients.names.map((name) => (
        <li key={name} className="flex items-center">
          <span className="whitespace-nowrap text-h3 font-semibold">{name}</span>
          <span aria-hidden="true" className="mx-8 size-1.5 rounded-full bg-lilac md:mx-12" />
        </li>
      ))}
    </ul>
  );
}

export default function ClientMarquee() {
  return (
    <section
      aria-label={clients.label}
      data-header-theme="light"
      className="border-b border-line bg-white py-[clamp(24px,4.5vh,44px)]"
    >
      <p className="wrap mb-[clamp(10px,2vh,20px)] text-small font-semibold">{clients.label}</p>
      <div className="marquee">
        <div className="marquee-track">
          <Group />
          <Group hidden />
        </div>
      </div>
    </section>
  );
}
