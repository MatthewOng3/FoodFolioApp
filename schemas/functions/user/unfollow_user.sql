CREATE OR REPLACE FUNCTION unfollow_user(
    input_follower_profile_id integer, --User that is doing the unfollowing
    input_unfollowing_profile_id integer --User that is being unfollowed
) RETURNS bool
    LANGUAGE plpgsql
    VOLATILE PARALLEL SAFE AS
$$
BEGIN
    DELETE FROM public.following
    WHERE follower_profile_id = input_follower_profile_id AND following_profile_id = input_unfollowing_profile_id;
    
    RETURN TRUE;
END;
$$
