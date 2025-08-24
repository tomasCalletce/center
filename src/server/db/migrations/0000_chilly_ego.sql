CREATE TYPE "public"."document_type" AS ENUM('CV');--> statement-breakpoint
CREATE TYPE "public"."challenge_price_pool_currency" AS ENUM('USD');--> statement-breakpoint
CREATE TYPE "public"."challenge_visibility" AS ENUM('VISIBLE', 'HIDDEN');--> statement-breakpoint
CREATE TYPE "public"."submission_visibility" AS ENUM('VISIBLE', 'HIDDEN');--> statement-breakpoint
CREATE TYPE "public"."team_member_role" AS ENUM('ADMIN', 'MEMBER');--> statement-breakpoint
CREATE TYPE "public"."team_invitation_status" AS ENUM('PENDING', 'ACCEPTED', 'DECLINED', 'EXPIRED');--> statement-breakpoint
CREATE TYPE "public"."challenge_participation_status" AS ENUM('REGISTERED', 'ACTIVE', 'WITHDRAWN');--> statement-breakpoint
CREATE TABLE "pdf_assets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"_user" varchar(32) NOT NULL,
	"_asset" uuid,
	"type" "document_type" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "challenges" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"_clerk" varchar(32) NOT NULL,
	"_image" uuid NOT NULL,
	"title" varchar NOT NULL,
	"slug" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"markdown" text NOT NULL,
	"price_pool" integer NOT NULL,
	"price_pool_currency" "challenge_price_pool_currency" NOT NULL,
	"visibility" "challenge_visibility" NOT NULL,
	"deadline" timestamp NOT NULL,
	"open_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "challenges_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "assets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"_user" varchar(32) NOT NULL,
	"pathname" varchar(255) NOT NULL,
	"url" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "assets_images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"_user" varchar(32) NOT NULL,
	"_asset" uuid,
	"alt" varchar(500) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "submissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"_team" uuid NOT NULL,
	"_challenge" uuid,
	"_logo_image" uuid,
	"title" varchar(255) NOT NULL,
	"markdown" text,
	"demo_url" text NOT NULL,
	"video_demo_url" text NOT NULL,
	"repository_url" text NOT NULL,
	"status" "submission_visibility" NOT NULL,
	"submitted_by" varchar(32) DEFAULT 'unknown' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "teams" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"_clerk" varchar(32) NOT NULL,
	"name" varchar(255) NOT NULL,
	"max_members" integer DEFAULT 5 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "team_members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"_team" uuid NOT NULL,
	"_clerk" varchar(32) NOT NULL,
	"role" "team_member_role" DEFAULT 'MEMBER' NOT NULL,
	"joined_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "team_invitations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"_team" uuid NOT NULL,
	"_inviter" varchar(32) NOT NULL,
	"_invitee" varchar(32) NOT NULL,
	"status" "team_invitation_status" DEFAULT 'PENDING' NOT NULL,
	"expires_at" timestamp NOT NULL,
	"responded_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "challenge_participants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"_challenge" uuid NOT NULL,
	"_team" uuid NOT NULL,
	"status" "challenge_participation_status" DEFAULT 'REGISTERED' NOT NULL,
	"registered_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"_clerk" varchar(32) NOT NULL,
	"display_name" varchar(255),
	"location" varchar(255),
	"current_title" varchar(255),
	"experience" jsonb DEFAULT '[]'::jsonb,
	"education" jsonb DEFAULT '[]'::jsonb,
	"skills" jsonb DEFAULT '[]'::jsonb,
	"social_links" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users__clerk_unique" UNIQUE("_clerk")
);
--> statement-breakpoint
CREATE TABLE "pdf_page_images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"_pdf_assets" uuid,
	"_image_asset" uuid,
	"page_number" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "assets_markdown" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"_user" varchar(32) NOT NULL,
	"_asset" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pdf_markdowns" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"_pdf_asset" uuid,
	"_markdown_asset" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "participation_intents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"_clerk" varchar(32) NOT NULL,
	"_challenge" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "pdf_assets" ADD CONSTRAINT "pdf_assets__asset_assets_id_fk" FOREIGN KEY ("_asset") REFERENCES "public"."assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "challenges" ADD CONSTRAINT "challenges__image_assets_images_id_fk" FOREIGN KEY ("_image") REFERENCES "public"."assets_images"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assets_images" ADD CONSTRAINT "assets_images__asset_assets_id_fk" FOREIGN KEY ("_asset") REFERENCES "public"."assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submissions" ADD CONSTRAINT "submissions__team_teams_id_fk" FOREIGN KEY ("_team") REFERENCES "public"."teams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submissions" ADD CONSTRAINT "submissions__challenge_challenges_id_fk" FOREIGN KEY ("_challenge") REFERENCES "public"."challenges"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submissions" ADD CONSTRAINT "submissions__logo_image_assets_images_id_fk" FOREIGN KEY ("_logo_image") REFERENCES "public"."assets_images"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_members" ADD CONSTRAINT "team_members__team_teams_id_fk" FOREIGN KEY ("_team") REFERENCES "public"."teams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_invitations" ADD CONSTRAINT "team_invitations__team_teams_id_fk" FOREIGN KEY ("_team") REFERENCES "public"."teams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "challenge_participants" ADD CONSTRAINT "challenge_participants__challenge_challenges_id_fk" FOREIGN KEY ("_challenge") REFERENCES "public"."challenges"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "challenge_participants" ADD CONSTRAINT "challenge_participants__team_teams_id_fk" FOREIGN KEY ("_team") REFERENCES "public"."teams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pdf_page_images" ADD CONSTRAINT "pdf_page_images__pdf_assets_pdf_assets_id_fk" FOREIGN KEY ("_pdf_assets") REFERENCES "public"."pdf_assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pdf_page_images" ADD CONSTRAINT "pdf_page_images__image_asset_assets_images_id_fk" FOREIGN KEY ("_image_asset") REFERENCES "public"."assets_images"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assets_markdown" ADD CONSTRAINT "assets_markdown__asset_assets_id_fk" FOREIGN KEY ("_asset") REFERENCES "public"."assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pdf_markdowns" ADD CONSTRAINT "pdf_markdowns__pdf_asset_pdf_assets_id_fk" FOREIGN KEY ("_pdf_asset") REFERENCES "public"."pdf_assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pdf_markdowns" ADD CONSTRAINT "pdf_markdowns__markdown_asset_assets_markdown_id_fk" FOREIGN KEY ("_markdown_asset") REFERENCES "public"."assets_markdown"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "participation_intents" ADD CONSTRAINT "participation_intents__challenge_challenges_id_fk" FOREIGN KEY ("_challenge") REFERENCES "public"."challenges"("id") ON DELETE no action ON UPDATE no action;