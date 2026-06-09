import { Counter } from "@/components/counter";
export default function Page() {
  return <main data-page="counter"><h1>Counter page (server)</h1><Counter start={5} label="hits" /></main>;
}
