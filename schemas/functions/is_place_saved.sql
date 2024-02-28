CREATE OR REPLACE FUNCTION is_place_saved(
    input_api_place_id TEXT,
    input_profile_id INTEGER
) RETURNS BOOLEAN AS
$$
DECLARE
    is_saved    BOOLEAN;
    place_found TEXT;
BEGIN
    SELECT api_place_id
    INTO place_found
    FROM list_entry

    WHERE profile_id = input_profile_id
      AND api_place_id = input_api_place_id;

    IF place_found IS NOT NULL THEN
        is_saved := TRUE;
    ELSE
        is_saved := FALSE;
    END IF;

    RETURN is_saved;
END;
$$ LANGUAGE plpgsql;

 