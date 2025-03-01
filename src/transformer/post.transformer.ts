import { BaseTransformer } from './base.transformer.ts';

export class CreatePostTransformer extends BaseTransformer{
  async data() {
    const { userId, ...data } = await this.resource;
    return { data };
  }
}

export class GetPostsTransformer extends BaseTransformer{
  async data() {
    return await this.resource;
  }
}

export class GetSinglePostTransformer extends BaseTransformer{
  async data() {
    const data = await this.resource;
    return { data };
  }
}
