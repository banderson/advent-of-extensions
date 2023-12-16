
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

CREATE SCHEMA IF NOT EXISTS "bracket_audit";

ALTER SCHEMA "bracket_audit" OWNER TO "postgres";

CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";

ALTER SCHEMA "public" OWNER TO "postgres";

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

CREATE OR REPLACE FUNCTION "bracket_audit"."hs_contacts_if_modified_func"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'pg_catalog'
    AS $$
          DECLARE
            v_old_data TEXT;
            v_new_data TEXT;
          BEGIN

          if (session_user = 'bracket') then
            RETURN NULL;
          end if;

          /* This dance with casting the NEW and OLD values to a ROW is not necessary in pg 9.0+ */
          if (TG_OP = 'UPDATE') then
            v_old_data := ROW(OLD.*);
            v_new_data := ROW(NEW.*);
          insert into bracket_audit."hs_contacts_log" (
            user_name, action, p_key, original_data, new_data, query
          )
          values
            (
              session_user :: TEXT,
              TG_OP :: TEXT,
              OLD.bracket_pkey :: UUID,
              v_old_data,
              v_new_data,
              current_query()
            );
          RETURN NEW;

          elsif (TG_OP = 'DELETE') then
            v_old_data := ROW(OLD.*);
          insert into bracket_audit."hs_contacts_log" (
            user_name, action, p_key, original_data, query
          )
          values
            (
              session_user :: TEXT,
              TG_OP :: TEXT,
              OLD.bracket_pkey :: UUID,
              v_old_data,
              current_query()
            );
          RETURN OLD;

          elsif (TG_OP = 'INSERT') then
            v_new_data := ROW(NEW.*);
          insert into bracket_audit."hs_contacts_log" (
            user_name, action, p_key, new_data, query
          )
          values
            (
              session_user :: TEXT,
              TG_OP :: TEXT,
              NEW.bracket_pkey :: UUID,
              v_new_data,
              current_query()
            );
          RETURN NEW;

          else RAISE WARNING '[bracket_audit.hs_contacts_IF_MODIFIED_FUNC] - Other action occurred: %, at %', TG_OP, now();
          RETURN NULL;
          end if;

          EXCEPTION WHEN data_exception THEN RAISE WARNING '[bracket_audit.hs_contacts_IF_MODIFIED_FUNC] - UDF ERROR [DATAEXCEPTION] - SQLSTATE: %, SQLERRM: %',
          SQLSTATE,
          SQLERRM;
          RETURN NULL;

          WHEN unique_violation THEN RAISE WARNING '[bracket_audit.hs_contacts_IF_MODIFIED_FUNC] - UDF ERROR [UNIQUE] -SQLSTATE: %, SQLERRM: %',
          SQLSTATE,
          SQLERRM;
          RETURN NULL;

          WHEN others THEN RAISE WARNING '[bracket_audit.hs_contacts_IF_MODIFIED_FUNC] - UDF ERROR [OTHER] - SQLSTATE: %,SQLERRM: %',
          SQLSTATE,
          SQLERRM;
          RETURN NULL;

          END;
        $$;

ALTER FUNCTION "bracket_audit"."hs_contacts_if_modified_func"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."bracket_update_timestamp"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
      BEGIN
        NEW.bracket_last_modified = NOW();
        RETURN NEW;
      END;
      $$;

ALTER FUNCTION "public"."bracket_update_timestamp"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "bracket_audit"."hs_contacts_log" (
    "user_name" "text",
    "action_tstamp" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "status" "text" DEFAULT 'UNPROCESSED'::"text" NOT NULL,
    "action" "text" NOT NULL,
    "err" "text",
    "p_key" "uuid",
    "original_data" "text",
    "new_data" "text",
    "query" "text",
    CONSTRAINT "hs_contacts_log_action_check" CHECK (("action" = ANY (ARRAY['INSERT'::"text", 'UPDATE'::"text", 'DELETE'::"text"]))),
    CONSTRAINT "hs_contacts_log_status_check" CHECK (("status" = ANY (ARRAY['UNPROCESSED'::"text", 'PROCESSED'::"text", 'ERROR'::"text"])))
);

ALTER TABLE "bracket_audit"."hs_contacts_log" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."hs_contacts" (
    "bracket_pkey" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "bracket_last_modified" timestamp without time zone DEFAULT "now"(),
    "company_size" "text",
    "date_of_birth" "text",
    "days_to_close" double precision,
    "degree" "text",
    "duplicate" double precision,
    "field_of_study" "text",
    "first_conversion_date" timestamp without time zone,
    "first_conversion_event_name" "text",
    "first_deal_created_date" timestamp without time zone,
    "gender" "text",
    "graduation_date" "text",
    "hs_all_assigned_business_unit_ids" "text",
    "hs_analytics_first_touch_converting_campaign" "text",
    "hs_analytics_last_touch_converting_campaign" "text",
    "hs_buying_role" "text",
    "hs_content_membership_email" "text",
    "hs_content_membership_email_confirmed" boolean,
    "hs_content_membership_follow_up_enqueued_at" timestamp without time zone,
    "hs_content_membership_notes" "text",
    "hs_content_membership_registered_at" timestamp without time zone,
    "hs_content_membership_registration_domain_sent_to" "text",
    "hs_content_membership_registration_email_sent_at" timestamp without time zone,
    "hs_content_membership_status" "text",
    "hs_created_by_user_id" double precision,
    "hs_createdate" timestamp without time zone,
    "hs_email_bad_address" boolean,
    "hs_email_customer_quarantined_reason" "text",
    "hs_email_domain" "text",
    "hs_email_hard_bounce_reason_enum" "text",
    "hs_email_quarantined" boolean,
    "hs_email_quarantined_reason" "text",
    "hs_email_sends_since_last_engagement" double precision,
    "hs_emailconfirmationstatus" "text",
    "hs_facebook_click_id" "text",
    "hs_feedback_last_nps_follow_up" "text",
    "hs_feedback_last_nps_rating" "text",
    "hs_feedback_last_survey_date" timestamp without time zone,
    "hs_first_engagement_object_id" double precision,
    "hs_google_click_id" "text",
    "hs_ip_timezone" "text",
    "hs_is_unworked" boolean,
    "hs_last_sales_activity_timestamp" timestamp without time zone,
    "hs_latest_sequence_ended_date" timestamp without time zone,
    "hs_latest_sequence_enrolled" double precision,
    "hs_latest_sequence_enrolled_date" timestamp without time zone,
    "hs_latest_source_timestamp" timestamp without time zone,
    "hs_lead_status" "text",
    "hs_legal_basis" "text",
    "hs_marketable_reason_id" "text",
    "hs_marketable_reason_type" "text",
    "hs_marketable_status" "text",
    "hs_marketable_until_renewal" "text",
    "hs_merged_object_ids" "text",
    "hs_object_id" double precision,
    "hs_predictivecontactscore_v_2" double precision,
    "hs_predictivescoringtier" "text",
    "hs_sa_first_engagement_date" timestamp without time zone,
    "hs_sa_first_engagement_descr" "text",
    "hs_sa_first_engagement_object_type" "text",
    "hs_sales_email_last_clicked" timestamp without time zone,
    "hs_sales_email_last_opened" timestamp without time zone,
    "hs_sequences_enrolled_count" double precision,
    "hs_sequences_is_enrolled" boolean,
    "hs_time_between_contact_creation_and_deal_close" double precision,
    "hs_time_between_contact_creation_and_deal_creation" double precision,
    "hs_time_to_first_engagement" double precision,
    "hs_time_to_move_from_lead_to_customer" double precision,
    "hs_time_to_move_from_marketingqualifiedlead_to_customer" double precision,
    "hs_time_to_move_from_opportunity_to_customer" double precision,
    "hs_time_to_move_from_salesqualifiedlead_to_customer" double precision,
    "hs_time_to_move_from_subscriber_to_customer" double precision,
    "hs_timezone" "text",
    "hs_v_2_cumulative_time_in_customer" double precision,
    "hs_v_2_cumulative_time_in_evangelist" double precision,
    "hs_v_2_cumulative_time_in_lead" double precision,
    "hs_v_2_cumulative_time_in_marketingqualifiedlead" double precision,
    "hs_v_2_cumulative_time_in_opportunity" double precision,
    "hs_v_2_cumulative_time_in_other" double precision,
    "hs_v_2_cumulative_time_in_salesqualifiedlead" double precision,
    "hs_v_2_cumulative_time_in_subscriber" double precision,
    "hs_v_2_date_entered_customer" timestamp without time zone,
    "hs_v_2_date_entered_evangelist" timestamp without time zone,
    "hs_v_2_date_entered_lead" timestamp without time zone,
    "hs_v_2_date_entered_marketingqualifiedlead" timestamp without time zone,
    "hs_v_2_date_entered_opportunity" timestamp without time zone,
    "hs_v_2_date_entered_other" timestamp without time zone,
    "hs_v_2_date_entered_salesqualifiedlead" timestamp without time zone,
    "hs_v_2_date_entered_subscriber" timestamp without time zone,
    "hs_v_2_date_exited_customer" timestamp without time zone,
    "hs_v_2_date_exited_evangelist" timestamp without time zone,
    "hs_v_2_date_exited_lead" timestamp without time zone,
    "hs_v_2_date_exited_marketingqualifiedlead" timestamp without time zone,
    "hs_v_2_date_exited_opportunity" timestamp without time zone,
    "hs_v_2_date_exited_other" timestamp without time zone,
    "hs_v_2_date_exited_salesqualifiedlead" timestamp without time zone,
    "hs_v_2_date_exited_subscriber" timestamp without time zone,
    "hs_v_2_latest_time_in_customer" double precision,
    "hs_v_2_latest_time_in_evangelist" double precision,
    "hs_v_2_latest_time_in_lead" double precision,
    "hs_v_2_latest_time_in_marketingqualifiedlead" double precision,
    "hs_v_2_latest_time_in_opportunity" double precision,
    "hs_v_2_latest_time_in_other" double precision,
    "hs_v_2_latest_time_in_salesqualifiedlead" double precision,
    "hs_v_2_latest_time_in_subscriber" double precision,
    "hs_whatsapp_phone_number" "text",
    "hubspot_owner_assigneddate" timestamp without time zone,
    "ip_city" "text",
    "ip_country" "text",
    "ip_country_code" "text",
    "ip_state" "text",
    "ip_state_code" "text",
    "job_function" "text",
    "lastmodifieddate" timestamp without time zone,
    "marital_status" "text",
    "military_status" "text",
    "num_associated_deals" double precision,
    "num_conversion_events" double precision,
    "num_unique_conversion_events" double precision,
    "recent_conversion_date" timestamp without time zone,
    "recent_conversion_event_name" "text",
    "recent_deal_amount" double precision,
    "recent_deal_close_date" timestamp without time zone,
    "relationship_status" "text",
    "school" "text",
    "seniority" "text",
    "start_date" "text",
    "total_revenue" double precision,
    "work_email" "text",
    "firstname" "text",
    "hs_analytics_first_url" "text",
    "hs_email_delivered" double precision,
    "hs_email_optout_22891907" "text",
    "hs_email_optout_77967464" "text",
    "twitterhandle" "text",
    "currentlyinworkflow" "text",
    "followercount" double precision,
    "hs_analytics_last_url" "text",
    "hs_email_open" double precision,
    "lastname" "text",
    "hs_analytics_num_page_views" double precision,
    "hs_email_click" double precision,
    "salutation" "text",
    "twitterprofilephoto" "text",
    "email" "text",
    "hs_analytics_num_visits" double precision,
    "hs_email_bounce" double precision,
    "hs_persona" "text",
    "hs_social_last_engagement" timestamp without time zone,
    "hs_analytics_num_event_completions" double precision,
    "hs_email_optout" boolean,
    "hs_social_twitter_clicks" double precision,
    "mobilephone" "text",
    "phone" "text",
    "fax" "text",
    "hs_analytics_first_timestamp" timestamp without time zone,
    "hs_email_last_email_name" "text",
    "hs_email_last_send_date" timestamp without time zone,
    "hs_social_facebook_clicks" double precision,
    "address" "text",
    "engagements_last_meeting_booked" timestamp without time zone,
    "engagements_last_meeting_booked_campaign" "text",
    "engagements_last_meeting_booked_medium" "text",
    "engagements_last_meeting_booked_source" "text",
    "hs_analytics_first_visit_timestamp" timestamp without time zone,
    "hs_email_last_open_date" timestamp without time zone,
    "hs_sales_email_last_replied" timestamp without time zone,
    "hs_social_linkedin_clicks" double precision,
    "hubspot_owner_id" "text",
    "notes_last_contacted" timestamp without time zone,
    "notes_last_updated" timestamp without time zone,
    "notes_next_activity_date" timestamp without time zone,
    "num_contacted_notes" double precision,
    "num_notes" double precision,
    "owneremail" "text",
    "ownername" "text",
    "city" "text",
    "hs_analytics_last_timestamp" timestamp without time zone,
    "hs_email_last_click_date" timestamp without time zone,
    "hs_social_google_plus_clicks" double precision,
    "hubspot_team_id" "text",
    "linkedinbio" "text",
    "twitterbio" "text",
    "hs_analytics_last_visit_timestamp" timestamp without time zone,
    "hs_email_first_send_date" timestamp without time zone,
    "hs_social_num_broadcast_clicks" double precision,
    "state" "text",
    "hs_analytics_source" "text",
    "hs_email_first_open_date" timestamp without time zone,
    "hs_latest_source" "text",
    "zip" "text",
    "country" "text",
    "hs_analytics_source_data_1" "text",
    "hs_email_first_click_date" timestamp without time zone,
    "hs_latest_source_data_1" "text",
    "linkedinconnections" double precision,
    "hs_analytics_source_data_2" "text",
    "hs_language" "text",
    "hs_latest_source_data_2" "text",
    "kloutscoregeneral" double precision,
    "hs_analytics_first_referrer" "text",
    "hs_email_first_reply_date" timestamp without time zone,
    "jobtitle" "text",
    "hs_analytics_last_referrer" "text",
    "hs_email_last_reply_date" timestamp without time zone,
    "message" "text",
    "closedate" timestamp without time zone,
    "hs_analytics_average_page_views" double precision,
    "hs_email_replied" double precision,
    "hs_analytics_revenue" double precision,
    "hs_lifecyclestage_lead_date" timestamp without time zone,
    "hs_lifecyclestage_marketingqualifiedlead_date" timestamp without time zone,
    "hs_lifecyclestage_opportunity_date" timestamp without time zone,
    "lifecyclestage" "text",
    "hs_lifecyclestage_salesqualifiedlead_date" timestamp without time zone,
    "createdate" timestamp without time zone,
    "hs_lifecyclestage_evangelist_date" timestamp without time zone,
    "hs_lifecyclestage_customer_date" timestamp without time zone,
    "hubspotscore" double precision,
    "company" "text",
    "hs_lifecyclestage_subscriber_date" timestamp without time zone,
    "hs_lifecyclestage_other_date" timestamp without time zone,
    "website" "text",
    "numemployees" "text",
    "annualrevenue" "text",
    "industry" "text",
    "hs_predictivecontactscorebucket" "text",
    "hs_predictivecontactscore" double precision
);

ALTER TABLE "public"."hs_contacts" OWNER TO "postgres";

ALTER TABLE ONLY "public"."hs_contacts"
    ADD CONSTRAINT "hs_contacts_pkey" PRIMARY KEY ("bracket_pkey");

CREATE OR REPLACE TRIGGER "hs_contacts_if_modified_trg" AFTER INSERT OR DELETE OR UPDATE ON "public"."hs_contacts" FOR EACH ROW EXECUTE FUNCTION "bracket_audit"."hs_contacts_if_modified_func"();

CREATE OR REPLACE TRIGGER "update_bracket_last_modified_for_hs_contacts" BEFORE UPDATE ON "public"."hs_contacts" FOR EACH ROW EXECUTE FUNCTION "public"."bracket_update_timestamp"();

REVOKE USAGE ON SCHEMA "public" FROM PUBLIC;
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON FUNCTION "public"."bracket_update_timestamp"() TO "anon";
GRANT ALL ON FUNCTION "public"."bracket_update_timestamp"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."bracket_update_timestamp"() TO "service_role";

GRANT ALL ON TABLE "public"."hs_contacts" TO "anon";
GRANT ALL ON TABLE "public"."hs_contacts" TO "authenticated";
GRANT ALL ON TABLE "public"."hs_contacts" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";

RESET ALL;
