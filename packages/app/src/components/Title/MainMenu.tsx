import { container } from "@/container";
import { MenuItem } from "@/state/menu/MenuItem";
import { Button, ButtonProps, Menu, MenuDivider, OverflowList, OverflowListProps } from "@blueprintjs/core";
import { MenuItem2, Popover2, Popover2Props } from "@blueprintjs/popover2";
import cx from "classnames";
import { observer } from "mobx-react-lite";
import { ComponentProps, useCallback } from "react";

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
        (item: MenuItem, { className, ...other }: any) => (
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
                            <ChildMenu item={item} />
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
                                    <ChildMenu item={item} />
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
        <OverflowList
            collapseFrom="end"
            items={mainMenu.items}
            overflowRenderer={renderOverflow}
            visibleItemRenderer={renderItem}
            {...other}
        />
    );
});

interface ChildMenuProps {
    item: MenuItem;
}

export const ChildMenu = observer(({ item }: ChildMenuProps) => {
    const items = item.items;

    if (!items || items.length === 0) {
        return null;
    }

    return (
        <>
            {items.map((item, index) =>
                item.type === "separator" ? (
                    <MenuDivider key={index} />
                ) : (
                    <MenuItem2
                        key={index}
                        text={item.label}
                        disabled={item.disabled}
                        icon={item.checked ? "tick" : undefined}
                        onClick={() => item.handler?.()}
                    >
                        {item.items ? <ChildMenu item={item} /> : undefined}
                    </MenuItem2>
                ),
            )}
        </>
    );
});
