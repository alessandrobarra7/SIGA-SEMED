CREATE TABLE `semed_domain_sessions` (
	`id` varchar(64) NOT NULL,
	`user_id` varchar(64) NOT NULL,
	`token_hash` varchar(128) NOT NULL,
	`expires_at` timestamp NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`last_activity_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `semed_domain_sessions_id` PRIMARY KEY(`id`),
	CONSTRAINT `semed_domain_sessions_token_hash_uq` UNIQUE(`token_hash`)
);
--> statement-breakpoint
CREATE TABLE `semed_domain_user_permissions` (
	`id` varchar(64) NOT NULL,
	`user_id` varchar(64) NOT NULL,
	`module_key` varchar(96) NOT NULL,
	`granted` boolean NOT NULL DEFAULT false,
	`granted_by` varchar(64) NOT NULL,
	`granted_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `semed_domain_user_permissions_id` PRIMARY KEY(`id`),
	CONSTRAINT `semed_domain_permissions_user_module_uq` UNIQUE(`user_id`,`module_key`)
);
--> statement-breakpoint
CREATE TABLE `semed_domain_users` (
	`id` varchar(64) NOT NULL,
	`username` varchar(96) NOT NULL,
	`registration` varchar(32) NOT NULL,
	`display_name` varchar(255) NOT NULL,
	`profile` varchar(96) NOT NULL,
	`login_type` enum('matricula','cpf') NOT NULL DEFAULT 'matricula',
	`cpf` varchar(32) NOT NULL,
	`school_unit_id` varchar(64) NOT NULL,
	`server_registration_id` varchar(64) NOT NULL,
	`password_hash` varchar(512) NOT NULL,
	`password_salt` varchar(256) NOT NULL,
	`password_iterations` int NOT NULL DEFAULT 210000,
	`must_change_password` boolean NOT NULL DEFAULT true,
	`active` boolean NOT NULL DEFAULT true,
	`last_login_at` timestamp,
	`last_activity_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `semed_domain_users_id` PRIMARY KEY(`id`),
	CONSTRAINT `semed_domain_users_username_uq` UNIQUE(`username`),
	CONSTRAINT `semed_domain_users_registration_uq` UNIQUE(`registration`),
	CONSTRAINT `semed_domain_users_cpf_uq` UNIQUE(`cpf`)
);
--> statement-breakpoint
CREATE INDEX `semed_domain_sessions_user_idx` ON `semed_domain_sessions` (`user_id`);--> statement-breakpoint
CREATE INDEX `semed_domain_permissions_user_idx` ON `semed_domain_user_permissions` (`user_id`);