create or replace function trigger_create_default_tags() returns trigger
    security definer
    language plpgsql
as
$$

begin
    insert into public.list (profile_id, list_id, list_uuid, user_id, list_name)
    values
        (currval('public.profile_profile_id_seq'),DEFAULT,gen_random_uuid(), new.id,'Favourites');
    return new;
end;
$$;

alter function trigger_create_default_tags() owner to postgres;

grant execute on function trigger_create_default_tags() to anon;

grant execute on function trigger_create_default_tags() to authenticated;

grant execute on function trigger_create_default_tags() to service_role;

CREATE TRIGGER set_default_tags AFTER INSERT ON auth.users FOR EACH ROW EXECUTE PROCEDURE trigger_create_default_tags();