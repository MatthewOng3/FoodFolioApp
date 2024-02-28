CREATE OR REPLACE FUNCTION delete_place_from_lists(
  del_list_ids integer[],
  del_api_place_id text
) RETURNS void AS $$
DECLARE
  list_id_val INTEGER;
BEGIN
  FOREACH list_id_val IN ARRAY del_list_ids
  LOOP
    DELETE FROM list_entry
    WHERE list_id = list_id_val
    AND api_place_id = del_api_place_id;
  END LOOP;
END;
$$ LANGUAGE plpgsql;
