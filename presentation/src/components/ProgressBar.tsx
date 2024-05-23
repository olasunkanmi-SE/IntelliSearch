import { useEffect, useState } from "react";
import { ProgressBar } from "react-bootstrap";

interface IProgressWithTimeoutsProps {
  readonly apiSuccess: boolean;
}
export function UploadProgress({ apiSuccess }: IProgressWithTimeoutsProps) {
  const [progress, setProgress] = useState<number>();

  useEffect(() => {
    let timeOut: NodeJS.Timeout;
    if (apiSuccess) {
      setProgress(100);
    } else {
      const updateProgress = (value: number) => {
        setProgress(value);
        if (value < 100) {
          timeOut = setTimeout(() => {
            if (value === 90) {
              updateProgress(90);
            } else {
              updateProgress(value + 5);
            }
          }, 500);
        }
      };
      updateProgress(20);
      return () => {
        clearTimeout(timeOut);
      };
    }
  }, [apiSuccess]);

  return (
    <div>
      <ProgressBar variant="dark" now={progress} />
    </div>
  );
}
