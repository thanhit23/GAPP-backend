import { BaseTransformer } from './base.transformer.ts';

export class CreateCommentTransformer extends BaseTransformer {
  async data() {
    const data = await this.resource;

    return { data };
  }
}

export class GetCommentByOptionTransformer extends CreateCommentTransformer {}
