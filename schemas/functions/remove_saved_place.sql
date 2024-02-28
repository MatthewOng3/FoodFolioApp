--Delete place from the input lists
CREATE OR REPLACE FUNCTION delete_place_from_lists(
  del_list_ids integer[],
  del_place_google_id TEXT
) RETURNS VOID AS $$
DECLARE
  list_id_val INTEGER;
BEGIN
  FOREACH list_id_val IN ARRAY del_list_ids
  LOOP
    DELETE FROM list_entry
    WHERE list_id = list_id_val
    AND place_google_id = del_place_google_id;
  END LOOP;
END;
$$ LANGUAGE plpgsql;