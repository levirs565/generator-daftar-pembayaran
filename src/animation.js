export const ListItemMotionProps = {
  layout: true,
  initial: { x: -300, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: -300, opacity: 0 },
  transition: {
    type: "tween",
  },
};
