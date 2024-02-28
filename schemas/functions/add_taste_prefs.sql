--Function to insert user taste prefs relations during onboarding
CREATE OR REPLACE FUNCTION add_taste_prefs(
  input_profile_id INTEGER,
  taste_ids INTEGER[]
) RETURNS VOID AS $$
DECLARE
    curr_taste_id INTEGER;
BEGIN
    
    FOREACH curr_taste_id IN ARRAY taste_ids LOOP
        INSERT INTO user_taste_pref (profile_id, taste_id)
        VALUES (input_profile_id, curr_taste_id);
    END LOOP;

    UPDATE public.profile SET completed_onboarding = TRUE WHERE profile_id = input_profile_id;

END;
$$ LANGUAGE plpgsql;
