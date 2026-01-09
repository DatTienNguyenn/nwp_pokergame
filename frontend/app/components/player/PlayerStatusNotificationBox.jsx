import { useRef } from "react";
import { CSSTransition } from "react-transition-group";

export default function PlayerStatusNotificationBox({
  index,
  isActive,
  content,
  endTransition,
}) {
  const nodeRef = useRef(null);

  return (
    <CSSTransition
      nodeRef={nodeRef}
      in={isActive}
      timeout={{
        appear: 0,
        enter: 0,
        exit: 1250,
      }}
      classNames="transitionable-actionBox"
      onEntered={() => {
        setTimeout(() => {
          endTransition(index);
        }, 25);
      }}
    >
      <div ref={nodeRef} className="actionBox">{`${content}`}</div>
    </CSSTransition>
  );
}
