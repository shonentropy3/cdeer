-- 创建库语句

-- 创建日志表
CREATE TABLE block_logs (
 id serial PRIMARY KEY,
  "block" int8 NOT NULL
);


-- 创建需求表
CREATE TABLE tasks (
	"id" BIGINT UNIQUE, 
  "issuer" varchar(64),
  "hash" varchar(128),
  "title" varchar(255),
	"desc" varchar(64),
  "period" BIGINT,
  "budget" varchar(64),
  "role" varchar[],
  "attachment" varchar(64),
	"apply_switch" int2 DEFAULT 1,
	"del" int2 NOT NULL DEFAULT 0,
  "suffix" varchar(64),
  "create_time" date DEFAULT (now()),
  "update_time" date DEFAULT (now())
);

COMMENT ON COLUMN "public"."tasks"."apply_switch" IS '报名开关: 0.关  1.开';
COMMENT ON COLUMN "public"."tasks"."del" IS '项目状态: 0.不删  1.删除';


CREATE INDEX "desc" ON "public"."tasks" USING btree (
  "desc" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);

CREATE INDEX "id" ON "public"."tasks" USING btree (
  "id" "pg_catalog"."int8_ops" ASC NULLS LAST
);

CREATE INDEX "issuer" ON "public"."tasks" USING btree (
  "issuer" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);

-- 创建订单表
CREATE TABLE orders (
 id serial PRIMARY KEY,
  "order_id" BIGINT,
	"task_id" BIGINT, 
	"issuer" varchar(64),
  "worker" varchar(64),
  "attachment" varchar(64),
  "signature" varchar(132),
  "signaddress" varchar(64),
  "signnonce" Int,
  "stages" json,
  "create_time" date DEFAULT (now()),
  "update_time" date DEFAULT (now()),
  UNIQUE("order_id")
);

-- 创建报名表
CREATE TABLE apply_info (
 id serial PRIMARY KEY,
  "apply_addr" varchar(64),
	"task_id" BIGINT, 
	"price" DECIMAL, 
  "sort" int2,
	"desc" varchar(64),
  "create_time" date DEFAULT (now()),
  "update_time" date DEFAULT (now())
);
COMMENT ON COLUMN "public"."apply_info"."sort" IS '排序: 0.底部  1.正常';


-- 创建日志同步hash表
CREATE TABLE trans_hashes (
 id serial PRIMARY KEY,
  "hash" varchar(128) UNIQUE,
	"task_id" BIGINT,
  "category" int2,
	"send_addr" varchar(64),
	"is_update" int2 DEFAULT 0,
  "create_time" date DEFAULT (now()),
  "update_time" date DEFAULT (now())
);

COMMENT ON COLUMN "public"."trans_hashes"."category" IS '交易hash种类: 1.创建需求  2.修改需求  3.报名  4.修改报名  5.删除报名 6.创建订单以及修改订单';
COMMENT ON COLUMN "public"."trans_hashes"."is_update" IS '是否同步链上数据: 0.未同步  1.已经同步';


-- 创建nftscan缓存表
CREATE TABLE nfts (
 id serial PRIMARY KEY,
  "info" json,
	"account" varchar(42),
	"chain" varchar(15),
  "erc_type" varchar(7),
  "create_time" int8
);
CREATE INDEX "account" ON "public"."nfts" USING btree (
  "account" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);


-- 创建users信息表
CREATE TABLE users (
  id serial PRIMARY KEY,
  "address" varchar(64),
  "username" varchar(64),
  "avatar" varchar(128),
  "telegram" varchar(64),
  "wechat" varchar(64),
  "skype" varchar(64),
  "role" varchar[],
  "date" date DEFAULT (now()),
  "update" date DEFAULT (now())
)