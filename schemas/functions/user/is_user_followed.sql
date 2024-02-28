CREATE OR REPLACE FUNCTION is_user_followed(
    input_follower_profile_id integer,
    input_following_profile_id integer
) RETURNS BOOLEAN AS
$$
DECLARE
    is_followed BOOLEAN;
BEGIN
    SELECT TRUE
    INTO is_followed
    FROM public.following
    WHERE 
        follower_profile_id = input_follower_profile_id 
        AND following_profile_id = input_following_profile_id;
    
    RETURN COALESCE(is_followed, FALSE);
END;
$$ LANGUAGE plpgsql;
