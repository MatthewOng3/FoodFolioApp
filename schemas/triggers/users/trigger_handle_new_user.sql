

create or replace function trigger_handle_new_user() returns trigger
    security definer
    language plpgsql
as
$$

begin
    insert into public.profile (user_id, profile_username, profile_avatar, joined_on)
    values (new.id,
            coalesce(new.raw_user_meta_data->>'username'),
            'https://www.w3schools.com/w3images/avatar6.png',
            new.created_at);

    insert into public.list (profile_id, list_id, list_uuid, user_id, list_name)
    values
        (currval('public.profile_profile_id_seq'),DEFAULT,gen_random_uuid(), new.id,'Favourites');

    return new;
end;



$$;

alter function trigger_handle_new_user() owner to postgres;

grant execute on function trigger_handle_new_user() to anon;

grant execute on function trigger_handle_new_user() to authenticated;

grant execute on function trigger_handle_new_user() to service_role;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE PROCEDURE trigger_handle_new_user();