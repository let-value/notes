import { ColumnSchema, Model, tableSchema } from "@nozbe/watermelondb";

interface TypedColumnSchema<TModel extends Model> extends Omit<ColumnSchema, "name"> {
    name: keyof TModel;
}

type TableSchemaSpec = Parameters<typeof tableSchema>[0];

interface TableSchema<TModel extends Model> extends Omit<TableSchemaSpec, "columns"> {
    columns: TypedColumnSchema<TModel>[];
}

export function createTable<TModel extends Model>(spec: TableSchema<TModel>) {
    return tableSchema(spec as TableSchemaSpec);
}
