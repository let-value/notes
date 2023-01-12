import { Button, ButtonProps, Menu, OverflowList, OverflowListProps } from "@blueprintjs/core";
import { MenuItem2, Popover2, Popover2Props } from "@blueprintjs/popover2";
import cx from "classnames";
import { ComponentProps, FC, useCallback } from "react";
import { FileMenu } from "./FileMenu";
import { ViewMenu } from "./ViewMenu";

const menuItems = [FileMenu, ViewMenu];

type Item = typeof menuItems[number];

const popoverProps: Popover2Props = {
    placement: "bottom-start",
    modifiers: { arrow: { enabled: false } },
};

export interface AppMenuProps extends Partial<OverflowListProps<Item>> {
    TargetProps?: ComponentProps<"span">;
    ItemProps?: ButtonProps;
}

export const AppMenu: FC<AppMenuProps> = ({ TargetProps, ItemProps, ...other }) => {
    const renderTarget = useCallback(
        (Item: Item, { className, ...other }: any) => (
            <span {...TargetProps} {...other} className={cx(className, TargetProps?.className)}>
                <Button minimal {...ItemProps}>
                    {Item.displayName}
                </Button>
            </span>
        ),
        [ItemProps, TargetProps],
    );

    const renderItem = useCallback(
        (Item: Item, index: number) => {
            return (
                <Popover2
                    key={index}
                    {...popoverProps}
                    content={
                        <Menu>
                            <Item />
                        </Menu>
                    }
                    renderTarget={renderTarget.bind(undefined, Item)}
                />
            );
        },
        [renderTarget],
    );

    const renderOverflow = useCallback((items: Item[]) => {
        return (
            <Popover2
                {...popoverProps}
                content={
                    <Menu>
                        {items.map((Item, index) => (
                            <MenuItem2 key={index} text={Item.displayName}>
                                <Item />
                            </MenuItem2>
                        ))}
                    </Menu>
                }
            >
                <Button minimal icon={items.length === menuItems.length ? "menu" : "more"}></Button>
            </Popover2>
        );
    }, []);

    return (
        <OverflowList
            collapseFrom="end"
            items={menuItems}
            overflowRenderer={renderOverflow}
            visibleItemRenderer={renderItem}
            {...other}
        />
    );
};
