CREATE TABLE `evaluations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`interview_id` integer NOT NULL,
	`user_id` integer NOT NULL,
	`communication_score` integer NOT NULL,
	`confidence_score` integer NOT NULL,
	`technical_accuracy_score` integer NOT NULL,
	`resume_alignment_score` integer NOT NULL,
	`personality_fit_score` integer NOT NULL,
	`overall_score` integer NOT NULL,
	`strengths` text,
	`weaknesses` text,
	`improvement_suggestions` text,
	`role_fit_recommendation` text,
	`evaluation_data` text,
	`created_at` text NOT NULL,
	FOREIGN KEY (`interview_id`) REFERENCES `interviews`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `interviews` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`resume_id` integer,
	`role` text NOT NULL,
	`time_per_question` integer NOT NULL,
	`total_duration` integer NOT NULL,
	`actual_duration` integer,
	`status` text DEFAULT 'in_progress' NOT NULL,
	`started_at` text NOT NULL,
	`completed_at` text,
	`created_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`resume_id`) REFERENCES `resumes`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `questions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`interview_id` integer NOT NULL,
	`question_text` text NOT NULL,
	`question_number` integer NOT NULL,
	`answer_text` text,
	`answer_video_url` text,
	`time_taken` integer,
	`asked_at` text NOT NULL,
	`answered_at` text,
	FOREIGN KEY (`interview_id`) REFERENCES `interviews`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `resumes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`file_url` text NOT NULL,
	`file_name` text NOT NULL,
	`parsed_data` text,
	`suggested_roles` text,
	`uploaded_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`full_name` text NOT NULL,
	`role` text DEFAULT 'user' NOT NULL,
	`avatar_url` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);