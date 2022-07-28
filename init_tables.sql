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
<<<<<<< Updated upstream
  "hash" varchar(64),
=======
  "hash" varchar(128),
>>>>>>> Stashed changes
  "title" varchar(255),
	"desc" varchar(64),
  "period" BIGINT,
  "budget" DECIMAL,
  "role" varchar[],
  "task_type" varchar[],
  "attachment" varchar(64),
	"apply_switch" int2 DEFAULT 1,
	"del" int2 NOT NULL DEFAULT 0,
  "create_time" date DEFAULT (now()),
  "update_time" date DEFAULT (now())
);

<<<<<<< Updated upstream
COMMENT ON COLUMN "public"."tasks"."apply_switch" IS '报名开关：0.关  1.开';
COMMENT ON COLUMN "public"."tasks"."del" IS '项目状态：0.不删  1.删除';
=======
COMMENT ON COLUMN "public"."tasks"."apply_switch" IS '报名开关: 0.关  1.开';
COMMENT ON COLUMN "public"."tasks"."del" IS '项目状态: 0.不删  1.删除';
>>>>>>> Stashed changes


CREATE INDEX "desc" ON "public"."tasks" USING btree (
  "desc" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);

CREATE INDEX "id" ON "public"."tasks" USING btree (
  "id" "pg_catalog"."int8_ops" ASC NULLS LAST
);

CREATE INDEX "issuer" ON "public"."tasks" USING btree (
  "issuer" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);


<<<<<<< Updated upstream
-- 创建订单表
CREATE TABLE orders (
	"id" BIGINT UNIQUE,
	"task_id" BIGINT,
  "worker" varchar(64),
  "hash" varchar(64),
  "amount" varchar(255),
	"checked" int2 NOT NULL DEFAULT 0,
	"del" int2 NOT NULL DEFAULT 1,
  "create_time" date DEFAULT now(),
  "update_time" date DEFAULT now()
);

COMMENT ON COLUMN "public"."orders"."checked" IS '订单确认过程： 默认 0.未有任何操作  1.乙方已设置阶段  2.甲方确认订单生效';

COMMENT ON COLUMN "public"."orders"."del" IS '项目状态：0.删除订单  默认 1.订单创建但未同步链  2.发布但未同步链上数据  3.修改但未同步链上数据';


-- 创建用户表
CREATE TABLE users (
 id serial PRIMARY KEY,
  "user_addr" varchar(64) UNIQUE,
  "create_time" date DEFAULT now(),
  "update_time" date DEFAULT now()
);


=======
>>>>>>> Stashed changes
-- 创建报名表
CREATE TABLE apply_info (
 id serial PRIMARY KEY,
  "apply_addr" varchar(64),
	"task_id" BIGINT, 
	"price" DECIMAL, 
  "create_time" date DEFAULT (now()),
  "update_time" date DEFAULT (now())
);


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

<<<<<<< Updated upstream
COMMENT ON COLUMN "public"."trans_hashes"."category" IS '交易hash种类：1.创建需求  2.修改需求  3.报名  4.修改报名  5.删除报名 6.创建订单以及修改订单';
COMMENT ON COLUMN "public"."trans_hashes"."is_update" IS '是否同步链上数据：0.未同步  1.已经同步';
=======
COMMENT ON COLUMN "public"."trans_hashes"."category" IS '交易hash种类: 1.创建需求  2.修改需求  3.报名  4.修改报名  5.删除报名 6.创建订单以及修改订单';
COMMENT ON COLUMN "public"."trans_hashes"."is_update" IS '是否同步链上数据: 0.未同步  1.已经同步';
>>>>>>> Stashed changes

