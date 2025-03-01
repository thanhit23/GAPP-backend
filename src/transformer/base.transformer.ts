export class BaseTransformer {
  protected resource: any;

  constructor(entity: any) {
    this.resource = entity;
    return this.data();
  }

  data(): any {
    return this.resource;
  }
}
