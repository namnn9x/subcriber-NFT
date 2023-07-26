import { AiOutlinePlus } from 'react-icons/ai'

export const BtnEventCreate = ({
  onClick,
}: {
  onClick: () => void
}) => {
  return (
    <div className="input-group absolute bottom-36 right-10" onClick={onClick}>
      <button type="button" className="btn btn-primary w-36 h-10 flex justify-around items-center">
        <AiOutlinePlus/>
        <span className="text-base"> Create event </span>
      </button>
    </div>
  );
};
