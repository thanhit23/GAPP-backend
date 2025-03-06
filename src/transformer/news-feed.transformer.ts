import { BaseTransformer } from './base.transformer.ts';

export class CreateNewsFeedTransformer extends BaseTransformer {
  async data() {
    const data = await this.resource;
    return { data };
  }
}

export class GetNewsFeedTransformer extends BaseTransformer {
  async data() {
    return await this.resource;
  }
}

export class GetSingleNewsFeedTransformer extends BaseTransformer {
  async data() {
    const data = await this.resource;
    return { data };
  }
}
