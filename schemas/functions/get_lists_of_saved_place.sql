--Get all lists that the place is saved in
CREATE OR REPLACE FUNCTION get_lists_with_saved_place(
  input_api_place_id TEXT,
  input_profile_id INTEGER  
) RETURNS JSONB AS $$
DECLARE
  lists JSONB;
BEGIN
  SELECT jsonb_agg(l.list_id)
  INTO lists
  FROM list_entry le
  JOIN public.list l ON le.list_id = l.list_id
  WHERE le.api_place_id = input_api_place_id
  AND l.profile_id = input_profile_id;

  RETURN lists;
END;
$$ LANGUAGE plpgsql;