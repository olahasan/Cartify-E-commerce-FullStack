import Lottie from "lottie-react";
import notFound from "@assets/lottieFiles/AnimationNotFound.json";
import empty from "@assets/lottieFiles/AnimationEmpty.json";
import loading from "@assets/lottieFiles/AnimationLoading.json";
import error from "@assets/lottieFiles/AnimationError.json";

const lottieFilesMap = {
  notFound,
  empty,
  loading,
  error,
};

type LottieHandlerProps = {
  type: keyof typeof lottieFilesMap;
  message?: string;
  className?: string;
};

const LottieHandler = ({ type, message, className }: LottieHandlerProps) => {
  const lottie = lottieFilesMap[type];
  const messageStyle =
    type === "error"
      ? { fontSize: "19px", color: "red" }
      : type === "empty"
        ? { marginTop: "10px", fontSize: "19px" }
        : type === "notFound"
          ? { marginTop: "30px", fontSize: "19px" }
          : { fontSize: "19px", marginTop: "30px" };

  return (
    <div className={`d-flex flex-column align-items-center ${className}`}>
      <Lottie animationData={lottie} style={{ width: "350px" }} loop autoplay />
      {message && <h3 style={messageStyle}>{message}</h3>}
    </div>
  );
};

export default LottieHandler;
