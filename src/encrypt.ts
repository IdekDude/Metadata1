const IEEE_POLYNOMIAL: number = 3988292384;
const identifier: string = "ECdITeCs";
const material: number[] = [1888420705, 2576816180, 2347232058, 874813317];
let crcTable: any[] = [];

/**
 * Encrypts metadata1 object
 * @param data - unencrypted metadata1 object
 * @returns {string} encrypted metadata1 object in string format
 */
export let encryptData = function (data: any) {
    return encrypt(encode(data))
}

// << Encryption >> //

let doEncrypt = function (r: string, t: any) {
    let e = Math.ceil(r.length / 4);
    let o = [];
    let f = [];

    if (0 === r.length)
        return "";

    for (let i = 0; i < e; i++)
        o[i] = (255 & r.charCodeAt(4 * i)) + ((255 & r.charCodeAt(4 * i + 1)) << 8) + ((255 & r.charCodeAt(4 * i + 2)) << 16) + ((255 & r.charCodeAt(4 * i + 3)) << 24);
    for (let n = Math.floor(6 + 52 / e), a = o[0], c = o[e - 1], d = 0; n-- > 0; )
        for (let h = (d += 2654435769) >>> 2 & 3, u = 0; u < e; u++)
            a = o[(u + 1) % e],
                c = o[u] += (c >>> 5 ^ a << 2) + (a >>> 3 ^ c << 4) ^ (d ^ a) + (t[3 & u ^ h] ^ c);
    for (let s = 0; s < e; s++)
        f[s] = String.fromCharCode(255 & o[s], o[s] >>> 8 & 255, o[s] >>> 16 & 255, o[s] >>> 24 & 255);
    return f.join("");
}

let encrypt = function (r: string) {
    return identifier + ":" + base64Encode(doEncrypt(r, material));
}

// << Encryption >> //

// << Script Number (Prefix before Hashtag) >> //

let base64Encode = function (e: string) {
    let c;
    let t;
    let r;
    let o;
    let n;
    let h = "";
    let d;

    c = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", d = /[\t\n\f\r ]/g,
        e = String(e),
    /[^\0-\xFF]/.test(e) && console.log("The string to be encoded contains characters outside of the Latin1 range.");
    for (let d = e.length % 3 as unknown as RegExp, i = -1, f = e.length - (d as unknown as number); ++i < f; )
        t = e.charCodeAt(i) << 16,
            r = e.charCodeAt(++i) << 8,
            o = e.charCodeAt(++i),
            h += c.charAt((n = t + r + o) >> 18 & 63) + c.charAt(n >> 12 & 63) + c.charAt(n >> 6 & 63) + c.charAt(63 & n);
    return h
}

let utf8encode = function (r: string) {
    let o = [];
    for (let t = 0; t < r.length; t++) {
        let e = r.charCodeAt(t);
        e < 128 ? o.push(String.fromCharCode(e)) : e >= 128 && e < 2048 ? (o.push(String.fromCharCode(e >> 6 | 192)), o.push(String.fromCharCode(63 & e | 128))) : (o.push(String.fromCharCode(e >> 12 | 224)), o.push(String.fromCharCode(e >> 6 & 63 | 128)), o.push(String.fromCharCode(63 & e | 128)));
    }
    return o.join("");
}

let hexEncode = function (t: number) {
    function A() {}
    A.ALPHABET = "0123456789ABCDEF";

    return [
        A.ALPHABET.charAt(t >>> 28 & 15), A.ALPHABET.charAt(t >>> 24 & 15),
        A.ALPHABET.charAt(t >>> 20 & 15), A.ALPHABET.charAt(t >>> 16 & 15),
        A.ALPHABET.charAt(t >>> 12 & 15), A.ALPHABET.charAt(t >>> 8 & 15),
        A.ALPHABET.charAt(t >>> 4 & 15), A.ALPHABET.charAt(15 & t)
    ].join('');
}

let buildCrcTable = function () {
    let e;
    let c;

    for (let t = 0; t < 256; t++) {
        for (e = t, c = 0; c < 8; c++)
            1 == (1 & e) ? e = e >>> 1 ^ IEEE_POLYNOMIAL : e >>>= 1;
        crcTable[t] = e;
    }
}

let calculate = function (r: string) {
    buildCrcTable();
    var t, e = 0;
    e ^= 4294967295;
    for (var c = 0; c < r.length; c++)
        t = 255 & (e ^ r.charCodeAt(c)),
            e = e >>> 8 ^ crcTable[t];
    return 4294967295 ^ e;
}

let encode = function (t: any) {
    let c = utf8encode(JSON.stringify(t));
    return hexEncode(calculate(c)) + "#" + c;
}

// << Script Number (Prefix before Hashtag) >> //