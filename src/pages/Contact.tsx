import { ContactForm } from "@/components/ContactForm";

export function Contact() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6 md:py-12 flex-1 flex flex-col justify-center">
      <div className="flex flex-col items-center gap-4 py-24 text-center">
        <h1 className="font-display text-7xl font-light tracking-tight text-white md:text-9xl">
          Contact
        </h1>
      </div>
    </div>
  );
  return <ContactForm />;

}
