CREATE
    OR REPLACE FUNCTION get_profile_preview(input_profile_id integer)
    returns jsonb
    LANGUAGE plpgsql
    STABLE PARALLEL SAFE
AS
$$
BEGIN
  RETURN (
    SELECT jsonb_build_object(
            'profileId', profile_id,
            'profileUsername', profile_username,
            'profileAvatar', profile_avatar
          )
    FROM public.profile
    WHERE profile_id = input_profile_id
  );
END
$$;
