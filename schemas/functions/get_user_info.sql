CREATE
    OR REPLACE FUNCTION get_user_info(input_profile_id integer)
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
            'profileBio', profile_bio,
            'profileAvatar', profile_avatar,
            'profileTastePrefs', COALESCE(get_profile_taste_pref(input_profile_id), jsonb_build_array()),
            'profileJoined', joined_on,
            'profileCompletedOnboarding', completed_onboarding,
            'profileEmail', get_user_email(input_profile_id) -- Select email from auth.users
          )
    FROM public.profile 
    WHERE profile_id = input_profile_id
  );
END

$$;

