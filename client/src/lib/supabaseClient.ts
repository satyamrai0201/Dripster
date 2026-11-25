import { createClient } from '@supabase/supabase-js';
import type { Product } from '@/types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

type QueryResult<T> = {
  data: T | null;
  error: Error | null;
};

type Filter = {
  column: string;
  operator: 'eq' | 'gt' | 'in' | 'not';
  value: unknown;
  comparison?: string;
};

type Ordering = {
  column: string;
  ascending: boolean;
};

function getValue(product: Product, column: string): unknown {
  const property = column.replace(/_([a-z])/g, (_, letter: string) => letter.toUpperCase());
  return product[property as keyof Product];
}

class LocalProductQuery implements PromiseLike<QueryResult<Product[]>> {
  private readonly filters: Filter[] = [];
  private readonly orderings: Ordering[] = [];
  private searchTerm: string | undefined;
  private resultLimit: number | undefined;
  private singleResult = false;

  select(_columns = '*'): this {
    return this;
  }

  eq(column: string, value: unknown): this {
    this.filters.push({ column, operator: 'eq', value });
    return this;
  }

  gt(column: string, value: unknown): this {
    this.filters.push({ column, operator: 'gt', value });
    return this;
  }

  in(column: string, values: readonly unknown[]): this {
    this.filters.push({ column, operator: 'in', value: values });
    return this;
  }

  not(column: string, comparison: string, value: unknown): this {
    this.filters.push({ column, operator: 'not', comparison, value });
    return this;
  }

  or(expression: string): this {
    this.searchTerm = expression.match(/name\.ilike\.%(.+?)%,description\.ilike/i)?.[1];
    return this;
  }

  order(column: string, options?: { ascending?: boolean }): this {
    this.orderings.push({ column, ascending: options?.ascending ?? true });
    return this;
  }

  limit(count: number): this {
    this.resultLimit = count;
    return this;
  }

  single(): Promise<QueryResult<Product>> {
    this.singleResult = true;
    return this.execute().then(({ data, error }) => {
      if (error) return { data: null, error };
      if (!data || data.length !== 1) {
        return { data: null, error: new Error('Expected exactly one product.') };
      }
      return { data: data[0], error: null };
    });
  }

  then<TResult1 = QueryResult<Product[]>, TResult2 = never>(
    onfulfilled?: ((value: QueryResult<Product[]>) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
  ): PromiseLike<TResult1 | TResult2> {
    return this.execute().then(onfulfilled, onrejected);
  }

  private async execute(): Promise<QueryResult<Product[]>> {
    try {
      const idFilter = this.filters.find(filter => filter.column === 'id' && filter.operator === 'eq');
      const endpoint = this.searchTerm
        ? `/api/products/search?q=${encodeURIComponent(this.searchTerm)}`
        : idFilter
          ? `/api/products/${encodeURIComponent(String(idFilter.value))}`
          : '/api/products';
      const response = await fetch(endpoint);
      if (!response.ok) {
        const detail = await response.text();
        return { data: null, error: new Error(detail || `Product request failed (${response.status}).`) };
      }

      const payload: unknown = await response.json();
      let products = Array.isArray(payload)
        ? payload as Product[]
        : payload && typeof payload === 'object'
          ? [payload as Product]
          : [];

      products = products.filter(product => this.filters.every(filter => {
        const actual = getValue(product, filter.column);
        switch (filter.operator) {
          case 'eq':
            return filter.column === 'id' || (filter.column === 'gender' && filter.value === 'all')
              ? true
              : actual === filter.value;
          case 'gt':
            return typeof actual === 'number' && typeof filter.value === 'number' && actual > filter.value;
          case 'in':
            return Array.isArray(filter.value) && filter.value.includes(actual);
          case 'not':
            return filter.comparison === 'is' && filter.value === null
              ? actual !== null && actual !== undefined
              : actual !== filter.value;
        }
      }));

      for (const ordering of this.orderings) {
        const property = ordering.column;
        products.sort((left, right) => {
          const a = getValue(left, property);
          const b = getValue(right, property);
          const comparison = typeof a === 'number' && typeof b === 'number'
            ? a - b
            : String(a ?? '').localeCompare(String(b ?? ''));
          return ordering.ascending ? comparison : -comparison;
        });
      }

      if (!this.singleResult && this.resultLimit !== undefined) {
        products = products.slice(0, this.resultLimit);
      }

      return { data: products, error: null };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error : new Error('Product request failed.'),
      };
    }
  }
}

class LocalProductsClient {
  from(table: string): LocalProductQuery {
    if (table !== 'products') {
      throw new Error(`Local mode does not support the "${table}" table.`);
    }
    return new LocalProductQuery();
  }
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : new LocalProductsClient();
