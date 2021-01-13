import { v4 as uuidv4 } from 'uuid';
import fs from 'fs-extra';
import path from 'path';

class Temporary {
  public set: Set<string> = new Set();

  async write(view: string, code: string) {
    const dir = path.dirname(view);
    const str = `b${uuidv4()}.html`;
    const p = path.join(dir, str);
    await fs.outputFile(p, code);
    this.set.add(p);
    return p;
  }

  async delete() {
    const all = [...this.set.keys()].map((f) => {
      return fs.remove(f);
    });
    await Promise.all(all);
  }

  deleteSync() {
    [...this.set.keys()].map((f) => {
      return fs.removeSync(f);
    });
  }
}

export default new Temporary();
