import { Link, useLocation } from "react-router-dom";

const navigation = [
  { name: "Event List", href: "general-event" },
  { name: "My Event", href: "#" },
  { name: "NFT", href: "nfts" },
  { name: "Company", href: "company" },
];

export const Menu = () => {
  const location = useLocation();

  return (
    <div className="-my-6 divide-y divide-gray-500/10">
      <div className="py-6 flex items-center">
        {navigation.map((item) => {
          const isActive = location.pathname === `/${item.href}`;
          const itemClassName = `rounded-lg px-3 py-2 font-semibold text-sm leading-7 ${
            isActive
              ? "text-gray-50"
              : "text-gray-400 hover:text-gray-50"
          } cursor-pointer`;
          return (
            <div key={item.name} className={itemClassName}>
              <Link to={`/${item.href}`}>{item.name}</Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};
