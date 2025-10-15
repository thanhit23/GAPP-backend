import { BaseTransformer } from './base.transformer.ts';

export class ProfileTransformer extends BaseTransformer {
  async data() {
    const { password: _password, ...data } = await this.resource;

    return { data };
  }
}

export class SuggestUserTransformer extends BaseTransformer {
  async data() {
    const data = await this.resource;

    return { data };
  }
}
