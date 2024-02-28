--Delete a single place from list page
CREATE OR REPLACE FUNCTION delete_place(
  del_list_entry_id integer
) RETURNS void AS $$
begin
  DELETE FROM list_entry where list_entry_id = del_list_entry_id;
end;
$$ LANGUAGE plpgsql;

 