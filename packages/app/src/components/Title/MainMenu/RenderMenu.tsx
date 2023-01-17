import { MenuItem } from "@/state/menu/MenuItem";
import { MenuDivider } from "@blueprintjs/core";
import { MenuItem2 } from "@blueprintjs/popover2";
import { observer } from "mobx-react-lite";

interface RenderMenuProps {
    item: MenuItem;
}

export const RenderMenu = observer(({ item }: RenderMenuProps) => {
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
                        label={item.hotkey?.combo}
                    >
                        {item.items ? <RenderMenu item={item} /> : undefined}
                    </MenuItem2>
                ),
            )}
        </>
    );
});
