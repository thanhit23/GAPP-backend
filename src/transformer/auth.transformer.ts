import { BaseTransformer } from './base.transformer.ts';

class AuthTransformer extends BaseTransformer {
  async data() {
    const data = await this.resource;
    return { data };
  }
}

export class LoginTransformer extends AuthTransformer {}

export class GetMeTransformer extends BaseTransformer {
  async data() {
    const { password, ...data } = await this.resource;
    return { data };
  }
}

export class RegisterTransformer extends AuthTransformer {}
