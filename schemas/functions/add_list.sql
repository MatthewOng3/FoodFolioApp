--Function to add a list to list table for user
--Add list function
CREATE OR REPLACE FUNCTION add_list(
  input_profile_id INTEGER,
  input_list_name TEXT,
  input_list_description TEXT,
  input_list_is_public BOOLEAN
) returns jsonb
AS $$
DECLARE
  new_list_id INTEGER;
  new_list_uuid UUID;
BEGIN
  -- Insert the new row with the generated UUID
  INSERT INTO list (list_uuid, profile_id, list_name, list_description, updated_at, list_is_public)
  VALUES (uuid_generate_v4(), input_profile_id, input_list_name, input_list_description, NOW(), input_list_is_public)
  RETURNING list_id, list_uuid INTO new_list_id, new_list_uuid;

  -- Return the generated list_id
  RETURN jsonb_build_object('listId', new_list_id, 'listShareId', new_list_uuid);
END;
$$ LANGUAGE plpgsql;
