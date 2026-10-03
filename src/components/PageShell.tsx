import { Header } from "./Header";

/** The page frame: width, gutters and the header. */
export function PageShell({ children }: { children?: React.ReactNode }) {
  return (
    <div className="mx-auto flex max-w-[1120px] flex-col gap-7 px-4 pt-4 pb-14 md:gap-10 md:px-8 md:pt-8 md:pb-20">
      <Header />
      {children}
    </div>
  );
}
