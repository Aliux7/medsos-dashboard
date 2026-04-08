import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "./ui/button";

export function SiteHeader({
  username,
  onUsernameChange,
  selectedPlatform,
  onPlatformChange,
  onSearch,
}: {
  username: string;
  onUsernameChange: (value: string) => void;
  selectedPlatform: string;
  onPlatformChange: (value: string) => void;
  onSearch: () => void;
}) {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium text-nowrap">
          Social Media Dashboard
        </h1>
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <Input
          placeholder="Search Username"
          value={username}
          onChange={(e) => onUsernameChange(e.target.value)}
        />
        <Button
          className="text-zinc-400 hover:text-zinc-200 cursor-pointer"
          variant={"outline"}
          onClick={onSearch}
        >
          Search
        </Button>
        <Select value={selectedPlatform} onValueChange={onPlatformChange}>
          <SelectTrigger className="w-45">
            <SelectValue placeholder="Social Media" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="youtube">Youtube</SelectItem>
              <SelectItem value="instagram">Instagram</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </header>
  );
}
