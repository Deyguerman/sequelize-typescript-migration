import * as crypto from "crypto";
import type { IndexesOptions } from "sequelize/types";

export default function parseIndex(idx: IndexesOptions) {
  const result: { [x: string]: unknown } = {};

  [
    "name",
    "type",
    "unique",
    "concurrently",
    "fields",
    "using",
    "operator",
    "where",
  ].forEach((key) => {
    if (idx[key] !== undefined) result[key] = idx[key];
  });

  const options: { [x: string]: unknown } = {};

  if (idx.name) {
    // options.indexName = idx.name;
    options.name = idx.name;
  }
  // The name of the index. Default is __

  // @todo: UNIQUE|FULLTEXT|SPATIAL
  if (idx.unique) options.type = "UNIQUE";

  // Set a type for the index, e.g. BTREE. See the documentation of the used dialect
  //   if (idx.method) {
  //     options["indexType"] = idx.type;
  //   }

  if (idx.parser && idx.parser !== "") options.parser = idx.parser;
  // For FULLTEXT columns set your parser

  result.options = options;

  //   result["hash"] = hash(idx);
  result.hash = crypto
    .createHash("sha1")
    .update(JSON.stringify(idx))
    .digest("hex");

  return result;
}
