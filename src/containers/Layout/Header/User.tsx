import { useAuth } from "../../../hooks";
import { useUserStore } from "../../../store/user";

export const User = () => {
  const { user } = useUserStore()
  console.log(user, 'user')
  return (
    <div className="hidden lg:flex lg:flex-1 lg:justify-end">
      <a href="#" className="text-sm font-semibold leading-6 text-gray-300">
        {user.fullname}
      </a>
    </div>
  );
};
