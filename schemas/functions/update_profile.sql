--Update profile info
CREATE OR REPLACE FUNCTION update_profile(
    input_profile_id INTEGER,
    new_profile_name TEXT,
    new_profile_bio TEXT,
    new_taste_pref_ids Integer[],
    del_taste_pref_ids  Integer []
) RETURNS BOOLEAN AS $$
DECLARE
    new_taste_id INTEGER;
    del_taste_id INTEGER;
BEGIN
    -- Begin a transaction
    BEGIN
        -- Update profile bio and username
        UPDATE public.profile
        SET profile_username = new_profile_name,
            profile_bio = new_profile_bio
        WHERE profile_id = input_profile_id;
        
        -- Loop through the new_taste_pref_ids and insert new rows into junction table
        FOREACH new_taste_id IN ARRAY new_taste_pref_ids LOOP
            INSERT INTO public.user_taste_pref (profile_id, taste_id)
            VALUES (input_profile_id, new_taste_id);
        END LOOP;

        --Delete all relations where taste_id is in the input del taste pref ids
        FOREACH del_taste_id  IN ARRAY del_taste_pref_ids  LOOP
            DELETE FROM user_taste_pref
            WHERE taste_id = del_taste_id and
            profile_id = input_profile_id;
        END LOOP;
        
        -- If we reached here without exceptions, commit the transaction
        RETURN TRUE;
    EXCEPTION
        -- If an exception occurred during the transaction, rollback and return FALSE
        WHEN others THEN
            RETURN FALSE;
    END;
END;
$$ LANGUAGE plpgsql;
