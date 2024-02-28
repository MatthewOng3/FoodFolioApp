--Update
CREATE OR REPLACE FUNCTION increment_places_recommend_count(
    input_places_api_ids TEXT[]
) RETURNS BOOLEAN AS $$
DECLARE
    place_api_id INTEGER;
BEGIN
    -- Begin a transaction
    BEGIN

        -- Loop through the provided place_api_ids and increment each recommended count
        FOREACH place_api_id IN ARRAY input_places_api_ids LOOP
            UPDATE public.place SET place_recommended_count = place_recommended_count + 1
            WHERE api_place_id = place_api_id;
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
