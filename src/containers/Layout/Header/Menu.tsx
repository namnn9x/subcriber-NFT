import { useNavigate } from "react-router";
import { Link } from "react-router-dom";

const navigation = [
  { name: "General Event", href: "general-event" },
  { name: "My Event", href: "#" },
  { name: "NFT", href: "nfts" },
  { name: "Company", href: "#" },
];

export const Menu = () => {
  const navigate = useNavigate();

  return (
    <div className="-my-6 divide-y divide-gray-500/10">
      <div className="py-6 flex items-center">
        {navigation.map((item) => (
          <div
            key={item.name}
            className="rounded-lg px-3 py-2 font-semibold text-sm leading-7 text-gray-300 hover:text-gray-50 cursor-pointer"
          >
            <Link to={`/${item.href}`} >{item.name}</Link>
          </div>
        ))}
      </div>
    </div>
  );
};
