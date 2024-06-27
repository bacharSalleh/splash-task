import gsap from "gsap";
import {
  PropsWithoutRef,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { useStore } from "../store/store";

type GraphPanelProps = {
  speed: number;
};

export type GraphPanelRef = HTMLDivElement & {
  play: (targetValue: number) => void;
  reset: () => void;
};

const GraphPanel = forwardRef<GraphPanelRef, PropsWithoutRef<GraphPanelProps>>(
  (props, ref) => {
    const { speed } = props;
    const setResult = useStore((state) => state.setResult);

    const GRAPH_HEIGHT = 500;
    const GRAPH_START_X = 20;
    const [containerWidth, setContainerWidth] = useState<number | undefined>(
      undefined,
    );

    const svgRef = useRef<SVGSVGElement>(null!);
    const containerRef = useRef<HTMLDivElement>(null!);
    const resultRef = useRef<HTMLHeadingElement>(null!);
    const circleRef = useRef<SVGCircleElement>(null!);
    const pathRef = useRef<SVGPathElement>(null!);
    const timeline = useRef(gsap.timeline());

    useEffect(() => {
      resultRef.current.innerText = "0.00x";
    }, []);

    const playTimeline = useCallback(
      (targetValue: number) => {
        if (!containerWidth) return undefined;

        if (timeline.current.isActive()) {
          timeline.current.clear();
          timeline.current.restart();
        }

        const tweenValue = { value: 0 };

        const startX = GRAPH_START_X + 10;
        const startY = GRAPH_HEIGHT - 50;
        const endX = ((containerWidth - 20) * targetValue) / 10;
        const endY = 130;
        const time = 1;

        timeline.current.to(tweenValue, {
          duration: 5 / speed,
          value: time,
          onStart: () => {
            tweenValue.value = 0;
            pathRef.current.setAttribute("d", `M ${startX} ${startY}`);
            circleRef.current.setAttribute("cx", `${startX}`);
            circleRef.current.setAttribute("cy", `${startY}`);
            circleRef.current.style.visibility = "visible"; // Optionally hide the circle
            resultRef.current.innerText = `0.00x`; // Clear the result text
          },
          onUpdate: () => {
            const t = tweenValue.value;
            const x = startX + t * (endX - startX); // Linear interpolation
            const y = startY + Math.pow(t, 5) * (endY - startY); // Quintic easing

            const currentD = pathRef.current.getAttribute("d");
            const newL = `L ${x} ${y}`;
            const newD = `${currentD} ${newL}`;

            pathRef.current.setAttribute("d", newD);
            circleRef.current.setAttribute("cx", `${x}`);
            circleRef.current.setAttribute("cy", `${y}`);
            resultRef.current.innerText = `${(t * targetValue).toFixed(2)}x`;
          },
          onComplete: () => {
            setResult(targetValue);
          },
          ease: "power2.in",
        });
      },
      [containerWidth, setResult, speed],
    );

    const restTimeline = useCallback(() => {
      timeline.current.clear();
      pathRef.current.removeAttribute("d");
      circleRef.current.removeAttribute("cx");
      circleRef.current.removeAttribute("cy");
      circleRef.current.style.visibility = "hidden";
      resultRef.current.innerText = "0.00x";
    }, []);

    useEffect(() => {
      setContainerWidth(containerRef.current.getBoundingClientRect().width);
    }, []);

    useImperativeHandle(ref, () => {
      return {
        ...containerRef.current,
        play: playTimeline,
        reset: restTimeline,
      };
    }, [playTimeline, restTimeline]);

    return (
      <div
        className="relative rounded border border-gray-700 bg-gray-800"
        style={{ height: GRAPH_HEIGHT }}
        ref={containerRef}
      >
        {containerWidth && (
          <svg width="100%" height="100%" ref={svgRef}>
            <defs>
              <filter
                id="neon-shadow"
                x="-50%"
                y="-50%"
                width="200%"
                height="200%"
              >
                <feDropShadow
                  dx="0"
                  dy="0"
                  stdDeviation="2"
                  floodColor="#ff7f50"
                />
              </filter>
            </defs>

            <line
              x1={GRAPH_START_X}
              y1={GRAPH_HEIGHT - 40}
              x2={containerWidth - 20}
              y2={GRAPH_HEIGHT - 40}
              stroke="white"
              strokeWidth="1"
              fill="gray"
            />
            {[...Array(11)].map((_, index) => (
              <text
                key={index}
                x={30 + ((index * 10) / 100) * (containerWidth - 60)}
                y={GRAPH_HEIGHT - 20}
                fontSize="10"
                textAnchor={"middle"}
                fill="gray"
              >
                {index}
              </text>
            ))}

            <path fill="none" stroke="orange" strokeWidth="4" ref={pathRef} />
            <circle
              style={{ visibility: "hidden" }}
              r="10"
              fill="#ff7f50"
              strokeWidth={3}
              ref={circleRef}
              filter="url(#neon-shadow)"
            />
          </svg>
        )}

        <h1
          className="absolute left-1/2 top-[10%] -translate-x-1/2 text-5xl font-bold text-white"
          ref={resultRef}
        ></h1>
      </div>
    );
  },
);

export default GraphPanel;
