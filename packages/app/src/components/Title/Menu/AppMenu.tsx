import { Button, Menu, OverflowList, OverflowListProps } from "@blueprintjs/core";
import { MenuItem2, Popover2, Popover2Props } from "@blueprintjs/popover2";
import { FC, useCallback } from "react";
import { FileMenu } from "./FileMenu";
import { ViewMenu } from "./ViewMenu";

const menuItems = [FileMenu, ViewMenu];

type Item = typeof menuItems[number];

const popoverProps: Popover2Props = {
    placement: "bottom-start",
    modifiers: { arrow: { enabled: false } },
};

export const AppMenu: FC<Partial<OverflowListProps<Item>>> = (props) => {
    const renderItem = useCallback((Item: Item, index: number) => {
        return (
            <Popover2
                key={index}
                {...popoverProps}
                content={
                    <Menu>
                        <Item />
                    </Menu>
                }
            >
                <Button minimal>{Item.displayName}</Button>
            </Popover2>
        );
    }, []);

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
            {...props}
        />
    );
};
