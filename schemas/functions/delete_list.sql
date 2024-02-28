CREATE OR REPLACE FUNCTION delete_list(
  del_list_id integer
) RETURNS void AS $$
begin
  DELETE FROM list where list_id  = del_list_id;
end;
$$ LANGUAGE plpgsql;

 