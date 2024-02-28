export type FsqPhoto = {
    id: string;
    created_at: Date;
    prefix: string;
    suffix: string;
    width: number;
    height: number;
    classifications: string[];
    tip: {
        id: string;
        created_at: Date;
        text: string;
        url: string;
        lang: string;
        agree_count: number;
        disagree_count: number;
    };
};

export type FsqCategory = {
    short_name: string;
    id: number;
    name: string;
    icon: {
        id: string;
        created_at: Date;
        prefix: string;
        suffix: string;
        width: number;
        height: number;
        classifications: string[];
        tip: {
            id: string;
            created_at: Date;
            text: string;
            url: string;
            lang: string;
            agree_count: number;
            disagree_count: number;
        };
    };
};

export type FsqPlace = {
    fsq_id: string;
    categories: FsqCategory[];
    chains: [
        {
            id: string;
            name: string;
        }
    ];
    date_closed: Date;
    description: string;
    distance: number;
    email: string;
    fax: string;
    features: {
        payment: {
            credit_cards: {
                accepts_credit_cards: object;
                amex: object;
                discover: object;
                visa: object;
                diners_club: object;
                master_card: object;
                union_pay: object;
            };
            digital_wallet: {
                accepts_nfc: object;
            };
        };
        food_and_drink: {
            alcohol: {
                bar_service: object;
                beer: object;
                byo: object;
                cocktails: object;
                full_bar: object;
                wine: object;
            };
            meals: {
                bar_snacks: object;
                breakfast: object;
                brunch: object;
                lunch: object;
                happy_hour: object;
                dessert: object;
                dinner: object;
                tasting_menu: object;
            };
        };
        services: {
            delivery: object;
            takeout: object;
            drive_through: object;
            dine_in: {
                reservations: object;
                online_reservations: object;
                groups_only_reservations: object;
                essential_reservations: object;
            };
        };
        amenities: {
            restroom: object;
            smoking: object;
            jukebox: object;
            music: object;
            live_music: object;
            private_room: object;
            outdoor_seating: object;
            tvs: object;
            atm: object;
            coat_check: object;
            wheelchair_accessible: object;
            parking: {
                parking: object;
                street_parking: object;
                valet_parking: object;
                public_lot: object;
                private_lot: object;
            };
            sit_down_dining: object;
            wifi: string;
        };
        attributes: {
            business_meeting: string;
            clean: string;
            crowded: string;
            dates_popular: string;
            dressy: string;
            families_popular: string;
            gluten_free_diet: string;
            good_for_dogs: string;
            groups_popular: string;
            healthy_diet: string;
            late_night: string;
            noisy: string;
            quick_bite: string;
            romantic: string;
            service_quality: string;
            singles_popular: string;
            special_occasion: string;
            trendy: string;
            value_for_money: string;
            vegan_diet: string;
            vegetarian_diet: string;
        };
    };
    geocodes: {
        drop_off: {
            latitude: number;
            longitude: number;
        };
        front_door: {
            latitude: number;
            longitude: number;
        };
        main: {
            latitude: number;
            longitude: number;
        };
        road: {
            latitude: number;
            longitude: number;
        };
        roof: {
            latitude: number;
            longitude: number;
        };
    };
    hours: {
        display: string;
        is_local_holiday: true;
        open_now: true;
        regular: [
            {
                close: string;
                day: number;
                open: string;
            }
        ];
    };
    hours_popular: [
        {
            close: string;
            day: number;
            open: string;
        }
    ];
    link: string;
    location: {
        address: string;
        address_extended: string;
        admin_region: string;
        census_block: string;
        country: string;
        cross_street: string;
        dma: string;
        formatted_address: string;
        locality: string;
        neighborhood: string[];
        po_box: string;
        post_town: string;
        postcode: string;
        region: string;
    };
    menu: string;
    name: string;
    photos: FsqPhoto[];
    popularity: number;
    price: number;
    rating: number;
    related_places: object;
    social_media: {
        facebook_id: string;
        instagram: string;
        twitter: string;
    };
    stats: {
        total_photos: number;
        total_ratings: number;
        total_tips: number;
    };
    store_id: string;
    tastes: string[];
    tel: string;
    timezone: string;
    tips: [
        {
            id: string;
            created_at: Date;
            text: string;
            url: string;
            lang: string;
            agree_count: number;
            disagree_count: number;
        }
    ];
    verified: true;
    website: string;
};
