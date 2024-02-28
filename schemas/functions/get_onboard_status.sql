CREATE
    OR REPLACE FUNCTION get_onboard_status(input_profile_id integer)
    returns boolean
    LANGUAGE plpgsql
    STABLE PARALLEL SAFE
AS
$$

BEGIN
    RETURN (
        SELECT completed_onboarding FROM public.profile
        WHERE profile_id = input_profile_id
    );
END;

$$;