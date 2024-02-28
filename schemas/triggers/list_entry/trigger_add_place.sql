create or replace function trigger_add_place() returns trigger
    security definer
    language plpgsql
as
$$
begin
    insert into public.place (place_google_id) values (new.place_google_id) on conflict (place_google_id) do nothing;
    return new;
end;
$$;

alter function trigger_add_place() owner to postgres;

grant execute on function trigger_add_place() to anon;

grant execute on function trigger_add_place() to authenticated;

grant execute on function trigger_add_place() to service_role;

CREATE TRIGGER on_new_list_entry
    AFTER INSERT
    ON public.list_entry
    FOR EACH ROW
EXECUTE PROCEDURE trigger_add_place();