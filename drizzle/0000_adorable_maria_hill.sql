CREATE TABLE `semed_agenda_events` (
	`id` varchar(64) NOT NULL,
	`user_id` varchar(64) NOT NULL,
	`type` varchar(96) NOT NULL,
	`title` varchar(255) NOT NULL,
	`event_date` varchar(10) NOT NULL,
	`start_time` varchar(8) NOT NULL,
	`priority` enum('Baixa','Média','Alta') NOT NULL DEFAULT 'Média',
	`reminder_days` int NOT NULL DEFAULT 0,
	`notes` text NOT NULL,
	`status` enum('Agendado','Concluído','Cancelado') NOT NULL DEFAULT 'Agendado',
	`completed_at` varchar(40) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `semed_agenda_events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `semed_master_records` (
	`id` varchar(64) NOT NULL,
	`record_type` varchar(96) NOT NULL,
	`code` varchar(96) NOT NULL,
	`name` varchar(255) NOT NULL,
	`document` varchar(96) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(64) NOT NULL,
	`department` varchar(160) NOT NULL,
	`position` varchar(160) NOT NULL,
	`address` text NOT NULL,
	`notes` text NOT NULL,
	`status` enum('Ativo','Inativo') NOT NULL DEFAULT 'Ativo',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `semed_master_records_id` PRIMARY KEY(`id`),
	CONSTRAINT `semed_master_records_code_uq` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `semed_user_message_reads` (
	`id` varchar(64) NOT NULL,
	`message_id` varchar(64) NOT NULL,
	`user_id` varchar(64) NOT NULL,
	`read_at` varchar(40) NOT NULL,
	CONSTRAINT `semed_user_message_reads_id` PRIMARY KEY(`id`),
	CONSTRAINT `semed_message_reads_message_user_uq` UNIQUE(`message_id`,`user_id`)
);
--> statement-breakpoint
CREATE TABLE `semed_user_messages` (
	`id` varchar(64) NOT NULL,
	`sender_user_id` varchar(64) NOT NULL,
	`sender_name` varchar(255) NOT NULL,
	`recipient_user_id` varchar(64) NOT NULL,
	`subject` varchar(255) NOT NULL,
	`message` text NOT NULL,
	`priority` enum('Baixa','Média','Alta') NOT NULL DEFAULT 'Média',
	`expires_at` varchar(40) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `semed_user_messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `semed_user_notes` (
	`id` varchar(64) NOT NULL,
	`user_id` varchar(64) NOT NULL,
	`content` text NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `semed_user_notes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `semed_agenda_events_user_date_idx` ON `semed_agenda_events` (`user_id`,`event_date`);--> statement-breakpoint
CREATE INDEX `semed_master_records_type_idx` ON `semed_master_records` (`record_type`);--> statement-breakpoint
CREATE INDEX `semed_user_messages_recipient_idx` ON `semed_user_messages` (`recipient_user_id`);--> statement-breakpoint
CREATE INDEX `semed_user_messages_sender_idx` ON `semed_user_messages` (`sender_user_id`);--> statement-breakpoint
CREATE INDEX `semed_user_notes_user_idx` ON `semed_user_notes` (`user_id`);
