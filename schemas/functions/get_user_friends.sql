CREATE
    OR REPLACE FUNCTION get_user_friends(input_profile_id integer)
    returns jsonb
    LANGUAGE plpgsql
    STABLE PARALLEL SAFE
AS
$$

BEGIN
    RETURN (
        SELECT jsonb_agg(jsonb_build_object(
            'profileId', p.profile_id,
            'username', p.profile_username,
            'avatar', p.profile_avatar,
            'bio', p.profile_bio
            -- 'listPlacesCount', COALESCE(le.place_count, 0) -- Count number of friends
        ))
        FROM public.following f JOIN public.profile p ON f.following_profile_id = p.profile_id --Join the profiles in the following column with their profile  
        WHERE f.follower_profile_id = input_profile_id --Where the follower id is the input profile id
    );
END;

$$;