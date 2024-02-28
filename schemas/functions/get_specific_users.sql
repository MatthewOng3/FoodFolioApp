CREATE OR REPLACE FUNCTION get_specific_users(
    user_profile_ids integer[]
) RETURNS jsonb
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
        ))
        FROM public.profile p
        WHERE p.profile_id = ANY(user_profile_ids)
    );
END;
$$;
