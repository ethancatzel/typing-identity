import Form from "./Form";
import Passage from "./Passage";

export default function Home() {
  return (
    <main className="max-w-2xl px-8 py-8 mx-auto">
      <h1 className="text-4xl font-semibold leading-normal">
        <span className="border-b-4 border-[#E6712F]">Type</span> out the
        following passage
      </h1>

      <br />
      <Passage />
      <br />

      <Form />
    </main>
  );
}
