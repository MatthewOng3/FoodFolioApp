-- Profile Table
CREATE TABLE profile
(
    profile_id       SERIAL PRIMARY KEY,
    user_id          uuid REFERENCES auth.users (id) ON DELETE CASCADE,
    updated_at       timestamptz DEFAULT now(),
    profile_username TEXT NOT NULL UNIQUE CHECK (char_length(profile_username) > 1),
    profile_avatar   TEXT        DEFAULT NULL,
    profile_bio      TEXT        DEFAULT NULL
);

ALTER TABLE profile
    ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view profiles" ON profile
    FOR SELECT USING (TRUE);

CREATE POLICY "Users can add their own profile." ON profile
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profiles." ON profile
    FOR UPDATE USING (auth.uid() = user_id);

CREATE INDEX index_profile_id ON public.profile (profile_id);

-- Profile Avatars
-- Set up Storage!
INSERT INTO storage.buckets (id, name)
VALUES ('profile_avatars', 'profile_avatars');

CREATE POLICY "Users can modify their profile picture" ON storage.objects
    FOR SELECT TO authenticated USING (bucket_id = 'profile_avatars' AND name = auth.uid()::TEXT);

CREATE POLICY "Users can modify their profile picture" ON storage.objects
    FOR INSERT TO authenticated WITH CHECK (bucket_id = 'profile_avatars' AND name = auth.uid()::TEXT);

CREATE POLICY "Users can modify their profile picture" ON storage.objects
    FOR UPDATE TO authenticated USING (bucket_id = 'profile_avatars' AND name = auth.uid()::TEXT);

CREATE POLICY "Users can modify their profile picture sj9tpg_3" ON storage.objects
    FOR DELETE TO authenticated USING (bucket_id = 'profile_avatars' AND name = auth.uid()::TEXT);

-- Place Table

CREATE TABLE place
(
    place_id                SERIAL PRIMARY KEY,
    place_google_id         TEXT UNIQUE NOT NULL,
    place_saved_count       int8 DEFAULT 0,
    place_recommended_count int8 DEFAULT 0
);

ALTER TABLE place
    ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON place TO PUBLIC;
GRANT UPDATE (place_saved_count, place_recommended_count) ON place TO PUBLIC;

CREATE INDEX index_place_id ON public.place (place_id);

-- List Table
CREATE TABLE list
(
    list_id          SERIAL PRIMARY KEY,
    list_uuid        uuid        DEFAULT gen_random_uuid(),
    profile_id       INTEGER REFERENCES public.profile (profile_id) ON DELETE CASCADE,
    user_id          uuid REFERENCES public.profile (user_id) ON DELETE CASCADE,
    updated_at       timestamptz DEFAULT now(),
    list_name        TEXT NOT NULL,
    list_description TEXT        DEFAULT NULL,
    list_is_public   bool        DEFAULT TRUE
);

-- A user cannot have multiple lists with the same name
ALTER TABLE list
    ENABLE ROW LEVEL SECURITY;
ALTER TABLE list
    ADD CONSTRAINT unique_list_row UNIQUE (list_id, profile_id);

CREATE POLICY "Users can view their own lists and public lists." ON list
    FOR SELECT USING (auth.uid() = user_id OR list_is_public = TRUE);

CREATE POLICY "Users can add their own lists." ON list
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own lists." ON list
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own lists." ON list
    FOR DELETE USING (auth.uid() = user_id);

--Create index
CREATE INDEX index_list_profile_id ON public.list (profile_id);
CREATE INDEX index_list_list_id ON public.list (list_id);

-- List Entry Table
CREATE TABLE list_entry
(
    list_entry_id          SERIAL PRIMARY KEY,
    list_id                INTEGER NOT NULL,
    profile_id             INTEGER NOT NULL,
    user_id                uuid    NOT NULL DEFAULT auth.uid(),
    place_google_id        TEXT    NOT NULL REFERENCES public.place (place_google_id) ON DELETE CASCADE,
    entry_type             int4    NOT NULL,
    added_at               timestamptz      DEFAULT now(),
    list_entry_description TEXT
);

--Meaning each list can only have one place google id in it

ALTER TABLE list_entry
    ENABLE ROW LEVEL SECURITY;

ALTER TABLE list_entry
    ADD CONSTRAINT unique_list_entry_row UNIQUE (list_id, place_google_id, profile_id);

ALTER TABLE list_entry
    ADD CONSTRAINT fk_list_entry_list_id_profile_id
        FOREIGN KEY (list_id, profile_id)
            REFERENCES list (list_id, profile_id)
            ON DELETE CASCADE;

CREATE POLICY "Users can view their own, or public list entries." ON list_entry
    FOR SELECT USING (
    auth.uid() = user_id
        OR (SELECT list_is_public
            FROM public.list
            WHERE public.list.list_id = list_entry.list_id) = TRUE
    );

CREATE POLICY "Users can add their own list entries." ON list_entry
    FOR INSERT WITH CHECK (
    auth.uid() = user_id
    );

CREATE POLICY "Users can update their own list entries." ON list_entry
    FOR UPDATE USING (
    auth.uid() = user_id
    );

CREATE POLICY "Users can delete their own list entries." ON list_entry
    FOR DELETE USING (
    auth.uid() = user_id
    );

CREATE INDEX index_list_entry_id ON public.list_entry (list_entry_id);

--=================================================================
--                  User Taste Pref table
--=================================================================
--Taste pref table
CREATE TABLE public.user_taste_pref
(
    taste_id   SERIAL PRIMARY KEY,
    taste_name TEXT
);

--Create index for taste id column in taste pref table
CREATE INDEX taste_id_index
    ON public.taste_pref (taste_id);

--=================================================================
--                User taste preferences lookup table
--=================================================================
--User_taste_pref junction table
CREATE TABLE public.user_taste_pref
(
    profile_id INTEGER REFERENCES profile (profile_id),
    taste_id   INTEGER REFERENCES taste_pref (taste_id),
    PRIMARY KEY (profile_id, taste_id)
);

ALTER TABLE user_taste_pref
    ENABLE ROW LEVEL SECURITY;


CREATE POLICY "Users can insert their own taste preferences"
    ON public.user_taste_pref
    FOR INSERT WITH CHECK (auth.uid() = (SELECT user_id
                                         FROM public.profile
                                         WHERE profile_id = user_taste_pref.profile_id));

CREATE POLICY "Users can delete their own taste preferences"
    ON public.user_taste_pref
    FOR DELETE
    USING (auth.uid() = (SELECT user_id
                         FROM public.profile
                         WHERE profile_id = user_taste_pref.profile_id));

-- Create following profile table
CREATE TABLE following
(
    following_user_id uuid REFERENCES auth.users (id) ON DELETE CASCADE,
    follower_user_id  uuid REFERENCES auth.users (id) ON DELETE CASCADE,
    following_date    timestamptz DEFAULT now() NOT NULL,
    PRIMARY KEY (following_user_id, follower_user_id)
);

ALTER TABLE following
    ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view who they are following and who is following them" ON following
    FOR SELECT USING (auth.uid() = following_user_id OR auth.uid() = follower_user_id);

CREATE POLICY "Authenticated users can follow profiles" ON following
    FOR INSERT WITH CHECK (auth.uid() = following_user_id);

CREATE POLICY "Authenticated users can unfollow profiles" ON following
    FOR DELETE USING (auth.uid() = following_user_id);

--=================================================================
--                      Following users table
--=================================================================
-- Create following profile table (USING PROFILE ID, JUST PUTTING IT HEERE FIRST -MATT)
CREATE TABLE following
(
    follower_profile_id  integer REFERENCES public.profile (profile_id) ON DELETE CASCADE,
    following_profile_id integer REFERENCES public.profile (profile_id) ON DELETE CASCADE,
    following_date  timestamptz DEFAULT now() NOT NULL,
    PRIMARY KEY (following_profile_id, follower_profile_id)
);

ALTER TABLE following
    ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view who they are following and who is following them" ON following
    FOR SELECT USING ((follower_profile_id IN ( SELECT (((auth.jwt() -> 'app_metadata'::text) ->> 'profile_id'::text))::integer AS int4)) OR (following_profile_id IN ( SELECT (((auth.jwt() -> 'app_metadata'::text) ->> 'profile_id'::text))::integer AS int4)));

CREATE POLICY "Authenticated users can follow profiles" ON following
    FOR INSERT WITH CHECK ((follower_profile_id IN ( SELECT (((auth.jwt() -> 'app_metadata'::text) ->> 'profile_id'::text))::integer AS int4)));

CREATE POLICY "Authenticated users can unfollow profiles" ON following
    FOR DELETE USING ((follower_profile_id IN ( SELECT (((auth.jwt() -> 'app_metadata'::text) ->> 'profile_id'::text))::integer AS int4)));

--Used when finding all users a user is following
CREATE INDEX idx_follower_profile_id ON public.following (follower_profile_id);
--Used when finding all followers of a user
CREATE INDEX idx_following_profile_id ON public.following (following_profile_id);

--=================================================================
--                      Blocking users table
--=================================================================
CREATE TABLE block
(
    blocker_id  integer REFERENCES public.profile (profile_id) ON DELETE CASCADE,
    blocked_id integer REFERENCES public.profile (profile_id) ON DELETE CASCADE,
    blocked_date  timestamptz DEFAULT now() NOT NULL,
    PRIMARY KEY (blocker_id, blocked_id)
);

ALTER TABLE following
    ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view who they are blocking" ON following
    FOR SELECT USING ((blocker_id IN ( SELECT (((auth.jwt() -> 'app_metadata'::text) ->> 'profile_id'::text))::integer AS int4)) OR (following_profile_id IN ( SELECT (((auth.jwt() -> 'app_metadata'::text) ->> 'profile_id'::text))::integer AS int4)));

CREATE POLICY "Authenticated users can block profiles" ON following
    FOR INSERT WITH CHECK ((blocker_id IN ( SELECT (((auth.jwt() -> 'app_metadata'::text) ->> 'profile_id'::text))::integer AS int4)));

CREATE POLICY "Authenticated users can unblock profiles" ON following
    FOR DELETE USING ((blocker_id IN ( SELECT (((auth.jwt() -> 'app_metadata'::text) ->> 'profile_id'::text))::integer AS int4)));

--Used when finding all users a user has blocked
CREATE INDEX idx_blocker_id ON public.block (blocker_id);

--=================================================================
--                      Following list table
--=================================================================
CREATE TABLE following_list
(
    user_id             uuid REFERENCES auth.users (id) ON DELETE CASCADE,
    list_id             INTEGER REFERENCES public.list (list_id) ON DELETE CASCADE,
    following_list_date timestamptz DEFAULT now() NOT NULL,
    PRIMARY KEY (user_id, list_id)
);

CREATE POLICY "Users can view the lists they are following" ON following_list
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can follow lists" ON following_list
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users can unfollow lists" ON following_list
    FOR DELETE USING (auth.uid() = user_id);
