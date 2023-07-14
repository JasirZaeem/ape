import { Separator } from "@/components/ui/separator.tsx";
import { Menu } from "@/components/menu";
import { Playground } from "@/components/workspace/playground.tsx";

function App() {
  return (
    <div className="bg-background h-full max-h-full grid grid-rows-layout w-full max-w-full overflow-hidden">
      <Menu />
      <Playground />
      <footer>
        <Separator />
        <div className="px-8 flex flex-col items-start space-y-2 py-4 sm:space-y-0 md:h-16">
          APE Playground
        </div>
      </footer>
    </div>
  );
}

export default App;
