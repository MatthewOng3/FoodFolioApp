--Save place to lists
CREATE OR REPLACE FUNCTION save_place(
    profile_id integer,
    list_ids integer[], 
    api_place_id text, 
    list_entry_description text,
    entry_type integer
) RETURNS VOID AS $$

BEGIN
    FOR i IN 1..array_length(list_ids, 1) LOOP
        INSERT INTO list_entry (list_id, api_place_id, list_entry_description, added_at, entry_type, profile_id)
        VALUES (list_ids[i], api_place_id, list_entry_description, NOW(), entry_type, profile_id);
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- CREATE OR REPLACE FUNCTION save_place(
--     profile_id INTEGER,
--     list_ids INTEGER[], 
--     place_google_id TEXT, 
--     list_entry_description TEXT,
--     entry_type INTEGER
-- ) RETURNS INTEGER[] AS $$
-- DECLARE
--     new_list_entry_ids INTEGER[];
--     new_entry_id INTEGER;
-- BEGIN
--     -- Initialize the new_list_entry_ids array
--     new_list_entry_ids := ARRAY[]::INTEGER[];
    
--     FOR i IN 1..array_length(list_ids, 1) LOOP
--         INSERT INTO list_entry (list_id, place_google_id, list_entry_description, added_at, entry_type, profile_id)
--         VALUES (list_ids[i], place_google_id, list_entry_description, NOW(), entry_type, profile_id)
--         RETURNING list_entry_id INTO new_entry_id;

--         -- Append the newly inserted list_entry_id to the array
--         new_list_entry_ids := array_append(new_list_entry_ids, new_entry_id);
--     END LOOP;

--     -- Return the array of newly inserted list_entry_ids
--     RETURN new_list_entry_ids;
-- END;
-- $$ LANGUAGE plpgsql;
