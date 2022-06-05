import path = require("path");

export default function changeExtension(name: string, from: string, to: string) {
    if (name.endsWith(from) && !name.endsWith(to)) {
        const index = name.lastIndexOf(from);
        return name.substring(0, index) + to;
    }
    return name;
}
