CREATE OR REPLACE FUNCTION follow_list(
    input_user_id uuid,
    input_list_id INTEGER
) RETURNS bool
    LANGUAGE plpgsql
    VOLATILE PARALLEL SAFE AS
$$
BEGIN
    INSERT INTO public.following_list (user_id, list_id)
    VALUES (input_user_id, input_list_id);
    RETURN TRUE;
END;
$$