import { Icon } from "./Icon";
import { Menu } from "./Menu";
import { User } from "./User";

export const Header = () => {
  return (
    <header className="header">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-5 lg:px-8"
        aria-label="Global"
      >
        <Icon/>
        <Menu/>
        <User/>
      </nav>
    </header>
  );
};
