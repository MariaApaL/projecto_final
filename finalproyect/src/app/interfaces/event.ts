export interface EventsInterface {
        _id:         string;
        name:        string;
        categories:  any[];
        date:        Date;
        location:    string;
        price:       number;
        author:      string;
        plazas:      string[];
        numPlazas:   number;
        isFavorite:  boolean;
        description: string;
        comments:    any[];
        createdAt:   Date;
        updatedAt:   Date;
        __v:         number;
    }