export function incrementFileNameIfExist(name: string, files: string[]) {
    const regex = new RegExp(`${name} \\((\\d+)\\)`);
    const sameNameFiles = files.filter((file) => file.startsWith(name));
    if (sameNameFiles.length === 0) {
        return name;
    }

    const numbers = sameNameFiles.map((file) => {
        const match = file.match(regex);
        if (!match) {
            return 0;
        }
        return parseInt(match[1]);
    });

    const max = Math.max(...numbers);
    return `${name} (${max + 1})`;
}
