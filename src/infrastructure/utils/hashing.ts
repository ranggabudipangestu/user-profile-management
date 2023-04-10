import bcrypt from "bcrypt";

export interface Hash {
  compare: (text: string, hash: string) => Promise<boolean>;
  hash: (text: string) => string;
}

export default class HashImpl implements Hash {
  async compare(text: string, hash: string) {
    const isMatch = await bcrypt.compare(text, hash);
    return isMatch;
  }
  hash(text: string) {
    const salt = bcrypt.genSaltSync(parseInt(process.env.SALTROUNDS) || 10);
    const hash = bcrypt.hashSync(text, salt);
    return hash;
  }
}
