--Update
CREATE OR REPLACE FUNCTION update_list(
    del_list_entry_ids INT[],
    input_list_id INTEGER,
    new_list_name TEXT,
    new_list_description TEXT
) RETURNS BOOLEAN AS $$
DECLARE
    del_list_entry_id INTEGER;
BEGIN
    -- Begin a transaction
    BEGIN
        -- Update list name and description 
        UPDATE list
        SET list_name = new_list_name,
            list_description = new_list_description,
            updated_at = CURRENT_TIMESTAMP
        WHERE list_id = input_list_id;

        -- Loop through the provided list_entry_ids and remove each entry
        FOREACH del_list_entry_id IN ARRAY del_list_entry_ids LOOP
            DELETE FROM list_entry
            WHERE list_entry_id = del_list_entry_id;
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
