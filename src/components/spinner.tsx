import { SpinnerIcon } from "../icon";

export const Spinner: React.FC = () => {
  return (
    <div className="reimagine-mainArea-spinner">
      <SpinnerIcon isLoading={true} size="50px" />
    </div>
  );
};
