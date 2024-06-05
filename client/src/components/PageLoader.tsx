import Spinner from "./Spinner";

const PageLoader = () => {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Spinner className="h-10 w-10" />
    </div>
  );
};

export default PageLoader;
