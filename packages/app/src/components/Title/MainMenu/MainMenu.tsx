import { container } from "@/container";
import { MenuItem } from "@/state/menu/MenuItem";
import { Button, ButtonProps, Menu, OverflowList, OverflowListProps } from "@blueprintjs/core";
import { MenuItem2, Popover2, Popover2Props } from "@blueprintjs/popover2";
import cx from "classnames";
import { observer } from "mobx-react-lite";
import { ComponentProps, useCallback } from "react";
import { RenderMenu } from "./RenderMenu";

const popoverProps: Popover2Props = {
    placement: "bottom-start",
    modifiers: { arrow: { enabled: false } },
};

export interface MainMenuProps extends Partial<OverflowListProps<MenuItem>> {
    TargetProps?: ComponentProps<"span">;
    ItemProps?: ButtonProps;
}

export const MainMenu = observer(({ TargetProps, ItemProps, ...other }: MainMenuProps) => {
    const mainMenu = container.get("mainMenu");

    const renderTarget = useCallback(
        (item: MenuItem, { className, isOpen, ...other }: any) => (
            <span {...TargetProps} {...other} className={cx(className, TargetProps?.className)}>
                <Button minimal {...ItemProps}>
                    {item.label}
                </Button>
            </span>
        ),
        [ItemProps, TargetProps],
    );

    const renderItem = useCallback(
        (item: MenuItem, index: number) => {
            return (
                <Popover2
                    key={index}
                    {...popoverProps}
                    content={
                        <Menu>
                            <RenderMenu item={item} />
                        </Menu>
                    }
                    renderTarget={renderTarget.bind(undefined, item)}
                />
            );
        },
        [renderTarget],
    );

    const renderOverflow = useCallback(
        (items: MenuItem[]) => {
            return (
                <Popover2
                    {...popoverProps}
                    content={
                        <Menu>
                            {items.map((item, index) => (
                                <MenuItem2 key={index} text={item.label} onClick={() => item.handler?.()}>
                                    <RenderMenu item={item} />
                                </MenuItem2>
                            ))}
                        </Menu>
                    }
                >
                    <Button minimal icon={items.length === mainMenu.items.length ? "menu" : "more"}></Button>
                </Popover2>
            );
        },
        [mainMenu.items.length],
    );

    return (
        <>
            <OverflowList
                collapseFrom="end"
                items={mainMenu.items}
                overflowRenderer={renderOverflow}
                visibleItemRenderer={renderItem}
                {...other}
            />
            {/* <MenuHotkeys items={mainMenu.items} /> */}
        </>
    );
});
