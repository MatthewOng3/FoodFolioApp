CREATE OR REPLACE FUNCTION is_following_list(
    input_user_id uuid,
    input_list_id INTEGER
) RETURNS BOOLEAN
    LANGUAGE plpgsql
    VOLATILE PARALLEL SAFE AS
$$
DECLARE
    is_following BOOLEAN;
BEGIN
    SELECT count(*) > 0
    INTO is_following
    FROM public.following_list
        WHERE user_id = input_user_id AND list_id = input_list_id;
    RETURN is_following;
END;
$$