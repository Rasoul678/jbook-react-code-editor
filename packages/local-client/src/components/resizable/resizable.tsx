import { useEffect, useState } from "react";
import { ResizableBox, ResizableBoxProps } from "react-resizable";
import { setTimeout } from "timers";
import "./resizable.css";

interface ResizableProps {
  direction: "horizontal" | "vertical";
}

const Resizable: React.FC<ResizableProps> = (props) => {
  const { direction, children } = props;
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  const [innerHeight, setInnerHeight] = useState(window.innerHeight);
  const [resizableWidth, setResizableWidth] = useState(window.innerWidth * 0.5);

  let resizableProps: ResizableBoxProps;

  if (direction === "horizontal") {
    resizableProps = {
      className: "resize-horizontal",
      minConstraints: [innerWidth * 0.35, Infinity],
      maxConstraints: [innerWidth * 0.75, Infinity],
      height: Infinity,
      width: resizableWidth,
      axis: "x",
      resizeHandles: ["e"],
      onResizeStop: (event, data) => {
        setResizableWidth(data.size.width);
      },
    };
  } else {
    resizableProps = {
      minConstraints: [Infinity, 150],
      maxConstraints: [Infinity, innerHeight * 0.9],
      height: 300,
      width: Infinity,
      axis: "y",
      resizeHandles: ["s"],
    };
  }

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const listener = () => {
      if (timer) {
        clearTimeout(timer);
      }

      timer = setTimeout(() => {
        setInnerHeight(window.innerHeight);
        setInnerWidth(window.innerWidth);

        if (window.innerWidth * 0.75 < resizableWidth) {
          setResizableWidth(window.innerWidth * 0.75);
        }
      }, 100);
    };

    window.addEventListener("resize", listener);

    return () => {
      window.removeEventListener("resize", listener);
    };
  }, [resizableWidth]);

  return <ResizableBox {...resizableProps}>{children}</ResizableBox>;
};

export default Resizable;
