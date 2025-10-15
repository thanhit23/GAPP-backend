import { BaseTransformer } from './base.transformer.ts';

export class CreateLikeTransformer extends BaseTransformer {
  async data() {
    const data = await this.resource;

    return { data };
  }
}
