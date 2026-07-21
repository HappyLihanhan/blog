CREATE TABLE `ai_grade_usage` (
	`id` text PRIMARY KEY NOT NULL,
	`actor_key` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `ai_grade_usage_actor_idx` ON `ai_grade_usage` (`actor_key`,`created_at`);