import { MenuItem } from "@/state/menu/MenuItem";
import { HotkeyConfig, useHotkeys } from "@blueprintjs/core";
import { observer } from "mobx-react";
import { useMemo } from "react";

interface MenuHotkeysProps {
    parent?: MenuItem;
    items: MenuItem[];
}

export const MenuHotkeys = observer(({ parent, items }: MenuHotkeysProps) => {
    const hotkeys = useMemo(
        () =>
            items
                .filter((x) => x.hotkey)
                .map(
                    (x): HotkeyConfig => ({
                        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                        combo: x.hotkey!.combo!,
                        group: parent?.label,
                        label: x.label,
                        disabled: x.disabled,
                        global: true,
                        onKeyDown: () => x.handler?.(),
                        ...x.hotkey,
                    }),
                ),
        [items, parent?.label],
    );

    useHotkeys(hotkeys);

    return (
        <>
            {items.map((item, index) => {
                if (item.items) {
                    return <MenuHotkeys key={index} parent={item} items={item.items} />;
                }
            })}
        </>
    );
});
