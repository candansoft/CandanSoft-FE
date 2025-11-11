// string'i lowercase yapıp özel karakterleri '_' ile değiştir
export const normalizeValue = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, "_");
