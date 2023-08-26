export class LocationUtils {

    private static splitter = '-';

    public static getID(rack: string, section: number): string {
        return [rack, section].join(LocationUtils.splitter);
    }

    public static getEntries(value: string): [string, number] {
        const [rack, section] = value.split(LocationUtils.splitter);
        return [rack, +section];
    }

}
