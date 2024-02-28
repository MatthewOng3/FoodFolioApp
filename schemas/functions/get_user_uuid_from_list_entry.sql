CREATE FUNCTION get_user_uuid_from_list_entry(list_entry_id INTEGER) RETURNS UUID AS $$
DECLARE
    user_uuid_result UUID;
BEGIN
    SELECT user_uuid
    INTO user_uuid_result
    FROM public.profile
    WHERE public.profile.user_id = (
        SELECT user_id
        FROM public.list
        WHERE public.list.list_id = list_entry_id.list_id
    );

    RETURN user_uuid_result;
END;
$$ LANGUAGE plpgsql;