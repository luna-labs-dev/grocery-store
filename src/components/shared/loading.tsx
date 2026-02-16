import HourglassIcon from '../hourglass-icon';

interface Props {
  text?: string;
}
export const Loading = ({ text }: Props) => {
  return (
    <div className="flex items-center gap-2">
      <HourglassIcon size={24} />
      {text}
    </div>
  );
};
