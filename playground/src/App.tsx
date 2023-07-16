import { Separator } from "@/components/ui/separator.tsx";
import { Menu } from "@/components/menu";
import { Playground } from "@/components/workspace/playground.tsx";
import { GitHubLogoIcon } from "@radix-ui/react-icons";

function App() {
  return (
    <div className="bg-background h-full max-h-full grid grid-rows-layout w-full max-w-full overflow-hidden">
      <Menu />
      <Playground />
      <footer>
        <Separator />

        <div className="px-8 items-center flex space-y-2 py-4 sm:space-y-0 md:h-16 w-fit">
          <a
            href="https://github.com/JasirZaeem/ape"
            className="cursor-pointer items-center flex "
            target="_blank"
          >
            <GitHubLogoIcon className="inline-block mx-2" />
            <span className="hover:underline">JasirZaeem/ape</span>
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;
