CREATE OR REPLACE FUNCTION block_user(
    in_blocker_id integer,
    in_blocked_id integer
) RETURNS bool
    LANGUAGE plpgsql
    VOLATILE PARALLEL SAFE AS
$$
BEGIN
    -- Create blocked relation
    INSERT INTO public.block (blocker_id, blocked_id)
    VALUES (in_blocker_id, in_blocked_id);

    -- Check if the blocker is following the blocked user
    IF EXISTS (
        SELECT 1
        FROM public.following
        WHERE follower_profile_id = in_blocker_id
        AND following_profile_id = in_blocked_id
    ) THEN
        -- Call the unfollow_user function
        PERFORM unfollow_user(in_blocker_id, in_blocked_id);
    END IF;
    RETURN TRUE;
EXCEPTION
    WHEN others THEN
        RETURN FALSE; -- Return FALSE in case of any exception
END;
$$