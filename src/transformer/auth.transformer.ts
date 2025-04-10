import { BaseTransformer } from './base.transformer.ts';

class AuthTransformer extends BaseTransformer {
  async data() {
    const {
      user: { password: _password, ...user },
      ...data
    } = await this.resource;

    return { data: { user, ...data } };
  }
}

export class LoginTransformer extends AuthTransformer {}

export class GetMeTransformer extends BaseTransformer {
  async data() {
    const { password: _password, ...data } = await this.resource;
    return { data };
  }
}

export class RegisterTransformer extends BaseTransformer {
  async data() {
    const { password: _password, ...data } = await this.resource;

    return { data };
  }
}
