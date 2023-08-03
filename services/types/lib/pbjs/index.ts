import * as parser from 'protocol-buffers-schema';
import { generate } from './generate';

export function parseSchema(contents: string) {
  const schema = parser.parse(contents);
  return {
    compile(): any {
      const result = {};
      new Function('exports', generate(schema))(result);
      return result;
    },

    toJavaScript({ es6 }: { es6?: boolean } = {}): string {
      return generate(schema, { es6 });
    },

    toTypeScript(importPathMap?: Record<string, string>): string {
      return generate(schema, { typescript: true, importPathMap });
    },
  };
};
