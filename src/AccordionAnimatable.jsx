import {
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Box,
  Text,
  Accordion,
} from "@chakra-ui/react";
import { LayoutGroup, MotionConfig, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/* layout and layoutDependendy is needed to make Text not animated when other accordion expanded. Why it does trigger animation? Because element are recreated. When Text layoutDependency is unspecified then when text created sometime it is hidden */

export const AccordionBodyMotionProps = {
  layoutDependency: 0,
  layoutId: "body",
};

export function AccordionItemAnimatable({
  id,
  title,
  collapsedBodyTitle,
  expandedBody,
}) {
  return (
    <AccordionItem>
      {({ isExpanded }) => (
        <LayoutGroup id={id}>
          <h2>
            <AccordionButton>
              <Box as="span" flex="1" textAlign="left">
                {title}
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          {!isExpanded && (
            <Text as={motion.p} px={4} py={2} {...AccordionBodyMotionProps}>
              {collapsedBodyTitle}
            </Text>
          )}
          <AccordionPanel>{expandedBody}</AccordionPanel>
        </LayoutGroup>
      )}
    </AccordionItem>
  );
}

export function AccordionAnimatable(props) {
  return (
    <MotionConfig
      transition={{
        layout: {
          duration: 0.2,
        },
      }}
    >
      <Accordion {...props} />
    </MotionConfig>
  );
}

export function useAccordionAutoScroller() {
  const [index, setIndex] = useState(-1);
  const pendingScroll = useRef(false);

  useEffect(() => {
    if (pendingScroll.current) {
      window.scrollTo(0, document.body.scrollHeight);
      pendingScroll.current = false;
    }
  });

  return {
    accordionProps: {
      index,
      onChange: (index) => setIndex(index),
    },
    onBeforeAddItem: (list) => {
      setIndex(list.length);
      pendingScroll.current = true;
    },
  };
}
