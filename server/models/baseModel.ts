import { Model } from "https://deno.land/x/denodb/mod.ts";

class BaseModel extends Model {
  static async list() {
    return await this.all();
  }
  // @TODO: Replace the `any`
  static async findById(idOrIds: any): Promise<Model> {
    return await this.find(idOrIds);
  }

  static async add(fields: any) {
    return await this.create(fields);
  }
}

export default BaseModel;
