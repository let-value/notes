import { noop } from "lodash-es";
import { forwardRef, Ref } from "react";
import { createHorizontalStrength, createVerticalStrength, useDndScrolling } from "react-dnd-scrolling";

const DEFAULT_BUFFER = 150;

export const defaultHorizontalStrength = createHorizontalStrength(DEFAULT_BUFFER);

export const defaultVerticalStrength = createVerticalStrength(DEFAULT_BUFFER);

export const DndScrolling = forwardRef(function DndScrolling(
    {
        onScrollChange = noop,
        verticalStrength = defaultVerticalStrength,
        horizontalStrength = defaultHorizontalStrength,
        strengthMultiplier = 30,
    }: Parameters<typeof useDndScrolling>[1],
    ref: Ref<HTMLDivElement>,
) {
    useDndScrolling(ref, {
        strengthMultiplier,
        verticalStrength,
        horizontalStrength,
        onScrollChange,
    });

    return null;
});
