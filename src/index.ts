import { encryptData } from "./encrypt";

export default class Metadata1 {
    public static encrypt(data: any): string {
        return encryptData(data);
    }
}