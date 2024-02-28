export type GoogleLatLng = {
    latitude: number;
    longitude: number;
};

export type GoogleLocalizedText = {
    text: string;
    languageCode: string;
};

export type GooglePhoto = {
    name: string;
    widthPx: number;
    heightPx: number;
    authorAttributions: [
        {
            object(AuthorAttribution);
        }
    ];
};

export type GooglePlace = {
    name: string;
    id: string;
    displayName: GoogleLocalizedText;
    types: [string];
    primaryType: string;
    primaryTypeDisplayName: GoogleLocalizedText;
    nationalPhoneNumber: string;
    internationalPhoneNumber: string;
    formattedAddress: string;
    shortFormattedAddress: string;
    addressComponents: [
        {
            object(AddressComponent);
        }
    ];
    plusCode: {
        object(PlusCode);
    };
    location: GoogleLatLng;
    viewport: {
        object(Viewport);
    };
    rating: number;
    googleMapsUri: string;
    websiteUri: string;
    reviews: [
        {
            object(Review);
        }
    ];
    regularOpeningHours: {
        object(OpeningHours);
    };
    photos: GooglePhoto[];
    adrFormatAddress: string;
    businessStatus:
        | "BUSINESS_STATUS_UNSPECIFIED"
        | "OPERATIONAL"
        | "CLOSED_TEMPORARILY"
        | "CLOSED_PERMANENTLY";
    priceLevel:
        | "PRICE_LEVEL_UNSPECIFIED"
        | "PRICE_LEVEL_FREE"
        | "PRICE_LEVEL_INEXPENSIVE"
        | "PRICE_LEVEL_MODERATE"
        | "PRICE_LEVEL_EXPENSIVE"
        | "PRICE_LEVEL_VERY_EXPENSIVE";
    attributions: [
        {
            object(Attribution);
        }
    ];
    iconMaskBaseUri: string;
    iconBackgroundColor: string;
    currentOpeningHours: {
        object(OpeningHours);
    };
    currentSecondaryOpeningHours: [
        {
            object(OpeningHours);
        }
    ];
    regularSecondaryOpeningHours: [
        {
            object(OpeningHours);
        }
    ];
    editorialSummary: {
        object(LocalizedText);
    };
    paymentOptions: {
        object(PaymentOptions);
    };
    parkingOptions: {
        object(ParkingOptions);
    };
    subDestinations: [
        {
            object(SubDestination);
        }
    ];
    fuelOptions: {
        object(FuelOptions);
    };
    evChargeOptions: {
        object(EVChargeOptions);
    };
    utcOffsetMinutes: number;
    userRatingCount: number;
    takeout: boolean;
    delivery: boolean;
    dineIn: boolean;
    curbsidePickup: boolean;
    reservable: boolean;
    servesBreakfast: boolean;
    servesLunch: boolean;
    servesDinner: boolean;
    servesBeer: boolean;
    servesWine: boolean;
    servesBrunch: boolean;
    servesVegetarianFood: boolean;
    outdoorSeating: boolean;
    liveMusic: boolean;
    menuForChildren: boolean;
    servesCocktails: boolean;
    servesDessert: boolean;
    servesCoffee: boolean;
    goodForChildren: boolean;
    allowsDogs: boolean;
    restroom: boolean;
    goodForGroups: boolean;
    goodForWatchingSports: boolean;
    accessibilityOptions: {
        object(AccessibilityOptions);
    };
};
