CREATE OR REPLACE FUNCTION follow_user(
    follower_profile_id integer,
    following_profile_id integer
) RETURNS bool
    LANGUAGE plpgsql
    VOLATILE PARALLEL SAFE AS
$$
BEGIN
    INSERT INTO public.following ( follower_profile_id, following_profile_id)
    VALUES (follower_profile_id, following_profile_id);
    RETURN TRUE;
END;
$$