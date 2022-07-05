declare const Pool: any;
declare const pool: any;
declare function get(sql: any): Promise<any>;
declare function update(sql: any): Promise<any>;
declare function insert(sql: any, queryData: any): Promise<number>;
declare function batchInsert(sql: any): Promise<number>;
declare function del(table: any, where: any): Promise<number>;
