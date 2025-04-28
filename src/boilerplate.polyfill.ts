import _ from 'lodash';
import type { ObjectLiteral } from 'typeorm';
import { Brackets, SelectQueryBuilder } from 'typeorm';

import type { AbstractEntity } from './common/abstract.entity';
import { PageMetaDto } from './common/dto/page-meta.dto.ts';
import type { PageOptionsDto } from './common/dto/page-options.dto';
import type { KeyOfType } from './types';
import { PageCursorOptionsDto } from 'common/dto/page-cursor-options.dto.ts';

declare global {
  export type Uuid = string & { _uuidBrand: undefined };
  export type Todo = any & { _todoBrand: undefined };
}

declare module 'typeorm' {
  interface SelectQueryBuilder<Entity> {
    searchByString(
      q: string,
      columnNames: string[],
      options?: {
        formStart: boolean;
      },
    ): this;

    paginate(
      this: SelectQueryBuilder<Entity>,
      pageOptionsDto: PageOptionsDto,
      options?: Partial<{ takeAll: boolean; skipCount: boolean }>,
    ): Promise<[Entity[], PageMetaDto]>;

    cursorPaginate(
      this: SelectQueryBuilder<Entity>,
      pageOptionsDto: PageCursorOptionsDto,
    ): Promise<any>;

    leftJoinAndSelect<AliasEntity extends AbstractEntity, A extends string>(
      this: SelectQueryBuilder<Entity>,
      property: `${A}.${Exclude<
        KeyOfType<AliasEntity, AbstractEntity>,
        symbol
      >}`,
      alias: string,
      condition?: string,
      parameters?: ObjectLiteral,
    ): this;

    leftJoin<AliasEntity extends AbstractEntity, A extends string>(
      this: SelectQueryBuilder<Entity>,
      property: `${A}.${Exclude<
        KeyOfType<AliasEntity, AbstractEntity>,
        symbol
      >}`,
      alias: string,
      condition?: string,
      parameters?: ObjectLiteral,
    ): this;

    innerJoinAndSelect<AliasEntity extends AbstractEntity, A extends string>(
      this: SelectQueryBuilder<Entity>,
      property: `${A}.${Exclude<
        KeyOfType<AliasEntity, AbstractEntity>,
        symbol
      >}`,
      alias: string,
      condition?: string,
      parameters?: ObjectLiteral,
    ): this;

    innerJoin<AliasEntity extends AbstractEntity, A extends string>(
      this: SelectQueryBuilder<Entity>,
      property: `${A}.${Exclude<
        KeyOfType<AliasEntity, AbstractEntity>,
        symbol
      >}`,
      alias: string,
      condition?: string,
      parameters?: ObjectLiteral,
    ): this;
  }
}

SelectQueryBuilder.prototype.searchByString = function (
  q,
  columnNames,
  options,
) {
  if (!q) {
    return this;
  }

  this.andWhere(
    new Brackets((qb) => {
      for (const item of columnNames) {
        qb.orWhere(`${item} ILIKE :q`);
      }
    }),
  );

  if (options?.formStart) {
    this.setParameter('q', `${q}%`);
  } else {
    this.setParameter('q', `%${q}%`);
  }

  return this;
};

SelectQueryBuilder.prototype.paginate = async function (
  pageOptionsDto: PageOptionsDto,
  options?: Partial<{
    skipCount: boolean;
    takeAll: boolean;
  }>,
) {
  if (!options?.takeAll) {
    this.skip(pageOptionsDto.skip).take(pageOptionsDto.take);
  }

  const entities = await this.getMany();

  let itemCount = -1;

  if (!options?.skipCount) {
    itemCount = await this.getCount();
  }

  const pageMetaDto = new PageMetaDto({
    itemCount,
    pageOptionsDto,
  });

  return [entities, pageMetaDto];
};

SelectQueryBuilder.prototype.cursorPaginate = async function (
  pageOptionsDto: PageCursorOptionsDto,
) {
  const { limit = 10 } = pageOptionsDto;

  this.take(limit + 1);

  const data = await this.getMany();

  const total = await this.getCount();

  const hasNextPage = data.length > limit;
  if (hasNextPage) {
    data.pop();
  }

  let nextCursor = null;
  if (hasNextPage && data.length > 0) {
    const lastPost = data[data.length - 1];

    nextCursor = {
      id: lastPost.id,
      createdAt: lastPost.createdAt,
    };
  }

  return {
    data,
    pagination: {
      total,
      hasNextPage,
      nextCursor,
    },
  };
};
