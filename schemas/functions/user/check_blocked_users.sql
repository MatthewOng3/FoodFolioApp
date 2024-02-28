CREATE OR REPLACE FUNCTION check_blocked_users(
    input_profile_ids INTEGER[],
    session_profile_id INTEGER
) RETURNS INTEGER[] AS
$$
DECLARE
    blocked_ids INTEGER[] := '{}'; -- Initialize an empty array
    blocked_id INTEGER;
BEGIN
    -- Loop through each profile ID in the input list
    FOREACH blocked_id IN ARRAY input_profile_ids LOOP
        -- Check if the user is blocked by the session profile ID
        IF EXISTS (
            SELECT 1
            FROM public.block
            WHERE blocker_id = session_profile_id
            AND blocked_id = blocked_id
        ) THEN
            -- User is blocked, skip adding to the result array
        ELSE
            -- User is not blocked, add to the result array
            blocked_ids := array_append(blocked_ids, blocked_id);
        END IF;
    END LOOP;

    -- Return the array of IDs of users not blocked
    RETURN blocked_ids;
END;
$$
LANGUAGE plpgsql;
